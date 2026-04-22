import type { TFunction, i18n as I18n } from 'i18next';
import type { BlogPostMeta, BlogTocItem } from '../content/blog/types';

export type ResolvedBlogPostStrings = {
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  coverAlt: string;
  authorName: string;
  authorRole: string;
  authorBio: string;
  toc: BlogTocItem[];
  tags: string[];
};

/** Base language code from i18n (`ru-RU` → `ru`). */
export function appLangCode(lang: string | undefined): 'ro' | 'en' | 'ru' {
  const base = (lang || 'ro').split('-')[0].toLowerCase();
  if (base === 'en' || base === 'ru') return base;
  return 'ro';
}

/** BCP 47 tag for `toLocaleDateString`. */
export function dateLocaleTag(lang: string | undefined): string {
  const a = appLangCode(lang);
  if (a === 'ru') return 'ru-RU';
  if (a === 'en') return 'en-US';
  return 'ro-RO';
}

/**
 * Overlay translated article chrome from `blogPosts.<slug>.*` in common.json.
 * Falls back to manifest (`posts.json`) when a key is absent (e.g. Romanian UI).
 */
export function resolveBlogPostStrings(
  i18n: I18n,
  t: TFunction,
  post: BlogPostMeta
): ResolvedBlogPostStrings {
  const slug = post.slug;
  const pick = (field: string, fallback: string) => {
    const key = `blogPosts.${slug}.${field}`;
    return i18n.exists(key) ? String(t(key)) : fallback;
  };
  const toc: BlogTocItem[] = (post.toc || []).map((item) => {
    const tk = `blogPosts.${slug}.toc.${item.id}`;
    return {
      ...item,
      title: i18n.exists(tk) ? String(t(tk)) : item.title,
    };
  });
  const tagsKey = `blogPosts.${slug}.tags`;
  let tags: string[];
  if (i18n.exists(tagsKey)) {
    const raw = t(tagsKey, { returnObjects: true });
    tags = Array.isArray(raw) ? (raw as unknown[]).map(String) : [...post.tags];
  } else {
    tags = [...post.tags];
  }
  return {
    title: pick('title', post.title),
    excerpt: pick('excerpt', post.excerpt),
    metaTitle: pick('metaTitle', post.metaTitle || post.title),
    metaDescription: pick('metaDescription', post.metaDescription),
    keywords: pick('keywords', post.keywords || ''),
    coverAlt: pick('coverAlt', post.coverAlt || post.title),
    authorName: pick('authorName', post.author.name),
    authorRole: pick('authorRole', post.author.role || ''),
    authorBio: pick('authorBio', post.author.bio || ''),
    toc,
    tags,
  };
}
