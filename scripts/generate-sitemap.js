/**
 * Generate sitemap index + split urlsets for softionyx.com
 *
 * Outputs (client/public/):
 *   - sitemap.xml          — sitemap index (pages + blog)
 *   - sitemap-pages.xml    — static routes + service detail pages (+ hreflang)
 *   - sitemap-blog.xml     — /blog/:slug from posts.json (+ hreflang)
 *
 * Run: node scripts/generate-sitemap.js
 * Hook: prebuild in package.json
 *
 * Keep SERVICE_SLUGS in sync with client/src/data/services.ts.
 * Production Express serves the same split under /sitemap*.xml (see src/server.ts).
 */
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://softionyx.com';
const LOCALES = ['ro', 'en', 'ru'];

let BLOG_POSTS = [];
try {
  const manifestPath = path.resolve(
    __dirname,
    '..',
    'client',
    'src',
    'content',
    'blog',
    'posts.json'
  );
  BLOG_POSTS = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
} catch (err) {
  console.warn('sitemap: could not read blog manifest -', err.message);
}

const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/about', changefreq: 'monthly', priority: 0.7 },
  { path: '/services', changefreq: 'monthly', priority: 0.9 },
  { path: '/solutions', changefreq: 'monthly', priority: 0.7 },
  { path: '/portfolio', changefreq: 'monthly', priority: 0.8 },
  { path: '/careers', changefreq: 'weekly', priority: 0.6 },
  { path: '/blog', changefreq: 'weekly', priority: 0.8 },
  { path: '/contact', changefreq: 'monthly', priority: 0.6 },
  { path: '/privacy', changefreq: 'yearly', priority: 0.3 },
  { path: '/terms', changefreq: 'yearly', priority: 0.3 },
  { path: '/cookies', changefreq: 'yearly', priority: 0.3 },
];

const SERVICE_SLUGS = [
  'dezvoltare-web',
  'aplicatii-mobile',
  'e-commerce',
  'software-custom',
  'seo-optimizare',
  'mentenanta-site',
  'cyber-security',
  'blockchain',
];

function buildUrlEntry({ loc, lastmod, changefreq, priority, alternates }) {
  const altLinks = alternates
    .map(
      (a) =>
        `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.href}" />`
    )
    .join('\n');
  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />`;

  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority.toFixed(1)}</priority>`,
    altLinks,
    xDefault,
    '  </url>',
  ].join('\n');
}

function entriesForRoute(route) {
  const loc = `${SITE_URL}${route.path === '/' ? '' : route.path}`;
  const alternates = LOCALES.map((lang) => ({ lang, href: loc }));
  return buildUrlEntry({
    loc,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: route.changefreq,
    priority: route.priority,
    alternates,
  });
}

function buildBlogEntry(post) {
  const loc = `${SITE_URL}/blog/${post.slug}`;
  const lastmod = post.updatedAt || post.publishedAt;
  let priority = 0.72;
  if (post.isPillar) priority = 0.9;
  else if (post.featured) priority = 0.82;
  const alternates = LOCALES.map((lang) => ({ lang, href: loc }));
  return buildUrlEntry({
    loc,
    lastmod,
    changefreq: 'monthly',
    priority,
    alternates,
  });
}

function wrapUrlset(inner) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    inner,
    '</urlset>',
    '',
  ].join('\n');
}

function main() {
  const today = new Date().toISOString().split('T')[0];

  const allPageRoutes = [
    ...STATIC_ROUTES,
    ...SERVICE_SLUGS.map((slug) => ({
      path: `/services/${slug}`,
      changefreq: 'monthly',
      priority: 0.85,
    })),
  ];

  const pagesInner = allPageRoutes.map(entriesForRoute).join('\n');
  const blogInner = BLOG_POSTS.map(buildBlogEntry).join('\n');

  const blogLastMod =
    BLOG_POSTS.reduce(
      (m, p) => {
        const d = p.updatedAt || p.publishedAt || today;
        return d > m ? d : m;
      },
      today
    ) || today;

  const outDir = path.resolve(__dirname, '..', 'client', 'public');
  fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(path.join(outDir, 'sitemap-pages.xml'), wrapUrlset(pagesInner), 'utf8');
  fs.writeFileSync(path.join(outDir, 'sitemap-blog.xml'), wrapUrlset(blogInner), 'utf8');

  const indexXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <sitemap>',
    `    <loc>${SITE_URL}/sitemap-pages.xml</loc>`,
    `    <lastmod>${today}</lastmod>`,
    '  </sitemap>',
    '  <sitemap>',
    `    <loc>${SITE_URL}/sitemap-blog.xml</loc>`,
    `    <lastmod>${blogLastMod}</lastmod>`,
    '  </sitemap>',
    '</sitemapindex>',
    '',
  ].join('\n');

  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), indexXml, 'utf8');

  console.log(
    `Sitemaps written to ${path.relative(path.resolve(__dirname, '..'), outDir)} — index + pages (${allPageRoutes.length} urls) + blog (${BLOG_POSTS.length} urls)`
  );
}

main();
