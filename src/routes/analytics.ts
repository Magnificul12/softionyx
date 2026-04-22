import express, { Request, Response } from 'express';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import { pool } from '../config/database';
import logger from '../utils/logger';
import {
  parseUserAgent,
  normalizeLanguage,
  resolveGeo,
} from '../utils/userAgent';
import { emitAnalyticsEvent } from '../utils/analyticsBus';

const router = express.Router();

// Public tracking endpoint. Permissive limits because one real user may send
// many events (page views, clicks) in quick succession. Abuse is capped per IP.
const trackLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Analytics track rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ error: 'rate_limited' });
  },
});

const ALLOWED_EVENTS = new Set([
  'page_view',
  'service_view',
  'service_cta_click',
  'portfolio_view',
  'blog_view',
  'contact_start',
  'contact_submit',
  'help_start',
  'help_submit',
  'job_view',
  'job_apply_start',
  'job_apply_submit',
  'external_click',
  'scroll_milestone',
  'session_end',
]);

interface TrackPayload {
  sessionId?: string;
  events?: Array<{
    type: string;
    path?: string;
    entityType?: string;
    entityId?: string | number;
    entityLabel?: string;
    referrer?: string;
    metadata?: Record<string, unknown>;
  }>;
}

function hashIp(ip: string | undefined): string {
  if (!ip) return '';
  // Salted hash — we never store raw IPs but can still deduplicate visitors.
  const salt = process.env.ANALYTICS_IP_SALT || 'softionyx-analytics';
  return crypto
    .createHash('sha256')
    .update(salt + '|' + ip)
    .digest('hex')
    .slice(0, 32);
}

router.post('/track', trackLimiter, async (req: Request, res: Response) => {
  try {
    const body = (req.body ?? {}) as TrackPayload;
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId.slice(0, 64) : '';
    const events = Array.isArray(body.events) ? body.events.slice(0, 20) : [];

    if (!sessionId || sessionId.length < 8 || events.length === 0) {
      return res.status(400).json({ error: 'invalid_payload' });
    }

    const ua = req.headers['user-agent'] ?? '';
    const parsed = parseUserAgent(typeof ua === 'string' ? ua : '');
    // Quietly drop bot traffic — we don't want it skewing dashboard numbers.
    if (parsed.isBot) return res.json({ ok: true, dropped: 'bot' });

    const ipHash = hashIp(req.ip);
    const geo = resolveGeo(req);
    const country = geo.country;
    const region = geo.region;
    const city = geo.city;
    const language = normalizeLanguage(
      typeof req.headers['accept-language'] === 'string' ? req.headers['accept-language'] : ''
    );

    const pageViewCount = events.filter((e) => e.type === 'page_view').length;

    // Upsert session — keep earliest first_seen, refresh last_seen and counters.
    await pool.query(
      `INSERT INTO analytics_sessions
         (session_id, ip_hash, country, region, city, device, os, browser, language,
          first_referrer, page_views, events_count)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (session_id) DO UPDATE SET
         last_seen_at = CURRENT_TIMESTAMP,
         page_views   = analytics_sessions.page_views + EXCLUDED.page_views,
         events_count = analytics_sessions.events_count + EXCLUDED.events_count,
         country      = COALESCE(NULLIF(EXCLUDED.country,''), analytics_sessions.country),
         region       = COALESCE(NULLIF(EXCLUDED.region,''),  analytics_sessions.region),
         city         = COALESCE(NULLIF(EXCLUDED.city,''),    analytics_sessions.city),
         device       = COALESCE(analytics_sessions.device, EXCLUDED.device),
         os           = COALESCE(analytics_sessions.os, EXCLUDED.os),
         browser      = COALESCE(analytics_sessions.browser, EXCLUDED.browser)`,
      [
        sessionId,
        ipHash,
        country || null,
        region || null,
        city || null,
        parsed.device,
        parsed.os,
        parsed.browser,
        language || null,
        (events[0]?.referrer ?? '').slice(0, 1024) || null,
        pageViewCount,
        events.length,
      ]
    );

    // Bulk insert events — build a single parameterised query.
    const cols: string[] = [];
    const values: unknown[] = [];
    let p = 1;
    for (const e of events) {
      const type = typeof e.type === 'string' ? e.type : '';
      if (!ALLOWED_EVENTS.has(type)) continue;
      cols.push(`($${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++})`);
      values.push(
        sessionId,
        type,
        (e.path ?? '').slice(0, 512) || null,
        (e.entityType ?? '').slice(0, 32) || null,
        e.entityId !== undefined && e.entityId !== null ? String(e.entityId).slice(0, 128) : null,
        (e.entityLabel ?? '').slice(0, 256) || null,
        (e.referrer ?? '').slice(0, 1024) || null,
        e.metadata ? JSON.stringify(e.metadata).slice(0, 4096) : null
      );
    }

    if (cols.length > 0) {
      await pool.query(
        `INSERT INTO analytics_events
           (session_id, event_type, page_path, entity_type, entity_id, entity_label, referrer, metadata)
         VALUES ${cols.join(',')}`,
        values
      );

      // Notify any live dashboards. We fan out each accepted event individually
      // so the UI can render a per-row entry in its live feed.
      const now = new Date().toISOString();
      for (const e of events) {
        if (!ALLOWED_EVENTS.has(e.type)) continue;
        emitAnalyticsEvent({
          type: e.type,
          path: (e.path ?? '') || null,
          entityType: (e.entityType ?? '') || null,
          entityId:
            e.entityId !== undefined && e.entityId !== null
              ? String(e.entityId)
              : null,
          entityLabel: (e.entityLabel ?? '') || null,
          country: country || null,
          region: region || null,
          city: city || null,
          device: parsed.device,
          browser: parsed.browser,
          os: parsed.os,
          language: language || null,
          sessionId,
          createdAt: now,
        });
      }
    }

    return res.json({ ok: true, accepted: cols.length });
  } catch (err) {
    logger.error('Analytics track error:', err);
    return res.status(500).json({ error: 'server_error' });
  }
});

export default router;
