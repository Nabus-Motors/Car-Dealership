import { useEffect, useRef } from 'react';

interface CacheOptions {
  maxAge?: number; // milliseconds
  maxSize?: number; // bytes
}

// Simple in-memory cache for image URLs
const imageCache = new Map<string, { data: string; timestamp: number }>();
const MAX_CACHE_SIZE = 50; // max number of cached images
const DEFAULT_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

export function useImageCache(imageUrl: string | null | undefined, options: CacheOptions = {}) {
  const { maxAge = DEFAULT_MAX_AGE } = options;
  const cacheKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!imageUrl) return;

    // Check if image is already cached and still valid
    const cached = imageCache.get(imageUrl);
    if (cached) {
      const age = Date.now() - cached.timestamp;
      if (age < maxAge) {
        cacheKeyRef.current = imageUrl;
        return;
      } else {
        // Remove expired cache
        imageCache.delete(imageUrl);
      }
    }

    // Preload the image to cache it
    const img = new Image();
    img.src = imageUrl;

    const handleLoad = () => {
      // Cache the successful image load
      if (imageCache.size >= MAX_CACHE_SIZE) {
        // Remove oldest entry
        const firstKey = imageCache.keys().next().value;
        imageCache.delete(firstKey);
      }
      imageCache.set(imageUrl, {
        data: imageUrl,
        timestamp: Date.now(),
      });
      cacheKeyRef.current = imageUrl;
    };

    img.addEventListener('load', handleLoad);
    return () => img.removeEventListener('load', handleLoad);
  }, [imageUrl, maxAge]);

  return cacheKeyRef.current || imageUrl;
}

// Preload multiple images
export function preloadImages(urls: string[]): Promise<void> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            imageCache.set(url, {
              data: url,
              timestamp: Date.now(),
            });
            resolve();
          };
          img.onerror = resolve; // Don't fail the whole batch
          img.src = url;
        })
    )
  ).then(() => undefined);
}

// Clear cache
export function clearImageCache(): void {
  imageCache.clear();
}
