/**
 * Bottle packshots are shot on white. On the cream pages a white photo shows as a
 * white box, and CSS blending is not reliable on iPhone. So the server repaints
 * each packshot's white as this exact cream (see foto-crema/route.ts).
 * Keep in sync with --cream in catalog.module.css (.shell and .creamShop).
 */
export const CREAM_RGB = [246, 242, 235] as const;

const SUPABASE_PHOTOS = /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\//;

/** Only our own photos: the public /catalogo/ folder and the Supabase photo bucket. */
export function isCreamPhotoSource(src: string): boolean {
  if (src.startsWith("/catalogo/")) return !src.includes("..") && !src.includes("//", 1);
  return SUPABASE_PHOTOS.test(src);
}

/** URL of the same photo with its white background repainted cream. */
export function creamPhoto(src: string): string {
  return isCreamPhotoSource(src) ? `/catalogo-publico/foto-crema?src=${encodeURIComponent(src)}` : src;
}
