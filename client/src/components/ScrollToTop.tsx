import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const LEGAL_PATHS = ['/privacy', '/terms', '/cookies'];

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    const isLegalNow = LEGAL_PATHS.includes(pathname);
    const wasLegalBefore = LEGAL_PATHS.includes(prevPathRef.current);

    if (isLegalNow || wasLegalBefore) {
      window.scrollTo(0, 0);
    }
    prevPathRef.current = pathname;
  }, [pathname]);

  return null;
}
