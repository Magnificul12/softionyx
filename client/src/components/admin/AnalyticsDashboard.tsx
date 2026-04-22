import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from '../../utils/axios';
import { Icon } from '../Icons';
import Sparkline from '../charts/Sparkline';
import AreaChart from '../charts/AreaChart';
import BarList from '../charts/BarList';
import Donut from '../charts/Donut';
import Funnel from '../charts/Funnel';
import {
  useAnalyticsStream,
  LiveStreamEvent,
  StreamStatus,
} from '../../utils/useAnalyticsStream';

// ---------------------------------------------------------------------------
// Types returned by the /api/admin/analytics/* endpoints
// ---------------------------------------------------------------------------

type Range = '24h' | '7d' | '30d' | '90d';

interface Overview {
  pageViews: number;
  sessions: number;
  conversions: number;
  serviceInterest: number;
  avgDurationSec: number;
  avgPagesPerSession: number;
  bounceRate: number;
  liveSessions: number;
  trend: {
    pageViews: number;
    sessions: number;
    conversions: number;
    serviceInterest: number;
  };
}
interface TimelinePoint {
  t: string;
  pageViews: number;
  sessions: number;
  conversions: number;
}
interface Timeline {
  bucket: 'hour' | 'day';
  points: number;
  series: TimelinePoint[];
}
interface TopPage {
  path: string;
  views: number;
  uniqueVisitors: number;
}
interface TopService {
  id: string;
  label: string;
  views: number;
  ctaClicks: number;
  uniqueVisitors: number;
  totalInteractions: number;
}
interface Devices {
  devices: { label: string; value: number }[];
  os: { label: string; value: number }[];
  browsers: { label: string; value: number }[];
}
type KV = { label: string; value: number };
interface FunnelData {
  steps: { label: string; value: number }[];
}
interface LiveEvent {
  id: number;
  type: string;
  path: string | null;
  entityType: string | null;
  entityId: string | null;
  entityLabel: string | null;
  createdAt: string;
  country: string | null;
  region: string | null;
  city: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  language: string | null;
}
interface CityRow {
  city: string;
  country: string | null;
  region: string | null;
  label: string;
  value: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDuration(sec: number): string {
  if (!sec || sec < 0) return '0s';
  if (sec < 60) return `${Math.round(sec)}s`;
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}m ${s}s`;
}

function formatRelative(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.round(diff)}s ago`;
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString();
}

function formatBucketLabel(iso: string, bucket: 'hour' | 'day'): string {
  const d = new Date(iso);
  if (bucket === 'hour') {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

const EVENT_ICONS: Record<string, { icon: string; color: string }> = {
  page_view: { icon: 'lucide:eye', color: 'text-slate-300' },
  service_view: { icon: 'lucide:sparkles', color: 'text-indigo-300' },
  service_cta_click: { icon: 'lucide:mouse-pointer-click', color: 'text-purple-300' },
  portfolio_view: { icon: 'lucide:image', color: 'text-blue-300' },
  blog_view: { icon: 'lucide:book-open', color: 'text-emerald-300' },
  contact_start: { icon: 'lucide:pen-line', color: 'text-amber-300' },
  contact_submit: { icon: 'lucide:send', color: 'text-emerald-400' },
  help_start: { icon: 'lucide:life-buoy', color: 'text-amber-300' },
  help_submit: { icon: 'lucide:send', color: 'text-emerald-400' },
  job_view: { icon: 'lucide:briefcase', color: 'text-sky-300' },
  job_apply_submit: { icon: 'lucide:send', color: 'text-emerald-400' },
};

// ---------------------------------------------------------------------------
// Small UI atoms
// ---------------------------------------------------------------------------

function KpiCard({
  label,
  value,
  trend,
  spark,
  icon,
  accent,
  subtitle,
}: {
  label: string;
  value: number | null | undefined;
  trend?: number;
  spark?: number[];
  icon: string;
  accent: string;
  subtitle?: string;
}) {
  const up = (trend ?? 0) >= 0;
  const prevValue = useRef<number | null>(null);
  const [flash, setFlash] = useState<'up' | null>(null);

  useEffect(() => {
    if (value == null) return;
    if (prevValue.current !== null && value !== prevValue.current) {
      setFlash('up');
      const t = setTimeout(() => setFlash(null), 900);
      return () => clearTimeout(t);
    }
    prevValue.current = value;
  }, [value]);

  // Smoothly animate the number from previous to new value (short tween).
  const display = useAnimatedNumber(value ?? 0);

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-white/[0.02] p-4 sm:p-5 hover:bg-white/[0.04] transition-all duration-500 ${
        flash === 'up'
          ? 'border-emerald-400/50 shadow-[0_0_0_1px_rgba(52,211,153,0.35),0_0_30px_rgba(52,211,153,0.25)]'
          : 'border-white/5'
      }`}
    >
      <div
        className="absolute -top-10 -right-10 h-28 w-28 rounded-full blur-3xl opacity-60 pointer-events-none"
        style={{ background: accent }}
        aria-hidden
      />
      {flash === 'up' && (
        <span
          className="pointer-events-none absolute inset-0 rounded-xl bg-emerald-400/5 animate-pulse"
          aria-hidden
        />
      )}
      <div className="flex items-start justify-between gap-2 relative">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">
            {label}
          </div>
          <div className="mt-1.5 text-2xl sm:text-3xl font-semibold text-white tabular-nums">
            {value == null ? '—' : display.toLocaleString()}
          </div>
          {subtitle && (
            <div className="text-[11px] text-slate-500 mt-0.5">{subtitle}</div>
          )}
        </div>
        <div
          className="shrink-0 h-9 w-9 rounded-lg flex items-center justify-center border border-white/10"
          style={{ background: `${accent}22`, color: accent }}
        >
          <Icon name={icon} width={18} />
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3 relative">
        {spark && spark.length > 0 ? (
          <Sparkline values={spark} stroke={accent} fill={`${accent}22`} width={160} height={36} />
        ) : (
          <span />
        )}
        {trend !== undefined && (
          <span
            className={`text-xs font-medium tabular-nums inline-flex items-center gap-1 ${
              up ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            <Icon name={up ? 'lucide:trending-up' : 'lucide:trending-down'} width={14} />
            {up ? '+' : ''}
            {Math.abs(trend).toFixed(0)}%
          </span>
        )}
      </div>
    </div>
  );
}

// Tween a number toward the target over ~500ms. Keeps the UI feeling responsive
// even when values jump by multiple units at once.
function useAnimatedNumber(target: number): number {
  const [value, setValue] = useState(target);
  const rafRef = useRef<number | null>(null);
  const fromRef = useRef(target);
  const startRef = useRef(0);

  useEffect(() => {
    if (target === value) return;
    fromRef.current = value;
    startRef.current = performance.now();
    const duration = 500;
    const step = (now: number) => {
      const t = Math.min(1, (now - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = Math.round(fromRef.current + (target - fromRef.current) * eased);
      setValue(next);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}

function Panel({
  title,
  subtitle,
  right,
  children,
  className = '',
  flashKey,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  // When this value changes, the panel border pulses briefly to signal a
  // live data update without being distracting.
  flashKey?: string | number;
}) {
  const prevKey = useRef<string | number | undefined>(flashKey);
  const [isFlashing, setIsFlashing] = useState(false);
  useEffect(() => {
    if (flashKey === undefined) return;
    if (prevKey.current !== undefined && flashKey !== prevKey.current) {
      setIsFlashing(true);
      const t = setTimeout(() => setIsFlashing(false), 700);
      prevKey.current = flashKey;
      return () => clearTimeout(t);
    }
    prevKey.current = flashKey;
  }, [flashKey]);

  return (
    <section
      className={`rounded-xl border bg-white/[0.02] p-4 sm:p-5 transition-colors duration-500 ${
        isFlashing
          ? 'border-emerald-400/40 shadow-[0_0_0_1px_rgba(52,211,153,0.25)]'
          : 'border-white/5'
      } ${className}`}
    >
      <header className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-medium text-white truncate">{title}</h3>
          {subtitle && (
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        {right}
      </header>
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const RANGE_OPTIONS: Array<{ id: Range; label: string }> = [
  { id: '24h', label: '24h' },
  { id: '7d', label: '7 zile' },
  { id: '30d', label: '30 zile' },
  { id: '90d', label: '90 zile' },
];

export default function AnalyticsDashboard() {
  const [range, setRange] = useState<Range>('7d');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [topServices, setTopServices] = useState<TopService[]>([]);
  const [devices, setDevices] = useState<Devices | null>(null);
  const [geo, setGeo] = useState<KV[]>([]);
  const [cities, setCities] = useState<CityRow[]>([]);
  const [refs, setRefs] = useState<KV[]>([]);
  const [funnel, setFunnel] = useState<FunnelData | null>(null);
  const [live, setLive] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [liveSessions, setLiveSessions] = useState<number>(0);
  const [nowTick, setNowTick] = useState<number>(() => Date.now());

  // 1 Hz ticker so "actualizat Xs ago" and relative times in the live feed
  // stay honest without a full re-fetch.
  useEffect(() => {
    const id = window.setInterval(() => setNowTick(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const liveTimer = useRef<number | null>(null);
  const aggregatesDebounce = useRef<number | null>(null);
  const eventIdCounter = useRef<number>(-1);
  const rangeRef = useRef<Range>('7d');
  rangeRef.current = range;

  const loadAll = useCallback(
    async (r: Range, opts: { silent?: boolean } = {}) => {
      if (!opts.silent) setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const q = `?range=${r}`;
        const [o, t, tp, ts, d, g, c, rf, f] = await Promise.all([
          axios.get<Overview>(`/api/admin/analytics/overview${q}`, { headers }),
          axios.get<Timeline>(`/api/admin/analytics/timeline${q}`, { headers }),
          axios.get<TopPage[]>(`/api/admin/analytics/top-pages${q}`, { headers }),
          axios.get<TopService[]>(`/api/admin/analytics/top-services${q}`, { headers }),
          axios.get<Devices>(`/api/admin/analytics/devices${q}`, { headers }),
          axios.get<KV[]>(`/api/admin/analytics/geography${q}`, { headers }),
          axios.get<CityRow[]>(`/api/admin/analytics/cities${q}`, { headers }),
          axios.get<KV[]>(`/api/admin/analytics/referrers${q}`, { headers }),
          axios.get<FunnelData>(`/api/admin/analytics/funnel${q}`, { headers }),
        ]);
        setOverview(o.data);
        setTimeline(t.data);
        setTopPages(tp.data);
        setTopServices(ts.data);
        setDevices(d.data);
        setGeo(g.data);
        setCities(c.data);
        setRefs(rf.data);
        setFunnel(f.data);
        setLiveSessions(o.data.liveSessions);
        setLastUpdated(new Date());
      } catch (e: unknown) {
        // Network / 500 — leave previous data visible but surface a banner.
        console.error('Analytics load failed', e);
        setError('Nu am putut încărca datele analytics.');
      } finally {
        if (!opts.silent) setLoading(false);
      }
    },
    []
  );

  // Leading-edge + trailing-edge debounce so every panel (funnel, devices,
  // geography, referrers) reflects the latest database state within ~250ms
  // of the first event in a burst, while bursts of 20 events in 2s still
  // only trigger 2 refetches (leading + trailing) instead of 20.
  const lastLeadingFetch = useRef<number>(0);
  const scheduleAggregatesRefresh = useCallback(() => {
    const now = Date.now();
    const MIN_LEADING_GAP = 1200; // ms — don't spam leading fetches
    if (now - lastLeadingFetch.current > MIN_LEADING_GAP) {
      lastLeadingFetch.current = now;
      void loadAll(rangeRef.current, { silent: true });
    }
    // Always schedule a trailing refetch to catch any events that arrived
    // after the leading fetch snapshot.
    if (aggregatesDebounce.current) {
      window.clearTimeout(aggregatesDebounce.current);
    }
    aggregatesDebounce.current = window.setTimeout(() => {
      aggregatesDebounce.current = null;
      lastLeadingFetch.current = Date.now();
      void loadAll(rangeRef.current, { silent: true });
    }, 1500);
  }, [loadAll]);

  const loadLive = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const r = await axios.get<LiveEvent[]>('/api/admin/analytics/live', { headers });
      setLive(r.data);
    } catch {
      // ignore — live is best-effort
    }
  }, []);

  useEffect(() => {
    void loadAll(range);
    void loadLive();
  }, [range, loadAll, loadLive]);

  // ---------------------------------------------------------------------
  // Real-time: SSE stream pushes new events + periodic live-session pulse.
  // We still keep a slow 30s fallback poll so that if the stream drops
  // silently (laptop sleep, flaky wifi) the dashboard will eventually
  // reconcile with the database.
  // ---------------------------------------------------------------------

  const handleStreamEvent = useCallback(
    (ev: LiveStreamEvent) => {
      // Prepend into the live feed with a client-side synthetic id. Backend
      // assigns real ids on the next /live fetch; we don't need them here.
      setLive((prev) => {
        const next: LiveEvent = {
          id: eventIdCounter.current--,
          type: ev.type,
          path: ev.path,
          entityType: ev.entityType,
          entityId: ev.entityId,
          entityLabel: ev.entityLabel,
          createdAt: ev.createdAt,
          country: ev.country,
          region: ev.region,
          city: ev.city,
          device: ev.device,
          browser: ev.browser,
          os: ev.os,
          language: ev.language,
        };
        return [next, ...prev].slice(0, 80);
      });

      // Optimistic KPI bump so the numbers move instantly. The silent refetch
      // scheduled below will reconcile any drift from the database within 2.5s.
      setOverview((prev) => {
        if (!prev) return prev;
        const next = { ...prev };
        if (ev.type === 'page_view') next.pageViews = prev.pageViews + 1;
        if (
          ev.type === 'service_view' ||
          ev.type === 'service_cta_click'
        ) {
          next.serviceInterest = prev.serviceInterest + 1;
        }
        if (
          ev.type === 'contact_submit' ||
          ev.type === 'help_submit' ||
          ev.type === 'job_apply_submit'
        ) {
          next.conversions = prev.conversions + 1;
        }
        return next;
      });

      // Optimistic timeline bump on the last bucket (current hour/day).
      setTimeline((prev) => {
        if (!prev || prev.series.length === 0) return prev;
        const series = prev.series.slice();
        const last = { ...series[series.length - 1] };
        if (ev.type === 'page_view') last.pageViews += 1;
        if (
          ev.type === 'contact_submit' ||
          ev.type === 'help_submit' ||
          ev.type === 'job_apply_submit'
        ) {
          last.conversions += 1;
        }
        series[series.length - 1] = last;
        return { ...prev, series };
      });

      // Optimistic top-services bump for service_* events.
      if (
        (ev.type === 'service_view' || ev.type === 'service_cta_click') &&
        ev.entityId
      ) {
        const id = ev.entityId;
        const label = ev.entityLabel || id;
        setTopServices((prev) => {
          const idx = prev.findIndex((s) => s.id === id);
          const cta = ev.type === 'service_cta_click' ? 1 : 0;
          if (idx === -1) {
            return [
              ...prev,
              {
                id,
                label,
                views: ev.type === 'service_view' ? 1 : 0,
                ctaClicks: cta,
                uniqueVisitors: 1,
                totalInteractions: 1,
              },
            ]
              .sort((a, b) => b.totalInteractions - a.totalInteractions)
              .slice(0, 10);
          }
          const updated = prev.slice();
          const s = { ...updated[idx] };
          s.totalInteractions += 1;
          if (ev.type === 'service_view') s.views += 1;
          else s.ctaClicks += 1;
          updated[idx] = s;
          return updated.sort(
            (a, b) => b.totalInteractions - a.totalInteractions
          );
        });
      }

      // Optimistic top-pages bump for page_view events.
      if (ev.type === 'page_view' && ev.path) {
        const path = ev.path;
        setTopPages((prev) => {
          const idx = prev.findIndex((p) => p.path === path);
          if (idx === -1) {
            return [
              ...prev,
              { path, views: 1, uniqueVisitors: 1 },
            ]
              .sort((a, b) => b.views - a.views)
              .slice(0, 10);
          }
          const updated = prev.slice();
          updated[idx] = {
            ...updated[idx],
            views: updated[idx].views + 1,
          };
          return updated.sort((a, b) => b.views - a.views);
        });
      }

      setLastUpdated(new Date());
      scheduleAggregatesRefresh();
    },
    [scheduleAggregatesRefresh]
  );

  const handleStreamPulse = useCallback((pulse: { liveSessions: number }) => {
    setLiveSessions(pulse.liveSessions);
    setLastUpdated(new Date());
  }, []);

  const streamStatus: StreamStatus = useAnalyticsStream({
    onEvent: handleStreamEvent,
    onPulse: handleStreamPulse,
  });

  // Fallback reconciliation — infrequent, silent, only when something could
  // have been missed (stream offline or tab hidden during a burst).
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState !== 'visible') return;
      void loadLive();
      if (streamStatus !== 'live') {
        void loadAll(rangeRef.current, { silent: true });
      }
    };
    liveTimer.current = window.setInterval(tick, 30_000);
    return () => {
      if (liveTimer.current) window.clearInterval(liveTimer.current);
    };
  }, [loadLive, loadAll, streamStatus]);

  // When we come back to the tab after being hidden, do one immediate silent
  // refresh so the numbers don't look stale.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        void loadLive();
        void loadAll(rangeRef.current, { silent: true });
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [loadAll, loadLive]);

  // Stable "fingerprint" strings so the Panel component can detect changes and
  // flash its border. We join sums + lengths which covers both grow/shrink and
  // value changes without needing a deep equality check.
  const sumKV = (arr: KV[] | undefined) =>
    arr ? `${arr.length}:${arr.reduce((a, b) => a + b.value, 0)}` : '0';
  const funnelKey = funnel
    ? `${funnel.steps.length}:${funnel.steps.reduce((a, b) => a + b.value, 0)}`
    : '';
  const devicesKey = sumKV(devices?.devices);
  const osKey = sumKV(devices?.os);
  const browsersKey = sumKV(devices?.browsers);
  const refsKey = sumKV(refs);
  const geoKey = sumKV(geo);
  const citiesKey = `${cities.length}:${cities.reduce((a, b) => a + b.value, 0)}`;
  const topServicesKey = `${topServices.length}:${topServices.reduce(
    (a, b) => a + b.totalInteractions,
    0
  )}`;
  const topPagesKey = `${topPages.length}:${topPages.reduce(
    (a, b) => a + b.views,
    0
  )}`;
  const timelineKey = timeline
    ? `${timeline.series.length}:${timeline.series.reduce(
        (a, b) => a + b.pageViews + b.sessions + b.conversions,
        0
      )}`
    : '';

  const viewsSpark = useMemo(
    () => timeline?.series.map((p) => p.pageViews) ?? [],
    [timeline]
  );
  const sessionsSpark = useMemo(
    () => timeline?.series.map((p) => p.sessions) ?? [],
    [timeline]
  );
  const conversionsSpark = useMemo(
    () => timeline?.series.map((p) => p.conversions) ?? [],
    [timeline]
  );
  const timelineLabels = useMemo(
    () =>
      timeline?.series.map((p) => formatBucketLabel(p.t, timeline.bucket)) ?? [],
    [timeline]
  );

  return (
    <div className="space-y-4 sm:space-y-6" data-tick={nowTick}>
      {/* Header: title + range picker + live pill + refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-medium text-white flex items-center gap-2 flex-wrap">
            Analytics
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-medium ${
                streamStatus === 'live'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : streamStatus === 'connecting'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-slate-500/10 border-slate-500/30 text-slate-400'
              }`}
              title={
                streamStatus === 'live'
                  ? 'Stream conectat — evenimente în timp real'
                  : streamStatus === 'connecting'
                  ? 'Se conectează la stream...'
                  : 'Stream deconectat — se refolosește polling la 30s'
              }
            >
              <span className="relative flex h-1.5 w-1.5">
                {streamStatus === 'live' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                    streamStatus === 'live'
                      ? 'bg-emerald-400'
                      : streamStatus === 'connecting'
                      ? 'bg-amber-400 animate-pulse'
                      : 'bg-slate-500'
                  }`}
                />
              </span>
              {streamStatus === 'live'
                ? `LIVE · ${liveSessions} activi`
                : streamStatus === 'connecting'
                ? 'Conectare...'
                : 'Offline'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Comportamentul vizitatorilor ·{' '}
            {lastUpdated
              ? `actualizat ${formatRelative(lastUpdated.toISOString())}`
              : loading
              ? 'se încarcă...'
              : '—'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-white/10 bg-white/[0.02] p-0.5">
            {RANGE_OPTIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setRange(o.id)}
                className={`px-2.5 sm:px-3 py-1.5 text-xs rounded-md transition-all ${
                  range === o.id
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => loadAll(range)}
            className="h-8 w-8 rounded-md border border-white/10 bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/[0.05] inline-flex items-center justify-center"
            aria-label="Refresh"
          >
            <Icon name="lucide:refresh-cw" width={14} />
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs px-3 py-2">
          {error}
        </div>
      )}

      {/* KPI row — spans horizontally on wider screens */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          label="Vizualizări"
          value={overview?.pageViews}
          trend={overview?.trend.pageViews}
          spark={viewsSpark}
          icon="lucide:eye"
          accent="#818cf8"
          subtitle={`${overview?.avgPagesPerSession ?? 0} pag/sesiune`}
        />
        <KpiCard
          label="Vizitatori"
          value={overview?.sessions}
          trend={overview?.trend.sessions}
          spark={sessionsSpark}
          icon="lucide:users"
          accent="#a78bfa"
          subtitle={`avg ${formatDuration(overview?.avgDurationSec ?? 0)}`}
        />
        <KpiCard
          label="Interes servicii"
          value={overview?.serviceInterest}
          trend={overview?.trend.serviceInterest}
          icon="lucide:sparkles"
          accent="#34d399"
          subtitle="clicks + view-uri"
        />
        <KpiCard
          label="Conversii"
          value={overview?.conversions}
          trend={overview?.trend.conversions}
          spark={conversionsSpark}
          icon="lucide:target"
          accent="#f472b6"
          subtitle={
            overview
              ? `bounce ${(overview.bounceRate * 100).toFixed(0)}%`
              : undefined
          }
        />
      </div>

      {/* Timeline — large */}
      <Panel
        title="Trafic în timp"
        subtitle={timeline ? `${timeline.points} puncte · bucket ${timeline.bucket}` : undefined}
        flashKey={timelineKey}
        right={
          <div className="flex items-center gap-3 text-[11px]">
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <span className="h-1.5 w-3 rounded-sm bg-indigo-400" /> vizualizări
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <span className="h-1.5 w-3 rounded-sm bg-purple-400" /> sesiuni
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <span className="h-1.5 w-3 rounded-sm bg-pink-400" /> conversii
            </span>
          </div>
        }
      >
        {timeline && timeline.series.length > 0 ? (
          <AreaChart
            height={220}
            labels={timelineLabels}
            series={[
              { label: 'Vizualizări', color: '#818cf8', values: viewsSpark },
              { label: 'Sesiuni', color: '#a78bfa', values: sessionsSpark },
              { label: 'Conversii', color: '#f472b6', values: conversionsSpark },
            ]}
          />
        ) : (
          <div className="h-[220px] flex items-center justify-center text-sm text-slate-500">
            Fără date în perioada selectată.
          </div>
        )}
      </Panel>

      {/* Services + Pages side by side on wide screens */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <Panel
          title="Servicii care atrag cel mai mult interes"
          subtitle="clicks pe carduri + CTA-uri către contact"
          flashKey={topServicesKey}
        >
          <BarList
            emptyText="Niciun click încă — tracking activat."
            color="#a78bfa"
            items={topServices.map((s) => ({
              label: s.label || s.id,
              value: s.totalInteractions,
              subValue: `${s.ctaClicks} CTA`,
              sublabel: `${s.uniqueVisitors} vizitatori unici`,
            }))}
          />
        </Panel>

        <Panel
          title="Top pagini"
          subtitle="cele mai vizitate rute"
          flashKey={topPagesKey}
        >
          <BarList
            emptyText="Fără vizualizări înregistrate."
            color="#818cf8"
            items={topPages.map((p) => ({
              label: p.path,
              value: p.views,
              subValue: `${p.uniqueVisitors} unici`,
            }))}
          />
        </Panel>
      </div>

      {/* Funnel (wide) + Devices (compact) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <Panel
          title="Funnel conversie"
          subtitle="vizitator → interes → formular → trimis"
          className="xl:col-span-2"
          flashKey={funnelKey}
        >
          {funnel ? <Funnel steps={funnel.steps} /> : null}
        </Panel>
        <Panel title="Dispozitive" flashKey={devicesKey}>
          {devices && devices.devices.length > 0 ? (
            <Donut
              segments={devices.devices.map((d) => ({ label: d.label, value: d.value }))}
              centerLabel="sesiuni"
              size={170}
            />
          ) : (
            <div className="text-sm text-slate-500 text-center py-6">Fără date.</div>
          )}
        </Panel>
      </div>

      {/* Locații — orașe (wide) + țări (compact) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <Panel
          title="Orașe"
          subtitle="de unde a fost deschis site-ul"
          className="xl:col-span-2"
          flashKey={citiesKey}
          right={
            <span className="text-[11px] text-slate-500 inline-flex items-center gap-1">
              <Icon name="lucide:map-pin" width={12} />
              {cities.length} orașe
            </span>
          }
        >
          <BarList
            color="#f472b6"
            emptyText="Încă nicio locație detectată. Pe localhost geo-lookup returnează gol — deschide site-ul de pe o conexiune publică."
            items={cities.map((c) => ({
              label: c.label,
              value: c.value,
              sublabel: c.region || undefined,
            }))}
          />
        </Panel>
        <Panel title="Țări" flashKey={geoKey}>
          <BarList
            color="#c084fc"
            emptyText="Fără date."
            items={geo.map((k) => ({ label: k.label, value: k.value }))}
          />
        </Panel>
      </div>

      {/* OS + Browsers + Referrers — 3 columns on wide screens */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <Panel title="Sisteme de operare" flashKey={osKey}>
          <BarList
            color="#60a5fa"
            emptyText="Fără date."
            items={(devices?.os ?? []).map((k) => ({ label: k.label, value: k.value }))}
          />
        </Panel>
        <Panel title="Browsere" flashKey={browsersKey}>
          <BarList
            color="#34d399"
            emptyText="Fără date."
            items={(devices?.browsers ?? []).map((k) => ({
              label: k.label,
              value: k.value,
            }))}
          />
        </Panel>
        <Panel title="Surse trafic" flashKey={refsKey}>
          <BarList
            color="#fbbf24"
            emptyText="Trafic direct momentan."
            items={refs.map((k) => ({ label: k.label, value: k.value }))}
          />
        </Panel>
      </div>

      {/* Live feed */}
      <Panel
        title="Activitate live"
        subtitle="push în timp real prin SSE"
        right={
          <span className="text-[11px] text-slate-500 inline-flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                streamStatus === 'live'
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-slate-500'
              }`}
            />
            {streamStatus === 'live' ? 'stream on' : 'fallback 30s'} ·{' '}
            {live.length} evenimente
          </span>
        }
      >
        {live.length === 0 ? (
          <div className="text-sm text-slate-500 text-center py-8">
            Niciun eveniment recent. Deschide site-ul într-un tab privat ca să
            vezi cum curg datele.
          </div>
        ) : (
          <ul className="divide-y divide-white/5 max-h-[360px] overflow-auto -mx-2">
            {live.map((ev) => {
              const meta = EVENT_ICONS[ev.type] ?? {
                icon: 'lucide:activity',
                color: 'text-slate-300',
              };
              return (
                <li
                  key={ev.id}
                  className="flex items-start gap-3 px-2 py-2.5 hover:bg-white/[0.02] transition-colors"
                >
                  <div
                    className={`shrink-0 h-7 w-7 rounded-md bg-white/[0.04] border border-white/10 flex items-center justify-center ${meta.color}`}
                  >
                    <Icon name={meta.icon} width={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-sm text-white font-medium">
                        {ev.type.replace(/_/g, ' ')}
                      </span>
                      {ev.entityLabel && (
                        <span className="text-[11px] text-slate-400 truncate">
                          {ev.entityLabel}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {ev.path || '—'}
                    </div>
                  </div>
                  <div className="shrink-0 text-right text-[10px] text-slate-500 space-y-0.5">
                    <div>{formatRelative(ev.createdAt)}</div>
                    <div className="text-slate-400">
                      {ev.device ?? 'device?'} · {ev.browser ?? '—'}
                    </div>
                    {(ev.city || ev.country) && (
                      <div className="text-emerald-300/80 inline-flex items-center justify-end gap-0.5">
                        <Icon name="lucide:map-pin" width={10} />
                        {ev.city
                          ? ev.country
                            ? `${ev.city}, ${ev.country}`
                            : ev.city
                          : ev.country}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </div>
  );
}
