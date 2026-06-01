/**
 * Normalize image URLs from various data formats
 * Filters invalid URLs and returns only valid HTTP/data/relative URLs
 * @param data - Object that may contain image URLs
 * @returns Array of validated image URLs
 */
export function normalizeImageUrls(data: unknown): string[] {
  if (!data || typeof data !== 'object') return [];

  // Check multiple property names
  const possibleUrls = (data as Record<string, unknown>).imageUrls 
    ?? (data as Record<string, unknown>).images 
    ?? (data as Record<string, unknown>).photos 
    ?? (data as Record<string, unknown>).image 
    ?? (data as Record<string, unknown>).photo 
    ?? [];

  // Normalize to array
  let urls: string[] = [];
  if (typeof possibleUrls === 'string') {
    urls = possibleUrls ? [possibleUrls] : [];
  } else if (Array.isArray(possibleUrls)) {
    urls = possibleUrls.map(String).filter(Boolean);
  }

  // Filter valid URLs
  return urls.filter(url => {
    if (!url || typeof url !== 'string') return false;
    // Accept http, https, data URIs, and relative paths
    return url.startsWith('http://') 
      || url.startsWith('https://') 
      || url.startsWith('data:') 
      || url.startsWith('/');
  });
}

/**
 * Get the first valid image URL from data
 * @param data - Object that may contain image URLs
 * @returns First valid image URL or undefined
 */
export function getFirstImage(data: unknown): string | undefined {
  return normalizeImageUrls(data)[0];
}
