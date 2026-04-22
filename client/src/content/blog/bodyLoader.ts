/**
 * Lazy-loads the correct locale-specific article body from
 * `./posts/<slug>/<ro|en|ru>.tsx`. Falls back to Romanian if a locale file
 * is missing.
 */

import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import { appLangCode } from '../../utils/blogPostI18n';

const bodyModules = import.meta.glob('./posts/*/*.tsx') as Record<
  string,
  () => Promise<{ default: ComponentType }>
>;

export function createLazyArticleBody(
  slug: string,
  lang: string
): LazyExoticComponent<ComponentType> {
  const code = appLangCode(lang);
  const primary = `./posts/${slug}/${code}.tsx`;
  const fallback = `./posts/${slug}/ro.tsx`;
  const load = bodyModules[primary] ?? bodyModules[fallback];
  if (!load) {
    throw new Error(
      `[blog] missing article body for "${slug}". Expected ${primary} or ${fallback}.`
    );
  }
  return lazy(load);
}
