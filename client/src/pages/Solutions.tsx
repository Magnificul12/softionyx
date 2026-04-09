import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Solutions.css';

export default function Solutions() {
  const { t } = useTranslation();
  const revealSectionRef = useRef<HTMLDivElement | null>(null);
  const highlightsRef = useRef<HTMLDivElement | null>(null);
  const [revealProgress, setRevealProgress] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const [highlightsVisible, setHighlightsVisible] = useState(false);
  const slides = [
    { title: 'solutionsPage.items.product.title', desc: 'solutionsPage.items.product.desc' },
    { title: 'solutionsPage.items.data.title', desc: 'solutionsPage.items.data.desc' },
    { title: 'solutionsPage.items.automation.title', desc: 'solutionsPage.items.automation.desc' }
  ] as const;

  useEffect(() => {
    // Reset slide when leaving fullscreen state
    const isCurrentlyFullscreen = revealProgress >= 0.85;
    if (!isCurrentlyFullscreen && activeSlide !== 0) {
      setActiveSlide(0);
    }
  }, [revealProgress, activeSlide]);

  useEffect(() => {
    const section = revealSectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      setRevealProgress(1);
      return;
    }

    let rafId = 0;
    const update = () => {
      rafId = 0;
      const viewportHeight = window.innerHeight;
      const ramp = viewportHeight * 0.6;
      const start = section.offsetTop;
      const end = start + section.offsetHeight - viewportHeight;
      const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
      const beforeRaw = (window.scrollY - (start - ramp)) / Math.max(1, ramp);
      const afterRaw = 1 - (window.scrollY - end) / Math.max(1, ramp);

      if (window.scrollY < start) {
        setRevealProgress(clamp01(beforeRaw));
        return;
      }

      if (window.scrollY > end) {
        setRevealProgress(clamp01(afterRaw));
        return;
      }

      // When pinned, the card is already fullscreen.
      setRevealProgress(1);
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    const target = highlightsRef.current;
    if (!target) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      setHighlightsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHighlightsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const isFullscreen = revealProgress >= 0.85;
  const canGoPrev = activeSlide > 0;
  const canGoNext = activeSlide < slides.length - 1;

  const goPrev = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveSlide((currentSlide) => {
      const newSlide = Math.max(0, currentSlide - 1);
      if (newSlide !== currentSlide) {
        setSlideDirection('prev');
      }
      return newSlide;
    });
  };

  const goNext = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveSlide((currentSlide) => {
      const newSlide = Math.min(slides.length - 1, currentSlide + 1);
      if (newSlide !== currentSlide) {
        setSlideDirection('next');
      }
      return newSlide;
    });
  };

  const revealStyle = { ['--reveal' as never]: revealProgress } as CSSProperties;
  const highlights = [
    {
      title: t('solutionsPage.highlights.items.clarity.title'),
      desc: t('solutionsPage.highlights.items.clarity.desc')
    },
    {
      title: t('solutionsPage.highlights.items.delivery.title'),
      desc: t('solutionsPage.highlights.items.delivery.desc')
    },
    {
      title: t('solutionsPage.highlights.items.growth.title'),
      desc: t('solutionsPage.highlights.items.growth.desc')
    }
  ];

  const stats = [
    { value: '2-4x', label: t('solutionsPage.stats.speed') },
    { value: '99.9%', label: t('solutionsPage.stats.reliability') },
    { value: '6-8', label: t('solutionsPage.stats.weeks') }
  ];

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 animate-grid"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="animate-in">
            <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tighter mb-6">
              {t('solutionsPage.heroTitlePrefix')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">{t('solutionsPage.heroTitleHighlight')}</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
              {t('solutionsPage.heroSubtitle')}
            </p>
          </div>
        </div>
      </section>

      <section
        ref={revealSectionRef}
        className="solutions-reveal-section relative z-10 border-t border-white/5"
        style={revealStyle}
      >
        <div className="solutions-reveal-sticky">
          <div className="solutions-reveal-card" data-fullscreen={isFullscreen ? 'true' : 'false'}>
            <div className="solutions-reveal-stage" data-direction={slideDirection}>
              {slides.map((item, idx) => (
                <div
                  key={idx}
                  className={`solutions-reveal-panel ${idx === activeSlide ? 'is-active' : ''}`}
                  aria-hidden={idx !== activeSlide}
                >
                  <div className="solutions-reveal-panel-inner">
                    <div className="solutions-reveal-meta">
                      <span className="solutions-reveal-kicker">0{idx + 1}</span>
                      <span className="solutions-reveal-divider"></span>
                      <span className="solutions-reveal-count">/ 03</span>
                    </div>
                    <h3 className="text-white text-2xl md:text-3xl font-semibold mb-3">{t(item.title)}</h3>
                    <p className="text-slate-300 text-base md:text-lg font-light max-w-2xl">{t(item.desc)}</p>
                  </div>
                </div>
              ))}
            </div>

            {isFullscreen && (
              <div className="solutions-reveal-controls is-visible" aria-label="Change slide">
                <button
                  type="button"
                  className={`solutions-reveal-btn ${!canGoPrev ? 'is-disabled' : ''}`}
                  onClick={goPrev}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    goPrev(e);
                  }}
                  aria-label="Previous card"
                  aria-disabled={!canGoPrev}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className={`solutions-reveal-btn ${!canGoNext ? 'is-disabled' : ''}`}
                  onClick={goNext}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    goNext(e);
                  }}
                  aria-label="Next card"
                  aria-disabled={!canGoNext}
                >
                  ↓
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        ref={highlightsRef}
        className={`py-20 relative z-10 border-t border-white/5 solutions-reveal-once ${highlightsVisible ? 'is-visible' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 solutions-reveal-item">
                {t('solutionsPage.highlights.title')}
              </h2>
              <p className="text-slate-400 text-base md:text-lg font-light max-w-xl solutions-reveal-item">
                {t('solutionsPage.highlights.subtitle')}
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                {highlights.map((item, idx) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 solutions-reveal-item"
                    style={{ ['--reveal-delay' as never]: `${120 + idx * 90}ms` } as CSSProperties}
                  >
                    <h3 className="text-white font-medium mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-sm font-light">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-slate-950/80 to-slate-950/70 p-8 md:p-10 shadow-2xl solutions-reveal-item"
              style={{ ['--reveal-delay' as never]: `220ms` } as CSSProperties}
            >
              <h3 className="text-2xl md:text-3xl font-semibold text-white mb-3">
                {t('solutionsPage.cta.title')}
              </h3>
              <p className="text-slate-400 text-sm md:text-base font-light mb-6">
                {t('solutionsPage.cta.subtitle')}
              </p>
              <div className="grid grid-cols-3 gap-4 text-center mb-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <div className="text-white text-lg font-semibold">{stat.value}</div>
                    <div className="text-xs text-slate-400 font-light">{stat.label}</div>
                  </div>
                ))}
              </div>
              <Link
                to="/request-help"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-slate-950 font-medium text-sm hover:bg-indigo-100 transition-colors"
              >
                {t('solutionsPage.cta.button')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
