import fs from 'fs';
import path from 'path';

/** Subset of fields from client/src/content/blog/posts.json needed for SEO routes. */
export type StaticBlogManifestEntry = {
  slug: string;
  publishedAt?: string;
  updatedAt?: string;
  featured?: boolean;
  isPillar?: boolean;
};

const MANIFEST = path.join(
  process.cwd(),
  'client',
  'src',
  'content',
  'blog',
  'posts.json'
);

export function readStaticBlogManifest(): StaticBlogManifestEntry[] {
  try {
    if (!fs.existsSync(MANIFEST)) return [];
    const raw = JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) as unknown;
    return Array.isArray(raw) ? (raw as StaticBlogManifestEntry[]) : [];
  } catch {
    return [];
  }
}
