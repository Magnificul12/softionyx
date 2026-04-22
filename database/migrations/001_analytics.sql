-- =====================================================================
-- Analytics events + sessions tables
-- =====================================================================

-- Sessions: identify a unique visitor anonymously. One row per session.
CREATE TABLE IF NOT EXISTS analytics_sessions (
  id              BIGSERIAL PRIMARY KEY,
  session_id      VARCHAR(64) UNIQUE NOT NULL,
  first_seen_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id         INTEGER REFERENCES users(id) ON DELETE SET NULL,
  ip_hash         VARCHAR(64),
  country         VARCHAR(4),
  device          VARCHAR(16),
  os              VARCHAR(32),
  browser         VARCHAR(32),
  language        VARCHAR(8),
  first_referrer  TEXT,
  first_utm_source   VARCHAR(128),
  first_utm_medium   VARCHAR(128),
  first_utm_campaign VARCHAR(128),
  page_views      INTEGER NOT NULL DEFAULT 0,
  events_count    INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_sessions_first_seen ON analytics_sessions(first_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_last_seen ON analytics_sessions(last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_country ON analytics_sessions(country);

-- Events: every tracked action (page_view, click, form_start, form_submit)
CREATE TABLE IF NOT EXISTS analytics_events (
  id           BIGSERIAL PRIMARY KEY,
  session_id   VARCHAR(64) NOT NULL,
  user_id      INTEGER REFERENCES users(id) ON DELETE SET NULL,
  event_type   VARCHAR(48) NOT NULL,
  page_path    TEXT,
  entity_type  VARCHAR(32),
  entity_id    VARCHAR(128),
  entity_label TEXT,
  referrer     TEXT,
  metadata     JSONB,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_created ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_type_created ON analytics_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_path ON analytics_events(page_path);
CREATE INDEX IF NOT EXISTS idx_events_entity ON analytics_events(entity_type, entity_id);
