import { useEffect, useState } from 'react';

/**
 * Thin top bar that fills 0→100% as the user scrolls the article body.
 * Pass a ref to the <article> element whose scroll determines progress.
 */
export default function ReadingProgress({
  targetRef,
}: {
  targetRef: React.RefObject<HTMLElement>;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = targetRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const passed = -rect.top;
      const pct = Math.max(0, Math.min(100, (passed / Math.max(1, total)) * 100));
      setProgress(pct);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [targetRef]);

  return (
    <div
      className="reading-progress"
      style={{ width: `${progress}%` }}
      aria-hidden
    />
  );
}
