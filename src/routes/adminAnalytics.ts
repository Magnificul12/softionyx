import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { adminLimiter } from '../middleware/rateLimiter';
import { analyticsBus, StreamEvent } from '../utils/analyticsBus';
import logger from '../utils/logger';

const router = express.Router();

// ---------------------------------------------------------------------------
// SSE /stream — must be registered BEFORE the global authenticate/ratelimit
// middlewares because EventSource can't send an Authorization header, so we
// validate the token from the query string ourselves and keep the connection
// open indefinitely (rate limit would close it).
// ---------------------------------------------------------------------------
router.get('/stream', (req: Request, res: Response) => {
  const token = String(req.query.token || '');
  if (!token) {
    res.status(401).json({ error: 'missing_token' });
    return;
  }

  let user: { userId: number; email: string; role: string };
  try {
    user = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      email: string;
      role: string;
    };
  } catch {
    res.status(401).json({ error: 'invalid_token' });
    return;
  }
  if (user.role !== 'admin') {
    res.status(403).json({ error: 'admin_required' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  // Defeat proxies that buffer streaming responses (nginx, some CDNs).
  res.setHeader('X-Accel-Buffering', 'no');
  res.status(200);
  res.flushHeaders?.();

  // Don't let Node's default socket idle timeout kill a perfectly good
  // SSE connection that happens to have no traffic for a while.
  req.socket.setTimeout(0);
  req.socket.setNoDelay(true);
  req.socket.setKeepAlive(true);

  const send = (event: string, data: unknown) => {
    try {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch {
      // Socket closed — cleanup happens in the 'close' handler.
    }
  };

  logger.info(`Analytics SSE opened for ${user.email}`);

  // Initial handshake so the client can flip to "live" immediately.
  send('hello', { ok: true, at: new Date().toISOString() });

  const onEvent = (ev: StreamEvent) => send('event', ev);
  analyticsBus.on('event', onEvent);

  // Periodic heartbeat — keeps intermediate proxies from closing the socket,
  // and lets the client detect a dead connection faster than TCP defaults.
  const heartbeat = setInterval(async () => {
    try {
      const live = await pool.query<{ c: number }>(
        `SELECT COUNT(DISTINCT session_id)::int AS c
           FROM analytics_events
          WHERE created_at >= NOW() - INTERVAL '5 minutes'`
      );
      send('pulse', {
        liveSessions: live.rows[0]?.c ?? 0,
        at: new Date().toISOString(),
      });
    } catch {
      res.write(`: ping\n\n`);
    }
  }, 15_000);

  req.on('close', () => {
    logger.info(`Analytics SSE closed for ${user.email}`);
    clearInterval(heartbeat);
    analyticsBus.off('event', onEvent);
    try {
      res.end();
    } catch {
      /* ignore */
    }
  });
});

router.use(authenticate);
router.use(adminLimiter);

function requireAdmin(req: AuthRequest, res: Response): boolean {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return false;
  }
  return true;
}

// Ranges: 24h | 7d | 30d | 90d. Default 7d.
function rangeToInterval(range: string): { interval: string; bucket: string; points: number } {
  switch (range) {
    case '24h':
      return { interval: '24 hours', bucket: 'hour', points: 24 };
    case '30d':
      return { interval: '30 days', bucket: 'day', points: 30 };
    case '90d':
      return { interval: '90 days', bucket: 'day', points: 90 };
    case '7d':
    default:
      return { interval: '7 days', bucket: 'day', points: 7 };
  }
}

// =====================================================================
// /overview — topline KPIs with trend vs previous equal window.
// =====================================================================
router.get('/overview', async (req: AuthRequest, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    const { interval } = rangeToInterval(String(req.query.range || '7d'));

    const q = await pool.query(
      `
      WITH cur AS (
        SELECT
          COUNT(*) FILTER (WHERE event_type='page_view')                                AS page_views,
          COUNT(DISTINCT session_id)                                                    AS sessions,
          COUNT(*) FILTER (WHERE event_type IN ('contact_submit','help_submit','job_apply_submit'))
                                                                                        AS conversions,
          COUNT(*) FILTER (WHERE event_type IN ('service_view','service_cta_click'))    AS service_interest
        FROM analytics_events
        WHERE created_at >= NOW() - $1::interval
      ),
      prev AS (
        SELECT
          COUNT(*) FILTER (WHERE event_type='page_view')                                AS page_views,
          COUNT(DISTINCT session_id)                                                    AS sessions,
          COUNT(*) FILTER (WHERE event_type IN ('contact_submit','help_submit','job_apply_submit'))
                                                                                        AS conversions,
          COUNT(*) FILTER (WHERE event_type IN ('service_view','service_cta_click'))    AS service_interest
        FROM analytics_events
        WHERE created_at >= NOW() - ($1::interval * 2)
          AND created_at <  NOW() - $1::interval
      ),
      sess AS (
        SELECT
          COALESCE(AVG(EXTRACT(EPOCH FROM (last_seen_at - first_seen_at))), 0)::int AS avg_duration_sec,
          COALESCE(AVG(page_views), 0)::numeric(10,2) AS avg_pages_per_session,
          COUNT(*) FILTER (WHERE page_views <= 1)::float / NULLIF(COUNT(*),0)::float AS bounce_rate
        FROM analytics_sessions
        WHERE last_seen_at >= NOW() - $1::interval
      ),
      live AS (
        SELECT COUNT(DISTINCT session_id) AS live_sessions
        FROM analytics_events
        WHERE created_at >= NOW() - INTERVAL '5 minutes'
      )
      SELECT
        cur.page_views, cur.sessions, cur.conversions, cur.service_interest,
        prev.page_views      AS prev_page_views,
        prev.sessions        AS prev_sessions,
        prev.conversions     AS prev_conversions,
        prev.service_interest AS prev_service_interest,
        sess.avg_duration_sec, sess.avg_pages_per_session, sess.bounce_rate,
        live.live_sessions
      FROM cur, prev, sess, live
      `,
      [interval]
    );

    const r = q.rows[0] ?? {};
    const pct = (now: number, before: number) =>
      before > 0 ? ((now - before) / before) * 100 : now > 0 ? 100 : 0;

    res.json({
      pageViews: Number(r.page_views) || 0,
      sessions: Number(r.sessions) || 0,
      conversions: Number(r.conversions) || 0,
      serviceInterest: Number(r.service_interest) || 0,
      avgDurationSec: Number(r.avg_duration_sec) || 0,
      avgPagesPerSession: Number(r.avg_pages_per_session) || 0,
      bounceRate: Number(r.bounce_rate) || 0,
      liveSessions: Number(r.live_sessions) || 0,
      trend: {
        pageViews: pct(Number(r.page_views) || 0, Number(r.prev_page_views) || 0),
        sessions: pct(Number(r.sessions) || 0, Number(r.prev_sessions) || 0),
        conversions: pct(Number(r.conversions) || 0, Number(r.prev_conversions) || 0),
        serviceInterest: pct(
          Number(r.service_interest) || 0,
          Number(r.prev_service_interest) || 0
        ),
      },
    });
  } catch (err) {
    logger.error('Admin analytics overview error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

// =====================================================================
// /timeline — bucketed series: views, sessions, conversions
// =====================================================================
router.get('/timeline', async (req: AuthRequest, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    const { interval, bucket, points } = rangeToInterval(String(req.query.range || '7d'));

    const q = await pool.query(
      `
      WITH series AS (
        SELECT generate_series(
          date_trunc($2, NOW() - $1::interval),
          date_trunc($2, NOW()),
          ('1 ' || $2)::interval
        ) AS bucket
      )
      SELECT
        s.bucket,
        COALESCE(COUNT(e.*) FILTER (WHERE e.event_type='page_view'), 0) AS page_views,
        COALESCE(COUNT(DISTINCT e.session_id), 0)                      AS sessions,
        COALESCE(COUNT(e.*) FILTER (WHERE e.event_type IN ('contact_submit','help_submit','job_apply_submit')), 0)
                                                                       AS conversions
      FROM series s
      LEFT JOIN analytics_events e
        ON date_trunc($2, e.created_at) = s.bucket
       AND e.created_at >= NOW() - $1::interval
      GROUP BY s.bucket
      ORDER BY s.bucket ASC
      `,
      [interval, bucket]
    );

    res.json({
      bucket,
      points,
      series: q.rows.map((r) => ({
        t: r.bucket,
        pageViews: Number(r.page_views) || 0,
        sessions: Number(r.sessions) || 0,
        conversions: Number(r.conversions) || 0,
      })),
    });
  } catch (err) {
    logger.error('Admin analytics timeline error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

// =====================================================================
// /top-pages — most viewed pages in the window
// =====================================================================
router.get('/top-pages', async (req: AuthRequest, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    const { interval } = rangeToInterval(String(req.query.range || '7d'));
    const limit = Math.min(Number(req.query.limit) || 10, 50);

    const q = await pool.query(
      `
      SELECT
        page_path,
        COUNT(*)                     AS views,
        COUNT(DISTINCT session_id)   AS unique_visitors
      FROM analytics_events
      WHERE event_type='page_view'
        AND created_at >= NOW() - $1::interval
        AND page_path IS NOT NULL
      GROUP BY page_path
      ORDER BY views DESC
      LIMIT $2
      `,
      [interval, limit]
    );

    res.json(
      q.rows.map((r) => ({
        path: r.page_path,
        views: Number(r.views) || 0,
        uniqueVisitors: Number(r.unique_visitors) || 0,
      }))
    );
  } catch (err) {
    logger.error('Admin analytics top-pages error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

// =====================================================================
// /top-services — services people show interest in (views + CTA clicks)
// =====================================================================
router.get('/top-services', async (req: AuthRequest, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    const { interval } = rangeToInterval(String(req.query.range || '7d'));
    const limit = Math.min(Number(req.query.limit) || 10, 50);

    const q = await pool.query(
      `
      SELECT
        COALESCE(entity_label, entity_id) AS label,
        entity_id,
        COUNT(*) FILTER (WHERE event_type='service_view')      AS views,
        COUNT(*) FILTER (WHERE event_type='service_cta_click') AS cta_clicks,
        COUNT(DISTINCT session_id)                             AS unique_visitors,
        COUNT(*)                                               AS total_interactions
      FROM analytics_events
      WHERE event_type IN ('service_view','service_cta_click')
        AND created_at >= NOW() - $1::interval
        AND entity_id IS NOT NULL
      GROUP BY entity_id, entity_label
      ORDER BY total_interactions DESC
      LIMIT $2
      `,
      [interval, limit]
    );

    res.json(
      q.rows.map((r) => ({
        id: r.entity_id,
        label: r.label,
        views: Number(r.views) || 0,
        ctaClicks: Number(r.cta_clicks) || 0,
        uniqueVisitors: Number(r.unique_visitors) || 0,
        totalInteractions: Number(r.total_interactions) || 0,
      }))
    );
  } catch (err) {
    logger.error('Admin analytics top-services error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

// =====================================================================
// /devices — breakdown: device, os, browser
// =====================================================================
router.get('/devices', async (req: AuthRequest, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    const { interval } = rangeToInterval(String(req.query.range || '7d'));

    const [devices, os, browser] = await Promise.all([
      pool.query(
        `SELECT COALESCE(device,'unknown') AS k, COUNT(*) AS v
           FROM analytics_sessions
          WHERE last_seen_at >= NOW() - $1::interval
          GROUP BY device ORDER BY v DESC`,
        [interval]
      ),
      pool.query(
        `SELECT COALESCE(os,'unknown') AS k, COUNT(*) AS v
           FROM analytics_sessions
          WHERE last_seen_at >= NOW() - $1::interval
          GROUP BY os ORDER BY v DESC LIMIT 10`,
        [interval]
      ),
      pool.query(
        `SELECT COALESCE(browser,'unknown') AS k, COUNT(*) AS v
           FROM analytics_sessions
          WHERE last_seen_at >= NOW() - $1::interval
          GROUP BY browser ORDER BY v DESC LIMIT 10`,
        [interval]
      ),
    ]);

    const shape = (rs: { rows: Array<{ k: string; v: string }> }) =>
      rs.rows.map((r) => ({ label: r.k, value: Number(r.v) || 0 }));

    res.json({ devices: shape(devices), os: shape(os), browsers: shape(browser) });
  } catch (err) {
    logger.error('Admin analytics devices error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

// =====================================================================
// /geography — top countries (from CDN headers, may be empty in dev)
// =====================================================================
router.get('/geography', async (req: AuthRequest, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    const { interval } = rangeToInterval(String(req.query.range || '7d'));

    const q = await pool.query(
      `SELECT country AS k, COUNT(*) AS v
         FROM analytics_sessions
        WHERE last_seen_at >= NOW() - $1::interval
          AND country IS NOT NULL AND country <> ''
        GROUP BY country ORDER BY v DESC LIMIT 20`,
      [interval]
    );

    res.json(q.rows.map((r) => ({ label: r.k, value: Number(r.v) || 0 })));
  } catch (err) {
    logger.error('Admin analytics geography error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

// =====================================================================
// /referrers — where traffic came from
// =====================================================================
router.get('/referrers', async (req: AuthRequest, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    const { interval } = rangeToInterval(String(req.query.range || '7d'));
    const q = await pool.query(
      `
      SELECT
        CASE
          WHEN first_referrer IS NULL OR first_referrer = '' THEN 'direct'
          ELSE regexp_replace(
                 regexp_replace(first_referrer, '^https?://', ''),
                 '/.*$', '')
        END AS k,
        COUNT(*) AS v
      FROM analytics_sessions
      WHERE first_seen_at >= NOW() - $1::interval
      GROUP BY k
      ORDER BY v DESC
      LIMIT 15
      `,
      [interval]
    );
    res.json(q.rows.map((r) => ({ label: r.k, value: Number(r.v) || 0 })));
  } catch (err) {
    logger.error('Admin analytics referrers error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

// =====================================================================
// /funnel — visits -> service interest -> contact start -> contact submit
// =====================================================================
router.get('/funnel', async (req: AuthRequest, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    const { interval } = rangeToInterval(String(req.query.range || '7d'));
    const q = await pool.query(
      `
      WITH sess AS (
        SELECT DISTINCT session_id
          FROM analytics_events
         WHERE created_at >= NOW() - $1::interval
           AND event_type='page_view'
      ),
      interest AS (
        SELECT DISTINCT e.session_id
          FROM analytics_events e JOIN sess s USING (session_id)
         WHERE e.event_type IN ('service_view','service_cta_click','portfolio_view','blog_view')
           AND e.created_at >= NOW() - $1::interval
      ),
      start_c AS (
        SELECT DISTINCT e.session_id
          FROM analytics_events e JOIN sess s USING (session_id)
         WHERE e.event_type IN ('contact_start','help_start','job_apply_start')
           AND e.created_at >= NOW() - $1::interval
      ),
      submit_c AS (
        SELECT DISTINCT e.session_id
          FROM analytics_events e JOIN sess s USING (session_id)
         WHERE e.event_type IN ('contact_submit','help_submit','job_apply_submit')
           AND e.created_at >= NOW() - $1::interval
      )
      SELECT
        (SELECT COUNT(*) FROM sess)     AS visit,
        (SELECT COUNT(*) FROM interest) AS interest,
        (SELECT COUNT(*) FROM start_c)  AS started,
        (SELECT COUNT(*) FROM submit_c) AS submitted
      `,
      [interval]
    );
    const r = q.rows[0] ?? {};
    res.json({
      steps: [
        { label: 'Visitors', value: Number(r.visit) || 0 },
        { label: 'Interested', value: Number(r.interest) || 0 },
        { label: 'Started form', value: Number(r.started) || 0 },
        { label: 'Converted', value: Number(r.submitted) || 0 },
      ],
    });
  } catch (err) {
    logger.error('Admin analytics funnel error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

// =====================================================================
// /cities — top cities seen in the window. Joined with country so the UI
// can show a readable "București, RO" style label.
// =====================================================================
router.get('/cities', async (req: AuthRequest, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    const { interval } = rangeToInterval(String(req.query.range || '7d'));
    const limit = Math.min(Number(req.query.limit) || 15, 50);

    const q = await pool.query(
      `SELECT
          city,
          MAX(country) AS country,
          MAX(region)  AS region,
          COUNT(*)     AS visits
       FROM analytics_sessions
       WHERE last_seen_at >= NOW() - $1::interval
         AND city IS NOT NULL AND city <> ''
       GROUP BY city
       ORDER BY visits DESC
       LIMIT $2`,
      [interval, limit]
    );

    res.json(
      q.rows.map((r) => ({
        city: r.city,
        country: r.country,
        region: r.region,
        label: r.country ? `${r.city}, ${r.country}` : r.city,
        value: Number(r.visits) || 0,
      }))
    );
  } catch (err) {
    logger.error('Admin analytics cities error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

// =====================================================================
// /live — recent activity feed (last 50 events, newest first)
// =====================================================================
router.get('/live', async (req: AuthRequest, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    const q = await pool.query(
      `
      SELECT e.id, e.event_type, e.page_path, e.entity_type, e.entity_id, e.entity_label,
             e.created_at,
             s.country, s.region, s.city,
             s.device, s.browser, s.os, s.language
        FROM analytics_events e
        LEFT JOIN analytics_sessions s ON s.session_id = e.session_id
       WHERE e.created_at >= NOW() - INTERVAL '30 minutes'
       ORDER BY e.created_at DESC
       LIMIT 50
      `
    );
    res.json(
      q.rows.map((r) => ({
        id: Number(r.id),
        type: r.event_type,
        path: r.page_path,
        entityType: r.entity_type,
        entityId: r.entity_id,
        entityLabel: r.entity_label,
        createdAt: r.created_at,
        country: r.country,
        region: r.region,
        city: r.city,
        device: r.device,
        browser: r.browser,
        os: r.os,
        language: r.language,
      }))
    );
  } catch (err) {
    logger.error('Admin analytics live error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

export default router;
