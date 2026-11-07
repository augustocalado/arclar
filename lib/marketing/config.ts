/**
 * IDs de remarketing/tracking.
 * São públicos por natureza (ficam expostos no navegador).
 */

export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || '';
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';
export const FACEBOOK_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '';

export const GOOGLE_TAG_ID = GOOGLE_ADS_ID || GA_ID;

export function marketingConfigurado(): boolean {
  return Boolean(GOOGLE_TAG_ID || FACEBOOK_PIXEL_ID);
}
