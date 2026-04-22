import express from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import contactRoutes from './routes/contact';
import authRoutes from './routes/auth';
import helpRoutes from './routes/help';
import blogRoutes from './routes/blog';
import jobsRoutes from './routes/jobs';
import servicesRoutes from './routes/services';
import adminRoutes from './routes/admin';
import analyticsRoutes from './routes/analytics';
import adminAnalyticsRoutes from './routes/adminAnalytics';
import logger from './utils/logger';
import { apiLimiter } from './middleware/rateLimiter';
import { i18nMiddleware } from './i18n';
import pool from './config/database';
import { readStaticBlogManifest } from './utils/staticBlogManifest';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Needed so req.ip reflects X-Forwarded-For when the server sits behind a
// reverse proxy (nginx, Cloudflare, etc.). Without this, geo lookups would
// always see the proxy's own address. `1` trusts a single hop.
app.set('trust proxy', 1);

// Compression (gzip / brotli). Skip if explicit header says no-transform, or for
// small bodies. Applied before any routes so static + API both get compressed.
app.use(
  compression({
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) return false;
      // SSE responses must not be buffered — compression holds the chunks
      // until the gzip window fills, which breaks real-time delivery.
      if (req.path === '/api/admin/analytics/stream') return false;
      return compression.filter(req, res);
    },
  })
);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://my.spline.design", "https://plausible.io"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://my.spline.design", "https://plausible.io", "https://api.iconify.design"],
      frameSrc: ["'self'", "https://my.spline.design"],
    },
  },
  crossOriginEmbedderPolicy: false,
  strictTransportSecurity: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// Middleware
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// SEO: Public base URL for sitemap / robots (canonical public domain)
const SEO_BASE_URL = (process.env.SEO_BASE_URL || 'https://softionyx.com').replace(/\/$/, '');
const SEO_DEFAULT_LANG = (process.env.SEO_DEFAULT_LANG || 'ro').toLowerCase();
const SEO_LANGS = ['ro', 'en', 'ru'] as const;
const SEO_LANG_RE = /^\/(ro|en|ru)(\/|$)/i;

/**
 * SEO: Canonical redirects (301)
 * - http -> https (when behind proxy, respects X-Forwarded-Proto)
 * - www -> non-www (or any host -> canonical host inferred from SEO_BASE_URL)
 * - trailing slash normalization (except root "/")
 *
 * Applied only in production and only for GET/HEAD on non-API/static-asset paths.
 */
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();

    const pathOnly = req.path || '/';
    // Don't redirect API, uploads, or obvious static assets (sitemaps/robots are handled explicitly)
    if (
      pathOnly.startsWith('/api/') ||
      pathOnly.startsWith('/uploads/') ||
      pathOnly === '/robots.txt' ||
      pathOnly === '/sitemap.xml' ||
      pathOnly === '/sitemap-pages.xml' ||
      pathOnly === '/sitemap-blog.xml' ||
      /\.[a-z0-9]{2,5}$/i.test(pathOnly)
    ) {
      return next();
    }

    // If the URL is missing the language prefix, redirect to default language.
    if (!SEO_LANG_RE.test(pathOnly)) {
      const target = new URL(SEO_BASE_URL);
      const cleanPath = pathOnly === '/' ? '' : pathOnly;
      target.pathname = `/${SEO_DEFAULT_LANG}${cleanPath}`;
      const idx = req.originalUrl.indexOf('?');
      if (idx >= 0) target.search = req.originalUrl.slice(idx);
      res.set('Cache-Control', 'public, max-age=3600');
      return res.redirect(301, target.toString());
    }

    const canonical = new URL(SEO_BASE_URL);
    const reqHost = (req.headers.host || '').toLowerCase();
    const canonicalHost = canonical.host.toLowerCase();

    const xfProto = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim().toLowerCase();
    const proto = xfProto || (req.secure ? 'https' : 'http');

    const needsProto = canonical.protocol === 'https:' && proto !== 'https';
    const needsHost = reqHost && reqHost !== canonicalHost;

    const needsSlash = pathOnly.length > 1 && pathOnly.endsWith('/');
    const normalizedPath = needsSlash ? pathOnly.replace(/\/+$/, '') : pathOnly;

    if (needsProto || needsHost || needsSlash) {
      const target = new URL(SEO_BASE_URL);
      target.pathname = normalizedPath;
      // Preserve original query string
      const idx = req.originalUrl.indexOf('?');
      if (idx >= 0) target.search = req.originalUrl.slice(idx);
      res.set('Cache-Control', 'public, max-age=3600');
      return res.redirect(301, target.toString());
    }

    return next();
  });
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(i18nMiddleware);

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { ip: req.ip });
  next();
});

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/help', helpRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/services', servicesRoutes);
// NOTE: adminAnalytics MUST be mounted before '/api/admin' because that router
// applies authenticate as middleware, which would otherwise block the /stream
// SSE endpoint (EventSource can't send an Authorization header).
app.use('/api/admin/analytics', adminAnalyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', apiLimiter, (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Static route definitions for sitemap
const STATIC_ROUTES: Array<{ path: string; changefreq: string; priority: number }> = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/about', changefreq: 'monthly', priority: 0.8 },
  { path: '/services', changefreq: 'weekly', priority: 0.9 },
  { path: '/solutions', changefreq: 'monthly', priority: 0.8 },
  { path: '/portfolio', changefreq: 'monthly', priority: 0.7 },
  { path: '/careers', changefreq: 'weekly', priority: 0.8 },
  { path: '/blog', changefreq: 'weekly', priority: 0.8 },
  { path: '/contact', changefreq: 'monthly', priority: 0.7 },
  { path: '/privacy', changefreq: 'yearly', priority: 0.3 },
  { path: '/terms', changefreq: 'yearly', priority: 0.3 },
  { path: '/cookies', changefreq: 'yearly', priority: 0.3 },
];

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

type SitemapUrl = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
};

function renderUrlSet(urls: SitemapUrl[]): string {
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((u) => {
        const parts = [`  <url>`, `    <loc>${escapeXml(u.loc)}</loc>`];
        if (u.lastmod) parts.push(`    <lastmod>${u.lastmod}</lastmod>`);
        if (u.changefreq) parts.push(`    <changefreq>${u.changefreq}</changefreq>`);
        if (u.priority !== undefined) parts.push(`    <priority>${u.priority.toFixed(1)}</priority>`);
        parts.push(`  </url>`);
        return parts.join('\n');
      })
      .join('\n') +
    `\n</urlset>\n`
  );
}

async function collectPagesSitemapUrls(today: string): Promise<SitemapUrl[]> {
  const urls: SitemapUrl[] = STATIC_ROUTES.map((route) => ({
    // Multilingual URLs: /{lang}{path}
    loc: `${SEO_BASE_URL}/ro${route.path === '/' ? '' : route.path}`,
    lastmod: today,
    changefreq: route.changefreq,
    priority: route.priority,
  }));
  for (const lang of SEO_LANGS) {
    if (lang === 'ro') continue;
    for (const route of STATIC_ROUTES) {
      urls.push({
        loc: `${SEO_BASE_URL}/${lang}${route.path === '/' ? '' : route.path}`,
        lastmod: today,
        changefreq: route.changefreq,
        priority: route.priority,
      });
    }
  }

  try {
    const servicesResult = await pool.query(
      `SELECT slug, updated_at AS lastmod
       FROM services
       WHERE is_active = true
       ORDER BY order_index ASC`
    );
    for (const row of servicesResult.rows) {
      for (const lang of SEO_LANGS) {
        urls.push({
          loc: `${SEO_BASE_URL}/${lang}/services/${row.slug}`,
          lastmod: row.lastmod ? new Date(row.lastmod).toISOString().split('T')[0] : today,
          changefreq: 'monthly',
          priority: 0.7,
        });
      }
    }
  } catch (err) {
    logger.warn('Sitemap pages: could not fetch services', { err: (err as Error).message });
  }

  return urls;
}

/** Static manifest (SPA blog) merged with published rows in blog_posts (API/CMS). */
async function collectBlogSitemapUrls(today: string): Promise<SitemapUrl[]> {
  const bySlug = new Map<string, { lastmod: string; priority: number }>();

  for (const p of readStaticBlogManifest()) {
    const lastmod = String(p.updatedAt || p.publishedAt || today).slice(0, 10);
    let priority = 0.72;
    if (p.isPillar) priority = 0.9;
    else if (p.featured) priority = 0.82;
    bySlug.set(p.slug, { lastmod, priority });
  }

  try {
    const blogResult = await pool.query(
      `SELECT slug, COALESCE(updated_at, published_at, created_at) AS lastmod
       FROM blog_posts
       WHERE status = 'published'
       ORDER BY COALESCE(published_at, created_at) DESC`
    );
    for (const row of blogResult.rows) {
      const slug = String(row.slug);
      const lastmod = row.lastmod
        ? new Date(row.lastmod).toISOString().split('T')[0]
        : today;
      const existing = bySlug.get(slug);
      if (!existing) {
        bySlug.set(slug, { lastmod, priority: 0.65 });
      } else if (lastmod > existing.lastmod) {
        existing.lastmod = lastmod;
      }
    }
  } catch (err) {
    logger.warn('Sitemap blog: could not fetch blog_posts', { err: (err as Error).message });
  }

  const baseList = Array.from(bySlug.entries()).map(([slug, v]) => ({
    slug,
    lastmod: v.lastmod,
    priority: v.priority,
  }));

  return baseList
    .flatMap((p) =>
      SEO_LANGS.map((lang) => ({
        loc: `${SEO_BASE_URL}/${lang}/blog/${p.slug}`,
        lastmod: p.lastmod,
        changefreq: 'monthly',
        priority: p.priority,
      }))
    )
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}

// SEO: Sitemap index → sitemap-pages.xml + sitemap-blog.xml (topic-cluster friendly split)
app.get('/sitemap.xml', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const blogUrls = await collectBlogSitemapUrls(today);
    const blogLastMod =
      blogUrls.reduce(
        (max, u) => (u.lastmod && u.lastmod > max ? u.lastmod : max),
        today
      ) || today;

    const body =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      `  <sitemap>\n` +
      `    <loc>${escapeXml(`${SEO_BASE_URL}/sitemap-pages.xml`)}</loc>\n` +
      `    <lastmod>${today}</lastmod>\n` +
      `  </sitemap>\n` +
      `  <sitemap>\n` +
      `    <loc>${escapeXml(`${SEO_BASE_URL}/sitemap-blog.xml`)}</loc>\n` +
      `    <lastmod>${blogLastMod}</lastmod>\n` +
      `  </sitemap>\n` +
      `</sitemapindex>\n`;

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(body);
  } catch (err) {
    logger.error('Sitemap index failed', { err: (err as Error).message });
    res.status(500).type('text/plain').send('Sitemap generation error');
  }
});

app.get('/sitemap-pages.xml', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const urls = await collectPagesSitemapUrls(today);
    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(renderUrlSet(urls));
  } catch (err) {
    logger.error('Sitemap pages failed', { err: (err as Error).message });
    res.status(500).type('text/plain').send('Sitemap generation error');
  }
});

app.get('/sitemap-blog.xml', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const urls = await collectBlogSitemapUrls(today);
    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(renderUrlSet(urls));
  } catch (err) {
    logger.error('Sitemap blog failed', { err: (err as Error).message });
    res.status(500).type('text/plain').send('Sitemap generation error');
  }
});

// SEO: Robots.txt (dynamic)
app.get('/robots.txt', (req, res) => {
  const robots = [
    'User-agent: *',
    'Allow: /',
    '',
    'Disallow: /admin',
    'Disallow: /api/',
    'Disallow: /login',
    'Disallow: /register',
    'Disallow: /uploads/resumes/',
    '',
    `Sitemap: ${SEO_BASE_URL}/sitemap.xml`,
    '',
  ].join('\n');

  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.set('Cache-Control', 'public, max-age=86400');
  res.send(robots);
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const DIST = path.join(__dirname, '../client/dist');

  // Known SPA routes (must match client/src/App.tsx). Anything outside this list
  // falls into a 404 branch so that crawlers see a proper HTTP 404 and not soft-404.
  const KNOWN_ROUTES = new Set([
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
    '/login',
    '/register',
    '/admin',
  ]);

  // Known dynamic route prefixes (future-proof for /blog/:slug etc.)
  const DYNAMIC_PREFIXES = ['/blog/', '/services/'];

  // Serve built static assets with long cache (hashed filenames)
  app.use(
    express.static(DIST, {
      index: false,
      maxAge: '1y',
      setHeaders: (res, filePath) => {
        // index.html and the manifest should never be cached aggressively
        if (filePath.endsWith('index.html') || filePath.endsWith('site.webmanifest')) {
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        }
      },
    })
  );

  const indexHtml = path.join(DIST, 'index.html');
  const fs = require('fs') as typeof import('fs');

  app.get('*', (req, res) => {
    const pathname = req.path;

    const isKnown =
      KNOWN_ROUTES.has(pathname) ||
      DYNAMIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));

    if (!isKnown) {
      // True 404: return HTTP 404 + let client render <NotFound/>.
      res.status(404);
      res.set('Cache-Control', 'public, max-age=60');
      return res.sendFile(indexHtml);
    }

    // Prerendered snapshot served if available (better OG tags for social bots)
    const clean = pathname.replace(/^\/+/, '').replace(/\/+$/, '');
    const snapshot = clean === '' ? indexHtml : path.join(DIST, clean, 'index.html');

    if (snapshot !== indexHtml && fs.existsSync(snapshot)) {
      return res.sendFile(snapshot);
    }

    res.sendFile(indexHtml);
  });
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// Start server
const HOST = process.env.HOST || 'localhost';
const serverPort = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;
app.listen(serverPort, HOST, () => {
  logger.info(`🚀 SoftIonyx server running on http://${HOST}:${serverPort}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 SoftIonyx server running on http://${HOST}:${serverPort}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

