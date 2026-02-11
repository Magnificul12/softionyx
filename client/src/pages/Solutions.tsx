import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Solutions.css';

export default function Solutions() {
  const { t } = useTranslation();
  const carouselSectionRef = useRef<HTMLDivElement | null>(null);
  const highlightsRef = useRef<HTMLDivElement | null>(null);
  const activeSlideRef = useRef(0);
  const wasLockedRef = useRef(false);
  const wheelAccumRef = useRef(0);
  const firedDownRef = useRef(false);
  const firedUpRef = useRef(false);
  const lastWheelTimeRef = useRef(0);
  const WHEEL_THRESHOLD = 180;
  /** Pauză (ms) fără evenimente wheel = gest încheiat; următorul scroll = gest nou, un card nou */
  const GESTURE_END_MS = 350;
  const [activeSlide, setActiveSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const [isLocked, setIsLocked] = useState(false);
  const [sectionScale, setSectionScale] = useState(0.88);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [highlightsVisible, setHighlightsVisible] = useState(false);
  activeSlideRef.current = activeSlide;
  const slides = [
    { title: 'solutionsPage.items.product.title', desc: 'solutionsPage.items.product.desc' },
    { title: 'solutionsPage.items.data.title', desc: 'solutionsPage.items.data.desc' },
    { title: 'solutionsPage.items.automation.title', desc: 'solutionsPage.items.automation.desc' },
    { title: 'solutionsPage.items.cloud.title', desc: 'solutionsPage.items.cloud.desc' },
    { title: 'solutionsPage.items.security.title', desc: 'solutionsPage.items.security.desc' },
    { title: 'solutionsPage.items.integration.title', desc: 'solutionsPage.items.integration.desc' }
  ] as const;

  useEffect(() => {
    const section = carouselSectionRef.current;
    if (!section) return;

    const checkLock = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const minScale = 0.88;
      const maxScale = 1;
      if (rect.top >= vh) {
        setSectionScale(minScale);
      } else if (rect.top <= 0) {
        setSectionScale(maxScale);
      } else {
        const t = 1 - Math.min(1, rect.top / vh);
        setSectionScale(minScale + (maxScale - minScale) * t);
      }
      if (rect.top <= 30 && rect.bottom >= vh * 0.5) {
        if (!wasLockedRef.current) {
          wasLockedRef.current = true;
          window.scrollTo({ top: section.offsetTop, behavior: 'auto' });
        }
        setIsLocked(true);
      } else {
        if (rect.top > 50 || window.scrollY >= section.offsetTop + section.offsetHeight - 5) {
          wasLockedRef.current = false;
          setIsLocked(false);
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inSection = rect.top <= 50 && rect.bottom >= window.innerHeight * 0.3;
      if (!inSection) {
        wheelAccumRef.current = 0;
        firedDownRef.current = false;
        firedUpRef.current = false;
        return;
      }

      const now = Date.now();
      if (now - lastWheelTimeRef.current > GESTURE_END_MS) {
        wheelAccumRef.current = 0;
        firedDownRef.current = false;
        firedUpRef.current = false;
      }
      lastWheelTimeRef.current = now;

      const current = activeSlideRef.current;
      wheelAccumRef.current += e.deltaY;
      const accum = wheelAccumRef.current;

      if (accum >= WHEEL_THRESHOLD) {
        if (current < slides.length - 1 && !firedDownRef.current) {
          firedDownRef.current = true;
          wheelAccumRef.current = 0;
          e.preventDefault();
          setSlideDirection('next');
          setActiveSlide((prev) => {
            const next = Math.min(slides.length - 1, prev + 1);
            setPrevSlide(prev);
            if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
            transitionTimeoutRef.current = setTimeout(() => setPrevSlide(next), 420);
            return next;
          });
        } else if (current >= slides.length - 1) {
          setIsLocked(false);
          window.scrollTo({ top: section.offsetTop + section.offsetHeight, behavior: 'smooth' });
        } else {
          if (current < slides.length - 1) e.preventDefault();
        }
      } else if (accum <= -WHEEL_THRESHOLD) {
        if (current > 0 && !firedUpRef.current) {
          firedUpRef.current = true;
          wheelAccumRef.current = 0;
          e.preventDefault();
          setSlideDirection('prev');
          setActiveSlide((prev) => {
            const next = Math.max(0, prev - 1);
            setPrevSlide(prev);
            if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
            transitionTimeoutRef.current = setTimeout(() => setPrevSlide(next), 420);
            return next;
          });
        } else {
          if (current > 0) e.preventDefault();
          if (current === 0) setIsLocked(false);
        }
      } else {
        if (current < slides.length - 1 || current > 0) e.preventDefault();
      }
    };

    const onScroll = () => checkLock();
    const onResize = () => checkLock();
    checkLock();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('wheel', onWheel);
    };
  }, [slides.length, isLocked]);

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
        ref={carouselSectionRef}
        className="solutions-carousel-section relative z-10 border-t border-white/5 min-h-[100vh] flex items-center justify-center"
        style={{
          minHeight: '100vh',
          transform: `scale(${sectionScale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.45s cubic-bezier(0.2, 0.9, 0.2, 1), margin 0.45s cubic-bezier(0.2, 0.9, 0.2, 1), border-radius 0.45s cubic-bezier(0.2, 0.9, 0.2, 1)',
          marginLeft: sectionScale >= 1 ? 0 : `${((1 - sectionScale) / (1 - 0.88)) * 24}px`,
          marginRight: sectionScale >= 1 ? 0 : `${((1 - sectionScale) / (1 - 0.88)) * 24}px`,
          borderRadius: sectionScale >= 1 ? 0 : `${((1 - sectionScale) / (1 - 0.88)) * 32}px`,
        }}
        role="region"
        aria-label="Carousel soluții"
      >
        <div className="solutions-carousel-card-wrapper w-full max-w-4xl mx-auto px-6">
          <div className="solutions-reveal-stage" data-direction={slideDirection}>
            {slides.map((item, idx) => {
              const isActive = idx === activeSlide;
              const isExiting = idx === prevSlide && prevSlide !== activeSlide;
              const isEntering = idx === activeSlide && prevSlide !== activeSlide;
              const visible = isActive || isExiting;
              const exitClass = slideDirection === 'next' ? 'solutions-panel-exit-up' : 'solutions-panel-exit-down';
              const enterClass = slideDirection === 'next' ? 'solutions-panel-enter-from-bottom' : 'solutions-panel-enter-from-top';
              return (
              <div
                key={idx}
                className={`solutions-reveal-panel ${isActive ? 'is-active' : ''} ${visible ? 'is-visible' : ''} ${isExiting ? exitClass : ''} ${isEntering ? enterClass : ''}`}
                aria-hidden={!isActive}
              >
                <div className="solutions-reveal-panel-inner">
                  <div className="solutions-reveal-meta">
                    <span className="solutions-reveal-kicker">0{idx + 1}</span>
                    <span className="solutions-reveal-divider"></span>
                    <span className="solutions-reveal-count">/ {String(slides.length).padStart(2, '0')}</span>
                  </div>
                  <h3 className="text-white text-2xl md:text-3xl font-semibold mb-3">{t(item.title)}</h3>
                  <p className="text-slate-300 text-base md:text-lg font-light max-w-2xl">{t(item.desc)}</p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
        {isLocked && (
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-500 text-xs">
            {t('solutionsPage.scrollHint')}
          </p>
        )}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                {highlights.map((item, idx) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 solutions-reveal-item min-h-[120px] flex flex-col"
                    style={{ ['--reveal-delay' as never]: `${120 + idx * 90}ms` } as CSSProperties}
                  >
                    <h3 className="text-white font-medium mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-sm font-light flex-1">{item.desc}</p>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-center mb-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 min-w-0">
                    <div className="text-white text-lg font-semibold">{stat.value}</div>
                    <div className="text-xs text-slate-400 font-light">{stat.label}</div>
                  </div>
                ))}
              </div>
              <Link
                to="/contact#contact-info"
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
