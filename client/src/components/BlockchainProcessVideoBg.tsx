import { useEffect, useRef } from 'react';

/**
 * Fundal: Blockchain.mp4 în buclă continuă (redare normală de la început la sfârșit, repetat).
 * Mut, fără sunet. Respectă `prefers-reduced-motion`.
 */
export default function BlockchainProcessVideoBg() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      v.removeAttribute('src');
      v.load();
      return;
    }

    const tryPlay = () => {
      void v.play().catch(() => {});
    };

    v.addEventListener('loadeddata', tryPlay);
    tryPlay();

    const onVisibility = () => {
      if (document.visibilityState === 'visible') tryPlay();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pageshow', tryPlay);

    return () => {
      v.removeEventListener('loadeddata', tryPlay);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pageshow', tryPlay);
      v.pause();
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <video
        ref={videoRef}
        className="h-full w-full min-h-full object-cover opacity-40 [transform:translateZ(0)]"
        src="/Blockchain.mp4"
        muted
        playsInline
        loop
        autoPlay
        preload="auto"
      />
      <div className="absolute inset-0 bg-slate-950/80" />
    </div>
  );
}
