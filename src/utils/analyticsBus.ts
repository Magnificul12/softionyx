import { EventEmitter } from 'events';

// Small pub/sub so the analytics ingestion endpoint can notify long-lived SSE
// subscribers (admin dashboards) without coupling them directly. One instance
// per process is enough — we're not running a cluster yet, and if we ever do
// this can be swapped for Redis pub/sub without touching the callers.

export interface StreamEvent {
  type: string;
  path: string | null;
  entityType: string | null;
  entityId: string | null;
  entityLabel: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  language: string | null;
  sessionId: string;
  createdAt: string;
}

class AnalyticsBus extends EventEmitter {}

export const analyticsBus = new AnalyticsBus();
// Each admin dashboard tab opens one listener. Bump the ceiling so Node stops
// warning at 10 — we'd rather handle 50 concurrent admins.
analyticsBus.setMaxListeners(100);

export function emitAnalyticsEvent(ev: StreamEvent): void {
  analyticsBus.emit('event', ev);
}
