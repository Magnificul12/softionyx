/**
 * Prerender SPA into static HTML snapshots for crawlers & social bots.
 *
 * How it works:
 *   1. Serves `client/dist` on a random local port via express.
 *   2. Uses puppeteer (headless Chromium) to visit every route in ROUTES.
 *   3. Waits for React + Helmet to finish hydrating, then captures `document.documentElement.outerHTML`.
 *   4. Writes `client/dist/<route>/index.html` per route.
 *
 * When the express server receives a request for, say, `/about`, it now serves
 * `client/dist/about/index.html` (which contains fully-rendered OG tags + text)
 * instead of the empty root `index.html`. JS bundle still hydrates on top for
 * interactivity.
 *
 * Run after `npm run build`:
 *   npm run prerender
 *
 * Tip: keep this list in sync with client/src/App.tsx routes.
 */
const fs = require('fs');
const path = require('path');
const express = require('express');
const puppeteer = require('puppeteer');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'client', 'dist');

// Keep this list in sync with:
//   - client/src/App.tsx
//   - client/src/data/services.ts (SERVICE_SLUGS)
//   - scripts/generate-sitemap.js
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

// Blog posts discovered dynamically from the manifest.
let BLOG_SLUGS = [];
try {
  const manifest = JSON.parse(
    fs.readFileSync(
      path.resolve(ROOT, 'client', 'src', 'content', 'blog', 'posts.json'),
      'utf8'
    )
  );
  BLOG_SLUGS = manifest.map((p) => p.slug);
} catch (err) {
  console.warn('prerender: could not read blog manifest -', err.message);
}

const ROUTES = [
  '/',
  '/about',
  '/services',
  '/solutions',
  '/portfolio',
  '/careers',
  '/blog',
  '/contact',
  '/privacy',
  '/terms',
  '/cookies',
  // Individual service landing pages (local-SEO targeted).
  ...SERVICE_SLUGS.map((slug) => `/services/${slug}`),
  // Blog posts — each rendered as its own static snapshot.
  ...BLOG_SLUGS.map((slug) => `/blog/${slug}`),
];

function startLocalServer() {
  return new Promise((resolve, reject) => {
    const app = express();
    // `redirect: false` stops express.static from 301-ing `/about` → `/about/`
    // when we've previously prerendered (and the folder exists). We want the
    // canonical URL to stay without trailing slash.
    app.use(express.static(DIST, { index: false, redirect: false }));
    // SPA fallback for routes without a static html yet (first run)
    app.get('*', (_req, res) => res.sendFile(path.join(DIST, 'index.html')));
    const server = app.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({ server, port });
    });
    server.on('error', reject);
  });
}

async function renderRoute(browser, baseUrl, route, lang = 'ro') {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('SoftIonyxPrerender/1.0');
  await page.setExtraHTTPHeaders({ 'Accept-Language': `${lang},en;q=0.8` });

  // Pre-seed i18next language before any JS runs
  await page.evaluateOnNewDocument((l) => {
    try {
      localStorage.setItem('i18nextLng', l);
    } catch {}
  }, lang);

  const url = baseUrl + route;
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });

  // Give Helmet and any async effects a final tick to flush.
  await page.evaluate(
    () => new Promise((r) => setTimeout(r, 150))
  );

  const html = await page.evaluate(() => '<!DOCTYPE html>\n' + document.documentElement.outerHTML);

  // Check if the rendered page flagged itself as 404 (our NotFound component
  // emits <meta name="prerender-status-code" content="404">). We don't write
  // these to disk — they remain served dynamically so Express can return 404.
  const is404 = /name="prerender-status-code"\s+content="404"/.test(html);

  await page.close();
  return { html, is404 };
}

function writeSnapshot(route, html) {
  const clean = route.replace(/^\/+/, '').replace(/\/+$/, '');
  const dir = clean === '' ? DIST : path.join(DIST, clean);
  fs.mkdirSync(dir, { recursive: true });
  const out = path.join(dir, 'index.html');
  fs.writeFileSync(out, html, 'utf8');
  return out;
}

async function main() {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    console.error('client/dist/index.html not found. Run `npm run build` first.');
    process.exit(1);
  }

  console.log('Starting local server...');
  const { server, port } = await startLocalServer();
  const baseUrl = `http://127.0.0.1:${port}`;

  console.log('Launching headless browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  try {
    for (const route of ROUTES) {
      try {
        process.stdout.write(`  Rendering ${route.padEnd(18)} ... `);
        const { html, is404 } = await renderRoute(browser, baseUrl, route);
        if (is404) {
          console.log('SKIPPED (404)');
          skipped++;
          continue;
        }
        const out = writeSnapshot(route, html);
        console.log(`OK  (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB)  → ${path.relative(ROOT, out)}`);
        ok++;
      } catch (err) {
        console.log(`FAIL: ${err.message}`);
        failed++;
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log(`\nDone. Rendered ${ok}, skipped ${skipped}, failed ${failed}.`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
