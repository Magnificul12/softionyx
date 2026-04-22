/**
 * Generate RSS 2.0 feed for the blog.
 *
 * Output: client/public/blog/rss.xml (Vite publishes /public as-is, so the
 * file is served at https://softionyx.com/blog/rss.xml).
 *
 * Consumes the same posts.json manifest as the runtime registry and the
 * sitemap generator — single source of truth.
 *
 * Run manually:   node scripts/generate-rss.js
 * Automatically invoked as part of the `prebuild` npm hook.
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://softionyx.com';
const SITE_TITLE = 'SoftIonyx — Blog';
const SITE_DESCRIPTION =
  'Articole și ghiduri despre dezvoltare web, SEO, e-commerce și IT în Moldova de la echipa SoftIonyx.';
const SITE_LANGUAGE = 'ro-md';

function escapeXml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822(isoDate) {
  const d = isoDate ? new Date(isoDate) : new Date();
  return d.toUTCString();
}

function main() {
  const manifestPath = path.resolve(
    __dirname,
    '..',
    'client',
    'src',
    'content',
    'blog',
    'posts.json'
  );

  let posts = [];
  try {
    posts = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (err) {
    console.error('rss: cannot read blog manifest -', err.message);
    process.exit(1);
  }

  posts.sort((a, b) =>
    (b.publishedAt || '').localeCompare(a.publishedAt || '')
  );

  const lastBuildDate = toRfc822(
    posts[0]?.updatedAt || posts[0]?.publishedAt || new Date().toISOString()
  );

  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`;
      const cover = p.cover
        ? p.cover.startsWith('http')
          ? p.cover
          : `${SITE_URL}${p.cover}`
        : `${SITE_URL}/og-image.jpg`;
      return [
        '  <item>',
        `    <title>${escapeXml(p.title)}</title>`,
        `    <link>${url}</link>`,
        `    <guid isPermaLink="true">${url}</guid>`,
        `    <pubDate>${toRfc822(p.publishedAt)}</pubDate>`,
        `    <dc:creator>${escapeXml(p.author?.name || 'SoftIonyx')}</dc:creator>`,
        `    <category>${escapeXml(p.category)}</category>`,
        `    <description>${escapeXml(p.excerpt || p.metaDescription || '')}</description>`,
        `    <enclosure url="${cover}" type="image/jpeg" length="0" />`,
        `    <media:content url="${cover}" medium="image" />`,
        '  </item>',
      ].join('\n');
    })
    .join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0"',
    '     xmlns:atom="http://www.w3.org/2005/Atom"',
    '     xmlns:dc="http://purl.org/dc/elements/1.1/"',
    '     xmlns:media="http://search.yahoo.com/mrss/">',
    '  <channel>',
    `    <title>${escapeXml(SITE_TITLE)}</title>`,
    `    <link>${SITE_URL}/blog</link>`,
    `    <description>${escapeXml(SITE_DESCRIPTION)}</description>`,
    `    <language>${SITE_LANGUAGE}</language>`,
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    `    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');

  const outDir = path.resolve(__dirname, '..', 'client', 'public', 'blog');
  const outPath = path.join(outDir, 'rss.xml');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, xml, 'utf8');
  console.log(
    `RSS written to ${path.relative(path.resolve(__dirname, '..'), outPath)} (${posts.length} items)`
  );
}

main();
