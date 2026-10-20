/**
 * High-Performance Image CDN Utility
 * 
 * Automatically transforms remote image URLs (Supabase Storage, Unsplash)
 * into device-optimized, edge-cached versions with custom widths and qualities.
 */

interface ImageCdnOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'origin' | 'webp' | 'avif';
}

/**
 * Returns an optimized CDN URL for a given image source.
 * - For Supabase Storage URLs: switches `/storage/v1/object/public/` to `/storage/v1/render/image/public/` with CDN resize & quality parameters.
 * - For Unsplash: applies standard `w=`, `q=`, `auto=format` CDN parameters.
 * - For local or other URLs: returns the clean path.
 */
export function getCdnImageUrl(src: string, options: ImageCdnOptions = {}): string {
  if (!src) return '/images/ai_ring1_front.jpg';

  let targetSrc = src;
  if (targetSrc.startsWith('/uploads/')) {
    targetSrc = `https://qphfuzfsjggfskwszdco.supabase.co/storage/v1/object/public/product-images/${targetSrc.replace('/uploads/', '')}`;
  }

  const { width, height, quality = 80, format = 'origin' } = options;

  // 1. Supabase Storage CDN Transformation
  if (targetSrc.includes('.supabase.co/storage/v1/object/public/')) {
    const transformedBase = targetSrc.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/'
    );
    const params = new URLSearchParams();
    if (width) params.set('width', String(Math.round(width)));
    if (height) params.set('height', String(Math.round(height)));
    if (quality) params.set('quality', String(quality));
    if (format && format !== 'origin') params.set('format', format);

    const queryString = params.toString();
    return queryString ? `${transformedBase}?${queryString}` : transformedBase;
  }

  // 2. Unsplash Image CDN
  if (targetSrc.includes('images.unsplash.com')) {
    try {
      const url = new URL(targetSrc);
      if (width) url.searchParams.set('w', String(Math.round(width)));
      if (quality) url.searchParams.set('q', String(quality));
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', 'crop');
      return url.toString();
    } catch {
      return targetSrc;
    }
  }

  return targetSrc;
}
