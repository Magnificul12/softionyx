/**
 * Blog runtime registry.
 *
 * Metadata lives in `posts.json`. Each article body lives in
 * `./posts/<slug>/<ro|en|ru>.tsx` and is lazy-loaded with `createLazyArticleBody`.
 *
 * Authoring a new post:
 *   1) Append metadata to posts.json
 *   2) Create `./posts/<slug>/ro.tsx` (+ `en.tsx` / `ru.tsx` for full i18n)
 *   3) Add `blogPosts.<slug>.*` strings to en/ru common.json (optional overlay for RO)
 */

import type { BlogPost, BlogPostMeta } from './types';
import postsManifest from './posts.json';

export { createLazyArticleBody } from './bodyLoader';

const sortedMeta = [...(postsManifest as BlogPostMeta[])].sort((a, b) =>
  (b.publishedAt || '').localeCompare(a.publishedAt || '')
);

export const BLOG_POSTS: BlogPost[] = sortedMeta;

export const BLOG_POSTS_META: BlogPostMeta[] = sortedMeta;

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

/** Other posts in the same topic cluster (hub-and-spoke), pillars first. */
export function getClusterPosts(
  clusterId: string,
  excludeSlug?: string
): BlogPost[] {
  return BLOG_POSTS.filter(
    (p) => p.clusterId === clusterId && p.slug !== excludeSlug
  ).sort((a, b) => {
    if (!!a.isPillar !== !!b.isPillar) return a.isPillar ? -1 : 1;
    return (b.publishedAt || '').localeCompare(a.publishedAt || '');
  });
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getPostBySlug(slug);
  if (!current) return [];

  const explicit = (current.relatedSlugs || [])
    .map((s) => getPostBySlug(s))
    .filter((p): p is BlogPost => !!p);

  if (explicit.length >= limit) return explicit.slice(0, limit);

  const candidates = BLOG_POSTS.filter((p) => p.slug !== slug).map((p) => {
    let score = 0;
    if (p.category === current.category) score += 2;
    score += p.tags.filter((t) => current.tags.includes(t)).length;
    if (current.clusterId && p.clusterId === current.clusterId) {
      score += 5;
      if (current.isPillar && !p.isPillar) score += 2;
      if (!current.isPillar && p.isPillar) score += 3;
    }
    return { post: p, score };
  });
  candidates.sort((a, b) => b.score - a.score);

  const byExplicit = new Set(explicit.map((p) => p.slug));
  const filler = candidates
    .map((c) => c.post)
    .filter((p) => !byExplicit.has(p.slug))
    .slice(0, limit - explicit.length);

  return [...explicit, ...filler];
}

export function getPostsByCategory(categoryId: string): BlogPost[] {
  if (!categoryId || categoryId === 'all') return BLOG_POSTS;
  return BLOG_POSTS.filter((p) => p.category === categoryId);
}

export function getFeaturedPost(): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0];
}

export type { BlogPost, BlogPostMeta } from './types';
