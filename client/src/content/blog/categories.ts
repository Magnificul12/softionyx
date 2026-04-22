/**
 * Blog category registry.
 *
 * The visible name of every category is translated via i18n
 * (key: blog.categories.<id>). Icons are keys into our Icons component.
 */

import type { BlogCategoryId } from './types';

export type BlogCategory = {
  id: BlogCategoryId;
  icon: string;
  /** Tailwind hex color class (used for accent on cards, dots, badges). */
  color: string;
};

export const BLOG_CATEGORIES: BlogCategory[] = [
  { id: 'business',    icon: 'trending-up',  color: '#6366f1' },
  { id: 'development', icon: 'code',         color: '#8b5cf6' },
  { id: 'mobile',      icon: 'smartphone',   color: '#06b6d4' },
  { id: 'ecommerce',   icon: 'shopping-cart',color: '#f59e0b' },
  { id: 'seo',         icon: 'search',       color: '#10b981' },
  { id: 'security',    icon: 'shield',       color: '#ef4444' },
  { id: 'ai',          icon: 'cpu',          color: '#ec4899' },
  { id: 'cloud',       icon: 'cloud',        color: '#3b82f6' },
];

export function getCategory(id: BlogCategoryId): BlogCategory {
  return BLOG_CATEGORIES.find((c) => c.id === id) ?? BLOG_CATEGORIES[0];
}

export function isBlogCategoryId(id: string): id is BlogCategoryId {
  return BLOG_CATEGORIES.some((c) => c.id === id);
}
