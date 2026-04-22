// Lightweight UA parser. Kept dep-free intentionally — the goal is coarse
// classification (mobile/tablet/desktop, browser family, os family), not
// pixel-perfect analytics.

import geoip from 'geoip-lite';

export type DeviceKind = 'mobile' | 'tablet' | 'desktop' | 'bot' | 'unknown';

export function parseUserAgent(ua: string | undefined | null): {
  device: DeviceKind;
  os: string;
  browser: string;
  isBot: boolean;
} {
  if (!ua) return { device: 'unknown', os: 'unknown', browser: 'unknown', isBot: false };

  const s = ua.toLowerCase();

  const isBot =
    /bot|crawler|spider|crawling|facebookexternalhit|slurp|yandex|bingpreview|duckduckbot|linkedinbot|applebot|twitterbot|whatsapp|telegram|discordbot|prerender|headlesschrome|lighthouse|pagespeed/.test(
      s
    );

  const isTablet = /ipad|tablet|playbook|silk|kindle/.test(s) && !/mobile/.test(s);
  const isMobile = !isTablet && /mobi|iphone|ipod|android.*mobile|windows phone|blackberry|bb10|opera mini/.test(s);

  let device: DeviceKind = 'desktop';
  if (isBot) device = 'bot';
  else if (isTablet) device = 'tablet';
  else if (isMobile) device = 'mobile';

  let os = 'unknown';
  if (/windows nt/.test(s)) os = 'Windows';
  else if (/android/.test(s)) os = 'Android';
  else if (/iphone|ipad|ipod/.test(s)) os = 'iOS';
  else if (/mac os x/.test(s)) os = 'macOS';
  else if (/cros/.test(s)) os = 'ChromeOS';
  else if (/linux/.test(s)) os = 'Linux';

  let browser = 'unknown';
  // Order matters — Edge/Opera/Vivaldi before Chrome, mobile safari before safari
  if (/edg\//.test(s)) browser = 'Edge';
  else if (/opr\/|opera\//.test(s)) browser = 'Opera';
  else if (/vivaldi\//.test(s)) browser = 'Vivaldi';
  else if (/firefox\//.test(s)) browser = 'Firefox';
  else if (/chrome\//.test(s) && !/edg\//.test(s)) browser = 'Chrome';
  else if (/safari\//.test(s)) browser = 'Safari';

  return { device, os, browser, isBot };
}

export function normalizeLanguage(accept: string | undefined | null): string {
  if (!accept) return '';
  const primary = accept.split(',')[0]?.trim().split('-')[0] ?? '';
  return primary.toLowerCase().slice(0, 5);
}

export function extractCountryFromHeaders(req: {
  headers: Record<string, string | string[] | undefined>;
}): string {
  // Prefer CDN-provided headers (Cloudflare, Vercel), fall back to nothing.
  const cf = req.headers['cf-ipcountry'];
  const vercel = req.headers['x-vercel-ip-country'];
  const fastly = req.headers['x-country-code'];
  const pick = (v: unknown): string =>
    typeof v === 'string' ? v.toUpperCase().slice(0, 2) : '';
  return pick(cf) || pick(vercel) || pick(fastly) || '';
}

export interface GeoInfo {
  country: string;
  region: string;
  city: string;
}

// Returns true for addresses that cannot be geolocated (localhost / private
// LAN ranges). Those come from dev traffic or reverse proxies that didn't
// forward the real client IP.
function isLocalAddress(ip: string): boolean {
  if (!ip) return true;
  const v = ip.replace(/^::ffff:/, '');
  if (v === '::1' || v === '127.0.0.1') return true;
  if (/^10\./.test(v)) return true;
  if (/^192\.168\./.test(v)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(v)) return true;
  if (/^169\.254\./.test(v)) return true;
  if (/^fe80:/i.test(v)) return true;
  return false;
}

function decodeMaybe(s: string): string {
  // CDNs sometimes URL-encode city names with spaces and diacritics.
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

/**
 * Resolve the visitor's geo in a layered way:
 *   1. Honor CDN headers if present (Cloudflare / Vercel) — cheap and accurate.
 *   2. Otherwise fall back to the offline geoip-lite DB.
 *   3. Private / loopback addresses resolve to empty strings (caller decides).
 */
export function resolveGeo(
  req: { headers: Record<string, string | string[] | undefined>; ip?: string },
  ipOverride?: string
): GeoInfo {
  const h = req.headers;
  const pickStr = (v: unknown): string => (typeof v === 'string' ? v : '');

  const cdnCountry =
    pickStr(h['cf-ipcountry']) ||
    pickStr(h['x-vercel-ip-country']) ||
    pickStr(h['x-country-code']);
  const cdnRegion =
    pickStr(h['cf-region']) ||
    pickStr(h['x-vercel-ip-country-region']);
  const cdnCity =
    pickStr(h['cf-ipcity']) ||
    pickStr(h['x-vercel-ip-city']);

  let country = cdnCountry.toUpperCase().slice(0, 2);
  let region = decodeMaybe(cdnRegion).slice(0, 64);
  let city = decodeMaybe(cdnCity).slice(0, 96);

  if ((!country || !city) && !isLocalAddress(ipOverride || req.ip || '')) {
    try {
      const lookup = geoip.lookup(ipOverride || req.ip || '');
      if (lookup) {
        if (!country) country = (lookup.country || '').toUpperCase().slice(0, 2);
        if (!region) region = (lookup.region || '').slice(0, 64);
        if (!city) city = (lookup.city || '').slice(0, 96);
      }
    } catch {
      // geoip-lite should never throw, but belt-and-suspenders.
    }
  }

  return { country, region, city };
}
