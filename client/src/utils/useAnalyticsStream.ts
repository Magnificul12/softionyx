import { useEffect, useRef, useState } from 'react';

// Real-time channel to /api/admin/analytics/stream. Uses a plain EventSource
// because we don't need client→server messages, and the browser handles
// reconnection for us. We still implement our own visible connection state
// + exponential-ish backoff cap so the UI can reflect "reconnecting".

export type StreamStatus = 'connecting' | 'live' | 'offline';

export interface LiveStreamEvent {
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

export interface PulsePayload {
  liveSessions: number;
  at: string;
}

interface Handlers {
  onEvent?: (ev: LiveStreamEvent) => void;
  onPulse?: (pulse: PulsePayload) => void;
}

export function useAnalyticsStream({ onEvent, onPulse }: Handlers = {}) {
  const [status, setStatus] = useState<StreamStatus>('connecting');
  const handlersRef = useRef<Handlers>({ onEvent, onPulse });
  handlersRef.current = { onEvent, onPulse };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setStatus('offline');
      return;
    }

    let es: EventSource | null = null;
    let retryTimer: number | null = null;
    let attempts = 0;
    let cancelled = false;

    const connect = () => {
      if (cancelled) return;
      setStatus('connecting');
      try {
        // Token via query because EventSource can't set headers. The backend
        // verifies it with jwt.verify, same as the authenticate middleware.
        es = new EventSource(
          `/api/admin/analytics/stream?token=${encodeURIComponent(token)}`
        );
      } catch {
        scheduleRetry();
        return;
      }

      es.addEventListener('hello', () => {
        attempts = 0;
        setStatus('live');
      });

      es.addEventListener('event', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data) as LiveStreamEvent;
          handlersRef.current.onEvent?.(data);
        } catch {
          /* ignore malformed */
        }
      });

      es.addEventListener('pulse', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data) as PulsePayload;
          handlersRef.current.onPulse?.(data);
        } catch {
          /* ignore */
        }
      });

      es.onerror = () => {
        // EventSource auto-retries, but Chrome sometimes keeps a dead socket.
        // Force a clean reconnect with our own backoff so the UI can show
        // "reconnecting" honestly.
        setStatus('offline');
        es?.close();
        es = null;
        scheduleRetry();
      };
    };

    const scheduleRetry = () => {
      if (cancelled) return;
      attempts = Math.min(attempts + 1, 6);
      const delay = Math.min(1000 * 2 ** (attempts - 1), 15_000);
      retryTimer = window.setTimeout(connect, delay);
    };

    connect();

    return () => {
      cancelled = true;
      if (retryTimer) window.clearTimeout(retryTimer);
      es?.close();
    };
  }, []);

  return status;
}
