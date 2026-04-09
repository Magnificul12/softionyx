import { lazy, Suspense, useEffect, useState } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

const DEFAULT_SCENE =
  'https://prod.spline.design/12TScx4Q3As2MawO/scene.splinecode';

function sceneUrl(): string {
  const url = import.meta.env.VITE_SPLINE_SCENE_URL as string | undefined;
  return url?.trim() || DEFAULT_SCENE;
}

export default function HeroSplineBackground() {
  const [desktop, setDesktop] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!desktop) setSceneReady(false);
  }, [desktop]);

  if (!desktop) return null;

  return (
    <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
      <div
        className={`absolute inset-0 transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          sceneReady
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-3'
        }`}
      >
        <Suspense fallback={null}>
          <Spline
            scene={sceneUrl()}
            className="!absolute !inset-0 !h-full !w-full"
            style={{ minHeight: '100%' }}
            onLoad={() => setSceneReady(true)}
          />
        </Suspense>
        {/* Bandă plină jos peste badge-ul „Built with Spline” (plan free). Eliminare oficială: abonament Spline. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[4.5rem] w-full bg-gradient-to-t from-slate-950 from-[35%] via-slate-950/90 to-transparent sm:h-24"
          aria-hidden
        />
      </div>
    </div>
  );
}
