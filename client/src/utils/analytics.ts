// Client-side analytics tracker.
// - Creates/persists an anonymous session id in sessionStorage (cleared when
//   the tab is closed so we can count sessions accurately).
// - Also persists a visitor id in localStorage for cross-session recognition,
//   although the backend mainly uses the session id today.
// - Events are queued and flushed in small batches either on a timer or when
//   the page is being unloaded (sendBeacon preferred).

type EventType =
  | 'page_view'
  | 'service_view'
  | 'service_cta_click'
  | 'portfolio_view'
  | 'blog_view'
  | 'contact_start'
  | 'contact_submit'
  | 'help_start'
  | 'help_submit'
  | 'job_view'
  | 'job_apply_start'
  | 'job_apply_submit'
  | 'external_click'
  | 'scroll_milestone'
  | 'session_end';

export interface AnalyticsEvent {
  type: EventType;
  path?: string;
  entityType?: string;
  entityId?: string | number;
  entityLabel?: string;
  referrer?: string;
  metadata?: Record<string, unknown>;
}

const ENDPOINT = '/api/analytics/track';
const SESSION_KEY = 'analytics_sid';
const FLUSH_INTERVAL_MS = 4000;
const MAX_BATCH = 15;

// Admin opt-out: we don't want the dashboard polluted by admin traffic.
// We decode the role from the JWT directly because authStore doesn't persist
// the user object to localStorage — only the token. This also means the check
// re-evaluates correctly after login/logout without needing a reload.
function isDntOrAdmin(): boolean {
  try {
    if (typeof navigator !== 'undefined' && navigator.doNotTrack === '1') return true;
    const token = localStorage.getItem('token');
    if (token) {
      const parts = token.split('.');
      if (parts.length >= 2) {
        // Base64URL → Base64 → JSON
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64 + '==='.slice((base64.length + 3) % 4);
        const payload = JSON.parse(atob(padded)) as { role?: string };
        if (payload.role === 'admin') return true;
      }
    }
  } catch {
    // fall through
  }
  return false;
}

function randomId(): string {
  const buf = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(buf);
  } else {
    for (let i = 0; i < buf.length; i++) buf[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('');
}

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = randomId();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // SSR / privacy mode — fall back to a per-load id.
    return randomId();
  }
}

let queue: AnalyticsEvent[] = [];
let timer: number | null = null;
let lastPath: string | null = null;
let disabled = false;

function scheduleFlush() {
  if (disabled) return;
  if (timer != null) return;
  timer = window.setTimeout(() => {
    timer = null;
    void flush();
  }, FLUSH_INTERVAL_MS);
}

async function flush(useBeacon = false): Promise<void> {
  if (queue.length === 0) return;
  const batch = queue.splice(0, MAX_BATCH);
  const payload = JSON.stringify({ sessionId: getSessionId(), events: batch });

  try {
    if (useBeacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
      // sendBeacon handles the "page is going away" case cleanly.
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(ENDPOINT, blob);
      return;
    }
    await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
      credentials: 'same-origin',
    });
  } catch {
    // Swallow — analytics should never throw into the app.
  }
}

function enqueue(e: AnalyticsEvent) {
  if (disabled) return;
  // Re-check on every event so that an admin logging in mid-session stops
  // polluting the dashboard without requiring a full reload.
  if (isDntOrAdmin()) {
    disabled = true;
    queue = [];
    return;
  }
  queue.push({
    ...e,
    path: e.path ?? (typeof window !== 'undefined' ? window.location.pathname : undefined),
  });
  if (queue.length >= MAX_BATCH) {
    void flush();
  } else {
    scheduleFlush();
  }
}

export function initAnalytics(): void {
  if (typeof window === 'undefined') return;
  if (isDntOrAdmin()) {
    disabled = true;
    return;
  }

  // Flush on hide / unload so we don't lose the last events.
  const handleHide = () => {
    if (disabled) return;
    if (queue.length > 0) void flush(true);
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') handleHide();
  });
  window.addEventListener('pagehide', handleHide);
  window.addEventListener('beforeunload', handleHide);
}

export function trackPageView(path?: string): void {
  const p = path ?? window.location.pathname + window.location.search;
  if (lastPath === p) return; // Avoid duplicate views on StrictMode double-render
  lastPath = p;
  enqueue({
    type: 'page_view',
    path: p,
    referrer: document.referrer || undefined,
  });
}

export function trackEvent(
  type: EventType,
  opts: Omit<AnalyticsEvent, 'type'> = {}
): void {
  enqueue({ type, ...opts });
}

export function trackServiceView(id: string | number, label?: string): void {
  trackEvent('service_view', { entityType: 'service', entityId: id, entityLabel: label });
}

export function trackServiceCTA(id: string | number, label?: string): void {
  trackEvent('service_cta_click', {
    entityType: 'service',
    entityId: id,
    entityLabel: label,
  });
}

export function trackPortfolioView(id: string | number, label?: string): void {
  trackEvent('portfolio_view', {
    entityType: 'portfolio',
    entityId: id,
    entityLabel: label,
  });
}

export function trackBlogView(slug: string, title?: string): void {
  trackEvent('blog_view', { entityType: 'blog', entityId: slug, entityLabel: title });
}
