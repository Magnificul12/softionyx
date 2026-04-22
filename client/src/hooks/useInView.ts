import { useEffect, useRef, useState } from 'react';

export interface UseInViewOptions {
  /** Fraction of the element that must be visible to trigger. Default 0.1 (10%). */
  threshold?: number | number[];
  /** Margin around the root. Negative values shrink the root; positive grow it. */
  rootMargin?: string;
  /** If true (default), the observer disconnects after the first intersection —
   *  useful for one-shot reveal animations. Set false for ongoing visibility. */
  once?: boolean;
}

/**
 * Observe when an element enters the viewport using IntersectionObserver.
 *
 *   const { ref, inView } = useInView({ once: true });
 *   return <div ref={ref} className={inView ? 'animate-in' : 'opacity-0'} />;
 *
 * On SSR / prerender (puppeteer) the observer is a no-op — `inView` is true
 * from the start, so prerendered HTML matches the "visible" state. This is
 * critical for SEO: Google must see the final content, not skeletons.
 */
export function useInView<T extends Element = HTMLDivElement>(
  opts: UseInViewOptions = {}
): { ref: React.RefObject<T>; inView: boolean } {
  const { threshold = 0.1, rootMargin = '0px 0px -60px 0px', once = true } = opts;
  const ref = useRef<T>(null);
  // Default to `true` when IntersectionObserver is unavailable (SSR, prerender,
  // ancient browsers) so content renders immediately rather than staying hidden.
  const [inView, setInView] = useState<boolean>(
    typeof window === 'undefined' || typeof IntersectionObserver === 'undefined'
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
