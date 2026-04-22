/**
 * Blog data model.
 *
 * Per-post metadata lives in `posts.json` so it can also be read from
 * Node scripts (sitemap, RSS, prerender). The actual article body is a
 * locale-specific TSX components in `./posts/<slug>/<ro|en|ru>.tsx` that render
 * the prose (h2/h3/p/ul/pre/img/etc) using `.prose-soft` typography.
 */

export type BlogLocale = 'ro' | 'en' | 'ru';

export type BlogCategoryId =
  | 'business'
  | 'development'
  | 'mobile'
  | 'ecommerce'
  | 'seo'
  | 'security'
  | 'ai'
  | 'cloud';

export type BlogAuthor = {
  name: string;
  role?: string;
  /** Path under /public (e.g. "/team/alex.jpg") or empty string. */
  avatar?: string;
  /** Optional short bio; shown in article footer. */
  bio?: string;
};

export type BlogTocItem = {
  /** DOM id of the heading in the body component. */
  id: string;
  /** Human-readable heading title (displayed in TOC). */
  title: string;
  /** Heading level (2 = H2, 3 = H3). We skip H1 — article title is THE H1. */
  level: 2 | 3;
};

/** Shape in posts.json — pure data, imported by scripts too. */
export type BlogPostMeta = {
  slug: string;
  locale: BlogLocale;
  title: string;
  metaTitle?: string;
  metaDescription: string;
  keywords?: string;
  excerpt: string;
  /** Cover image. 1600x900 WEBP under /public/blog/ recommended. */
  cover: string;
  coverAlt?: string;
  category: BlogCategoryId;
  tags: string[];
  author: BlogAuthor;
  /** ISO-8601 date: "2026-04-21" */
  publishedAt: string;
  /** Last substantive edit. Defaults to publishedAt. */
  updatedAt?: string;
  /** Estimated read time in minutes (rounded). */
  readingTimeMin: number;
  /** Highlighted in "Featured" strip on /blog. */
  featured?: boolean;
  /** Optional hand-curated TOC. If omitted, body's headings are expected to be
   *  present but TOC sidebar simply won't show. */
  toc?: BlogTocItem[];
  /** Slugs of related blog posts — drives the "Related" footer. */
  relatedSlugs?: string[];
  /** Service slugs this article links to (used for internal linking hints). */
  linksToServices?: string[];
  /**
   * Topic cluster (Faza 3 hub-and-spoke). Posts with the same id are cross-linked
   * as a series; optional pillar page uses `isPillar: true`.
   */
  clusterId?: string;
  isPillar?: boolean;
};

/** Runtime post in lists/detail — same as manifest; body is loaded per-locale via `createLazyArticleBody`. */
export type BlogPost = BlogPostMeta;
