import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { stripLangPrefix, withLangPrefix } from '../i18n/routing';

export const SITE_URL = 'https://softionyx.com';
export const SITE_NAME = 'SoftIonyx';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

// Supported app locales → Open Graph locale code mapping
export const SUPPORTED_LOCALES = ['ro', 'en', 'ru'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

const OG_LOCALE_MAP: Record<SupportedLocale, string> = {
  ro: 'ro_RO',
  en: 'en_US',
  ru: 'ru_RU',
};

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile' | string;
  noIndex?: boolean;
  canonical?: string;
  /** Override detected locale (e.g. "ro_RO"). If not provided, derived from i18n. */
  locale?: string;
  /**
   * Override alternate locales.
   * If not provided, generates RO/EN/RU alternates automatically for the current path.
   */
  alternateLocales?: { locale: string; href: string }[];
  /**
   * When true (default), emits hreflang alternates for all supported locales + x-default.
   * Set false to disable (e.g. for noIndex pages).
   */
  emitHreflang?: boolean;
  jsonLd?: Record<string, any> | Record<string, any>[];
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

function absoluteUrl(pathOrUrl?: string): string | undefined {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  if (pathOrUrl.startsWith('/')) return `${SITE_URL}${pathOrUrl}`;
  return `${SITE_URL}/${pathOrUrl}`;
}

function normalizeLangCode(lang?: string): SupportedLocale {
  if (!lang) return 'ro';
  const base = lang.toLowerCase().split('-')[0];
  if ((SUPPORTED_LOCALES as readonly string[]).includes(base)) return base as SupportedLocale;
  return 'ro';
}

export default function SEO({
  title = 'SoftIonyx Technologies - Professional IT Solutions',
  description = 'We deliver cutting-edge technology solutions including web development, frontend & backend services, blockchain analytics, and expert programming across multiple languages.',
  keywords = 'IT solutions, web development, software development, blockchain, programming, SoftIonyx',
  image,
  url,
  type = 'website',
  noIndex = false,
  canonical,
  locale,
  alternateLocales,
  // This app uses language-prefixed URLs (/{ro|en|ru}/...). hreflang is safe and
  // recommended in this setup, so it's enabled by default.
  emitHreflang = true,
  jsonLd,
  publishedTime,
  modifiedTime,
  author = 'SoftIonyx Technologies',
}: SEOProps) {
  const location = useLocation();
  const { i18n } = useTranslation();
  const currentLang = normalizeLangCode(i18n.language);
  const ogLocale = locale || OG_LOCALE_MAP[currentLang];

  // Normalize pathname: strip trailing slash (except for the root "/")
  const normalizedPath =
    location.pathname.length > 1 ? location.pathname.replace(/\/+$/, '') : location.pathname;
  const currentPath = normalizedPath + location.search;

  // Ensure any provided url/canonical uses language-prefixed paths.
  const normalizeProvidedPath = (p?: string) => {
    if (!p) return undefined;
    if (/^https?:\/\//i.test(p)) return p;
    if (!p.startsWith('/')) return `/${p}`;
    // If caller passes "/blog", prefix it to "/{lang}/blog"
    const alreadyLang = /^\/(ro|en|ru)(\/|$)/i.test(p);
    return alreadyLang ? p : withLangPrefix(currentLang, p);
  };

  const finalUrl =
    absoluteUrl(normalizeProvidedPath(url)) || `${SITE_URL}${currentPath}`;

  // Canonical should be a stable page URL (no query string). Also ensure it has lang prefix.
  const inferredCanonicalPath = withLangPrefix(currentLang, stripLangPrefix(normalizedPath));
  const finalCanonical =
    absoluteUrl(normalizeProvidedPath(canonical)) || `${SITE_URL}${inferredCanonicalPath}`;
  const finalImage = absoluteUrl(image) || DEFAULT_OG_IMAGE;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  const jsonLdArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  // Auto-generate hreflang alternates for current path if not provided
  const pathNoLang = stripLangPrefix(normalizedPath);
  const hreflangAlternates =
    emitHreflang && !noIndex && !alternateLocales
      ? SUPPORTED_LOCALES.map((lang) => ({
          locale: lang,
          href: `${SITE_URL}${withLangPrefix(lang, pathNoLang)}`,
        }))
      : alternateLocales;

  return (
    <Helmet>
      {/* Dynamic <html lang> based on current i18n language */}
      <html lang={currentLang} />

      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta
        name="robots"
        content={noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1'}
      />

      {/* Canonical */}
      <link rel="canonical" href={finalCanonical} />

      {/* Alternate locales (hreflang) */}
      {hreflangAlternates?.map((alt) => (
        <link key={alt.locale} rel="alternate" hrefLang={alt.locale} href={absoluteUrl(alt.href)} />
      ))}
      {hreflangAlternates && hreflangAlternates.length > 0 && !noIndex && (
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${SITE_URL}${withLangPrefix('ro', pathNoLang)}`}
        />
      )}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={ogLocale} />
      {SUPPORTED_LOCALES.filter((l) => l !== currentLang).map((l) => (
        <meta key={`og-${l}`} property="og:locale:alternate" content={OG_LOCALE_MAP[l]} />
      ))}

      {/* Article-specific OG tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && <meta property="article:author" content={author} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={finalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:image:alt" content={fullTitle} />

      {/* JSON-LD structured data */}
      {jsonLdArray.map((data, i) => (
        <script key={`jsonld-${i}`} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}
