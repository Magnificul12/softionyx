-- =====================================================================
-- Analytics: enrich sessions with city/region for richer location insight
-- =====================================================================

ALTER TABLE analytics_sessions
  ADD COLUMN IF NOT EXISTS region  VARCHAR(64),
  ADD COLUMN IF NOT EXISTS city    VARCHAR(96);

-- Useful for "top cities" rollups within a time window.
CREATE INDEX IF NOT EXISTS idx_sessions_city
  ON analytics_sessions(city)
  WHERE city IS NOT NULL;
