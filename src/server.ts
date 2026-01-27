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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware - configure based on actual request protocol
// Trust proxy if behind nginx (for X-Forwarded-Proto header)
app.set('trust proxy', 1);

app.use((req, res, next) => {
  // Determine if request is HTTPS (check X-Forwarded-Proto from nginx or direct connection)
  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
  
  // Build CSP directives
  const cspDirectives: any = {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://my.spline.design"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: [
        "'self'",
        "https://my.spline.design",
        "https://api.iconify.design",
        "https://api.simplesvg.com",
        "https://api.unisvg.com"
      ],
      
      frameSrc: ["'self'", "https://my.spline.design"],
  };
  
  // Only add upgrade-insecure-requests for HTTPS requests
  if (isHttps) {
    cspDirectives.upgradeInsecureRequests = [];
  }
  
  // Configure Helmet dynamically based on request protocol
  const helmetConfig: any = {
    contentSecurityPolicy: {
      directives: cspDirectives,
    },
    // Only enforce strict headers for HTTPS requests
    crossOriginOpenerPolicy: isHttps ? { policy: 'same-origin' } : false,
    crossOriginResourcePolicy: isHttps ? { policy: 'same-origin' } : false,
    strictTransportSecurity: isHttps ? {
      maxAge: 15552000,
      includeSubDomains: true,
    } : false,
  };
  
  // Explicitly disable upgrade-insecure-requests for HTTP
  if (!isHttps) {
    helmetConfig.contentSecurityPolicy.useDefaults = false;
    helmetConfig.contentSecurityPolicy.directives = {
      ...cspDirectives,
      upgradeInsecureRequests: null, // Explicitly disable
    };
  }
  
  helmet(helmetConfig)(req, res, next);
});

// Remove problematic headers for HTTP requests (must run after Helmet)
app.use((req, res, next) => {
  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
  if (!isHttps) {
    // Use writeHead to intercept headers before they're sent
    const originalWriteHead = res.writeHead;
    res.writeHead = function(statusCode: number, statusMessage?: any, headers?: any) {
      // Get current headers
      const currentHeaders = headers || statusMessage || {};
      const resHeaders = res.getHeaders();
      
      // Clean CSP header
      if (resHeaders['content-security-policy']) {
        const csp = Array.isArray(resHeaders['content-security-policy']) 
          ? resHeaders['content-security-policy'][0] 
          : resHeaders['content-security-policy'];
        if (typeof csp === 'string') {
          const cleaned = csp.replace(/;?\s*upgrade-insecure-requests\s*/gi, '').trim();
          res.setHeader('content-security-policy', cleaned);
        }
      }
      
      // Remove Origin-Agent-Cluster
      res.removeHeader('origin-agent-cluster');
      
      // Call original writeHead
      if (typeof statusMessage === 'object') {
        return originalWriteHead.call(this, statusCode, statusMessage);
      } else {
        return originalWriteHead.call(this, statusCode, headers);
      }
    };
    
    // Also intercept end() as fallback
    const originalEnd = res.end;
    res.end = function(chunk?: any, encoding?: any, cb?: any) {
      const cspHeader = res.getHeader('content-security-policy');
      if (cspHeader && typeof cspHeader === 'string') {
        const cleaned = cspHeader.replace(/;?\s*upgrade-insecure-requests\s*/gi, '').trim();
        res.setHeader('content-security-policy', cleaned);
      }
      res.removeHeader('origin-agent-cluster');
      return originalEnd.call(this, chunk, encoding, cb);
    };
  }
  next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
const HOST = process.env.HOST || '0.0.0.0';
const serverPort = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;
app.listen(serverPort, HOST, () => {
  logger.info(`🚀 SoftIonyx server running on http://${HOST}:${serverPort}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 SoftIonyx server running on http://${HOST}:${serverPort}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

