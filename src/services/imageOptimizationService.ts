/**
 * Image Optimization Service
 * Handles image resizing, compression, and format conversion
 */

interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

const DEFAULT_OPTIONS: ImageOptimizationOptions = {
  maxWidth: 1280,
  maxHeight: 720,
  quality: 0.8,
  format: 'webp',
};

/**
 * Get optimized image URL from Firebase Storage
 * Uses Firebase Storage's built-in image optimization
 */
export function getOptimizedImageUrl(
  firebaseStorageUrl: string,
  options: ImageOptimizationOptions = {}
): string {
  const config = { ...DEFAULT_OPTIONS, ...options };

  // Firebase Storage image transformation parameters
  const params = new URLSearchParams();
  
  if (config.maxWidth) params.append('w', config.maxWidth.toString());
  if (config.maxHeight) params.append('h', config.maxHeight.toString());
  
  // Quality parameter (0-100)
  const qualityPercent = Math.round((config.quality || 0.8) * 100);
  params.append('q', qualityPercent.toString());

  // Add format parameter
  if (config.format === 'webp') {
    params.append('f', 'webp');
  }

  const paramString = params.toString();
  return paramString ? `${firebaseStorageUrl}?${paramString}` : firebaseStorageUrl;
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(
  firebaseStorageUrl: string,
  widths: number[] = [640, 1024, 1280]
): string {
  return widths
    .map((width) => {
      const url = getOptimizedImageUrl(firebaseStorageUrl, { maxWidth: width });
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Get thumbnail URL for image preview
 */
export function getThumbnailUrl(
  firebaseStorageUrl: string,
  size: 'small' | 'medium' | 'large' = 'medium'
): string {
  const sizes = {
    small: { maxWidth: 300, maxHeight: 300, quality: 0.6 },
    medium: { maxWidth: 600, maxHeight: 600, quality: 0.7 },
    large: { maxWidth: 1024, maxHeight: 1024, quality: 0.8 },
  };

  return getOptimizedImageUrl(firebaseStorageUrl, sizes[size]);
}

/**
 * Check if image URL is from Firebase Storage
 */
export function isFirebaseStorageUrl(url: string): boolean {
  return url.includes('firebaseapp.com') || url.includes('storage.googleapis.com');
}

/**
 * Optimize all image URLs in an array
 */
export function optimizeImageUrls(
  urls: string[],
  options: ImageOptimizationOptions = {}
): string[] {
  return urls.map((url) =>
    isFirebaseStorageUrl(url) ? getOptimizedImageUrl(url, options) : url
  );
}
