-- Optional: seed some demo analytics data so the dashboard has content out
-- of the box. Safe to run multiple times — rows are just appended.
-- Usage:  psql -h localhost -U postgres -d softionyx -f database/seed-analytics-demo.sql

DO $$
DECLARE
  sid text;
  paths text[] := ARRAY['/','/services','/about','/portfolio','/blog','/contact','/careers','/solutions'];
  services text[] := ARRAY['cyber','cloud','software','data','automation','blockchain'];
  service_labels text[] := ARRAY['Securitate Cibernetică','Cloud Computing','Dezvoltare Software','Baze de Date','Automatizare Procese','Blockchain & Web3'];
  devices text[] := ARRAY['desktop','mobile','tablet'];
  browsers text[] := ARRAY['Chrome','Firefox','Safari','Edge'];
  oses text[] := ARRAY['Windows','macOS','Android','iOS','Linux'];
  countries text[] := ARRAY['RO','MD','UA','DE','FR','US','IT','GB'];
  referrers text[] := ARRAY['','google.com','facebook.com','linkedin.com','','','bing.com'];
  i int; j int; n_events int;
  ev_time timestamp;
  svc_idx int;
BEGIN
  FOR i IN 1..60 LOOP
    sid := md5(random()::text || i::text);
    ev_time := NOW() - (random() * interval '7 days');
    n_events := 1 + floor(random() * 6)::int;

    INSERT INTO analytics_sessions
      (session_id, first_seen_at, last_seen_at, ip_hash, country, device, os, browser, language, first_referrer, page_views, events_count)
    VALUES
      (sid,
       ev_time,
       ev_time + (random() * interval '15 minutes'),
       md5(random()::text),
       countries[1 + floor(random() * array_length(countries,1))::int],
       devices[1 + floor(random() * array_length(devices,1))::int],
       oses[1 + floor(random() * array_length(oses,1))::int],
       browsers[1 + floor(random() * array_length(browsers,1))::int],
       'ro',
       NULLIF(referrers[1 + floor(random() * array_length(referrers,1))::int], ''),
       n_events,
       n_events)
    ON CONFLICT (session_id) DO NOTHING;

    -- Page views
    FOR j IN 1..n_events LOOP
      INSERT INTO analytics_events (session_id, event_type, page_path, created_at)
      VALUES (
        sid,
        'page_view',
        paths[1 + floor(random() * array_length(paths,1))::int],
        ev_time + (j * interval '90 seconds') + (random() * interval '30 seconds')
      );
    END LOOP;

    -- Some service interest
    IF random() < 0.45 THEN
      svc_idx := 1 + floor(random() * array_length(services,1))::int;
      INSERT INTO analytics_events (session_id, event_type, page_path, entity_type, entity_id, entity_label, created_at)
      VALUES (sid, 'service_view', '/services', 'service',
              services[svc_idx], service_labels[svc_idx],
              ev_time + interval '3 minutes');
      IF random() < 0.4 THEN
        INSERT INTO analytics_events (session_id, event_type, page_path, entity_type, entity_id, entity_label, created_at)
        VALUES (sid, 'service_cta_click', '/services', 'service',
                services[svc_idx], service_labels[svc_idx],
                ev_time + interval '4 minutes');
      END IF;
    END IF;

    -- Contact submit for ~12%
    IF random() < 0.12 THEN
      INSERT INTO analytics_events (session_id, event_type, page_path, created_at)
      VALUES (sid, 'contact_start', '/contact', ev_time + interval '6 minutes');
      INSERT INTO analytics_events (session_id, event_type, page_path, created_at)
      VALUES (sid, 'contact_submit', '/contact', ev_time + interval '7 minutes');
    END IF;
  END LOOP;
END $$;

SELECT 'sessions' AS table, COUNT(*) FROM analytics_sessions
UNION ALL
SELECT 'events', COUNT(*) FROM analytics_events;
