export function normalizeImageUrls(data: any): string[] {
  if (!data) return [];
  let urls: any = data.imageUrls ?? data.images ?? data.photos ?? data.image ?? [];
  if (typeof urls === 'string') return urls ? [urls] : [];
  if (Array.isArray(urls)) return urls.filter(Boolean);
  return [];
}
