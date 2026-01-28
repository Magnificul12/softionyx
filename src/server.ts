import express from 'express';
import cors from 'cors';
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
import logger from './utils/logger';
import { apiLimiter } from './middleware/rateLimiter';
import { i18nMiddleware } from './i18n';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://my.spline.design"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://my.spline.design"],
      frameSrc: ["'self'", "https://my.spline.design"],
    },
  },
}));

// Middleware
app.use(cors());
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
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', apiLimiter, (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// SEO: Sitemap
app.get('/sitemap.xml', (req, res) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/services</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/portfolio</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/careers</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;
  
  res.set('Content-Type', 'text/xml');
  res.send(sitemap);
});

// SEO: Robots.txt
app.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Sitemap: ${baseUrl}/sitemap.xml`;
  
  res.set('Content-Type', 'text/plain');
  res.send(robots);
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
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
app.listen(PORT, () => {
  logger.info(`🚀 SoftIonyx server running on port ${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 SoftIonyx server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

