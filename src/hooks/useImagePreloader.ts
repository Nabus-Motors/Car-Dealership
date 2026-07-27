import { useEffect } from 'react';
import { preloadImages } from './useImageCache';

interface UseImagePreloaderOptions {
  delay?: number;
  priority?: 'low' | 'high';
}

/**
 * Hook to preload images in the background
 * Useful for carousel images or next/previous items
 */
export function useImagePreloader(
  imageUrls: (string | null | undefined)[],
  options: UseImagePreloaderOptions = {}
) {
  const { delay = 500, priority = 'low' } = options;

  useEffect(() => {
    const validUrls = imageUrls.filter((url): url is string => !!url);
    if (validUrls.length === 0) return;

    const timer = setTimeout(() => {
      if (priority === 'high') {
        // Preload immediately for high priority
        preloadImages(validUrls).catch(console.error);
      } else {
        // Use requestIdleCallback for low priority to avoid blocking main thread
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            preloadImages(validUrls).catch(console.error);
          });
        } else {
          // Fallback for browsers that don't support requestIdleCallback
          setTimeout(() => {
            preloadImages(validUrls).catch(console.error);
          }, delay);
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [imageUrls, delay, priority]);
}
