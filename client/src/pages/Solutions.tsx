import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Solutions.css';

export default function Solutions() {
  const { t } = useTranslation();
  const solutionsSectionRef = useRef<HTMLDivElement | null>(null);
  const highlightsRef = useRef<HTMLDivElement | null>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [highlightsVisible, setHighlightsVisible] = useState(false);

  const solutions = [
    { title: 'solutionsPage.items.product.title', desc: 'solutionsPage.items.product.desc' },
    { title: 'solutionsPage.items.data.title', desc: 'solutionsPage.items.data.desc' },
    { title: 'solutionsPage.items.automation.title', desc: 'solutionsPage.items.automation.desc' },
    { title: 'solutionsPage.items.cloud.title', desc: 'solutionsPage.items.cloud.desc' },
    { title: 'solutionsPage.items.security.title', desc: 'solutionsPage.items.security.desc' },
    { title: 'solutionsPage.items.integration.title', desc: 'solutionsPage.items.integration.desc' }
  ] as const;

  useEffect(() => {
    const section = solutionsSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
            setVisibleCards((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );

    const cards = section.querySelectorAll('.solution-card');
    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card));
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
        ref={solutionsSectionRef}
        className="solutions-grid-section relative z-10 border-t border-white/5 py-24"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="solutions-grid">
            {solutions.map((solution, idx) => (
              <div
                key={idx}
                data-index={idx}
                className={`solution-card ${visibleCards.has(idx) ? 'is-visible' : ''}`}
                style={{ ['--delay' as never]: `${idx * 80}ms` } as CSSProperties}
              >
                <div className="solution-card-inner">
                  <div className="solution-card-number">0{idx + 1}</div>
                  <h3 className="solution-card-title">{t(solution.title)}</h3>
                  <p className="solution-card-desc">{t(solution.desc)}</p>
                  <div className="solution-card-line"></div>
                </div>
              </div>
            ))}
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
