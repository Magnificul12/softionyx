import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { initAnalytics, trackPageView } from '../utils/analytics';

// Mounts once next to the router. Initialises the analytics queue, then fires
// a page_view event on every route change (including the first one).
export default function AnalyticsTracker() {
  const { pathname, search } = useLocation();
  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;
    initAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(pathname + (search || ''));
  }, [pathname, search]);

  return null;
}
