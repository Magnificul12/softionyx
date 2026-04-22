/**
 * Individual service landing page — rendered at /services/:slug.
 *
 * The page reads language-agnostic metadata (slug, icon, color, pricing
 * figures, case-study asset URLs, related slugs) from `src/data/services.ts`
 * and translatable copy (h1, intro, process steps, pricing descriptions,
 * FAQ, testimonial, etc.) from the `services` i18n namespace under
 * `content.<slug>` in `src/locales/{ro,en,ru}/services.json`.
 *
 * Chrome labels (section titles, button copy, breadcrumb, etc.) come from
 * `services.detail.*`.
 *
 * SEO-critical elements emitted per page:
 *   • Canonical <title> + <meta description> with primary keyword
 *   • JSON-LD: BreadcrumbList + Service (with Offer) + FAQPage + LocalBusiness
 *   • Crawlable H1 → H2 → H3 hierarchy
 *   • Internal links to related services (for topical authority)
 *   • High-quality outbound link to case study live URL
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon } from '../components/Icons';
import SEO from '../components/SEO';
import Reveal from '../components/Reveal';
import ResponsiveImage from '../components/ResponsiveImage';
import BlockchainProcessVideoBg from '../components/BlockchainProcessVideoBg';
import { LangLink } from '../i18n/routing';
import {
  getServiceBySlug,
  SERVICES,
  type ServiceMeta,
  type ServiceContent,
} from '../data/services';
import {
  buildBreadcrumbList,
  buildDetailedServiceSchema,
  buildFAQPageSchema,
  buildLocalBusinessSchema,
} from '../utils/structuredData';
import { trackServiceView, trackServiceCTA } from '../utils/analytics';

const colorClasses = {
  indigo: {
    accent: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    gradient: 'from-indigo-300 to-purple-300',
    glow: 'shadow-[0_0_80px_-20px_rgba(99,102,241,0.45)]',
  },
  purple: {
    accent: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    gradient: 'from-purple-300 to-pink-300',
    glow: 'shadow-[0_0_80px_-20px_rgba(168,85,247,0.45)]',
  },
  emerald: {
    accent: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    gradient: 'from-emerald-300 to-teal-300',
    glow: 'shadow-[0_0_80px_-20px_rgba(16,185,129,0.45)]',
  },
  blue: {
    accent: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    gradient: 'from-blue-300 to-cyan-300',
    glow: 'shadow-[0_0_80px_-20px_rgba(59,130,246,0.45)]',
  },
  orange: {
    accent: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    gradient: 'from-orange-300 to-amber-300',
    glow: 'shadow-[0_0_80px_-20px_rgba(249,115,22,0.45)]',
  },
  pink: {
    accent: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    gradient: 'from-pink-300 to-rose-300',
    glow: 'shadow-[0_0_80px_-20px_rgba(236,72,153,0.45)]',
  },
} as const;

/**
 * Fetch the translated content block for a given slug. `returnObjects` lets us
 * pull nested arrays/objects directly. Falls back gracefully if the key is
 * missing in the current language.
 */
function useServiceContent(slug: string): ServiceContent | null {
  const { t, i18n } = useTranslation('services');
  return useMemo(() => {
    const content = t(`content.${slug}`, { returnObjects: true }) as
      | ServiceContent
      | string;
    // i18next returns the key as a string if it's missing.
    if (!content || typeof content === 'string') return null;
    return content;
    // We intentionally depend on i18n.language so the memo recomputes on lang
    // switch (the `t` identity alone isn't always stable enough).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, i18n.language]);
}

/** Pick a locale tag for number formatting based on active language. */
function localeForLang(lang: string): string {
  const base = lang.split('-')[0];
  if (base === 'ro') return 'ro-RO';
  if (base === 'ru') return 'ru-RU';
  return 'en-US';
}

/** Shortest path on the carousel ring → used for enter animations (next vs prev). */
function caseStudyEnterDirection(
  from: number,
  to: number,
  len: number,
): 'next' | 'prev' {
  if (len <= 1 || from === to) return 'next';
  const forward = (to - from + len) % len;
  const backward = (from - to + len) % len;
  return forward <= backward ? 'next' : 'prev';
}

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : undefined;
  const content = useServiceContent(slug ?? '');

  useEffect(() => {
    if (service) {
      trackServiceView(service.slug, service.serviceType);
    }
  }, [service]);

  if (!service) {
    return <Navigate to=".." replace />;
  }

  // Content missing entirely (shouldn't happen once all 3 locale files are
  // populated, but guard anyway).
  if (!content) {
    return <Navigate to=".." replace />;
  }

  return <ServiceDetailContent service={service} content={content} />;
}

function ServiceDetailContent({
  service,
  content,
}: {
  service: ServiceMeta;
  content: ServiceContent;
}) {
  const { t, i18n } = useTranslation('services');
  const colors = colorClasses[service.color];
  const [openFaqIdx, setOpenFaqIdx] = useState<number>(0);
  const numberLocale = localeForLang(i18n.language);

  const relatedServices = service.related
    .map((s) => SERVICES.find((x) => x.slug === s))
    .filter((x): x is ServiceMeta => Boolean(x));

  // Merge metadata pricing (numeric + popular flag) with i18n copy (name,
  // description, features). The arrays must stay aligned by index — both are
  // defined in service-index order.
  const pricingTiers = useMemo(() => {
    if (!content.pricing || content.pricing.length === 0) return [];
    const meta = service.pricingMeta ?? [];
    return content.pricing.map((tier, i) => ({
      name: tier.name,
      description: tier.description,
      features: tier.features,
      priceFrom: meta[i]?.priceFrom ?? service.priceFrom ?? 0,
      priceCurrency: meta[i]?.priceCurrency ?? service.priceCurrency ?? 'EUR',
      popular: meta[i]?.popular ?? false,
    }));
  }, [content.pricing, service.pricingMeta, service.priceFrom, service.priceCurrency]);

  const caseStudySlides = useMemo(() => {
    const metaList =
      service.caseStudies ??
      (service.caseStudyMeta ? [service.caseStudyMeta] : []);
    const copyList =
      content.caseStudies ??
      (content.caseStudy ? [content.caseStudy] : []);
    if (!metaList.length || !copyList.length) return [];
    const len = Math.min(metaList.length, copyList.length);
    return Array.from({ length: len }, (_, i) => ({
      meta: metaList[i]!,
      copy: copyList[i]!,
    }));
  }, [
    service.caseStudies,
    service.caseStudyMeta,
    content.caseStudies,
    content.caseStudy,
  ]);

  const [caseStudyIdx, setCaseStudyIdx] = useState(0);
  const [caseStudyEnterDir, setCaseStudyEnterDir] = useState<'next' | 'prev'>(
    'next',
  );

  useEffect(() => {
    setCaseStudyIdx(0);
    setCaseStudyEnterDir('next');
  }, [service.slug]);

  useEffect(() => {
    setCaseStudyIdx((i) =>
      caseStudySlides.length === 0
        ? 0
        : Math.min(i, caseStudySlides.length - 1),
    );
  }, [caseStudySlides.length]);

  const activeCaseStudy = caseStudySlides[caseStudyIdx];
  const caseStudyCount = caseStudySlides.length;
  const showCaseStudyNav = caseStudyCount > 1;

  const goCaseStudy = useCallback(
    (to: number) => {
      if (caseStudyCount <= 0 || to === caseStudyIdx) return;
      setCaseStudyEnterDir(
        caseStudyEnterDirection(caseStudyIdx, to, caseStudyCount),
      );
      setCaseStudyIdx(to);
    },
    [caseStudyCount, caseStudyIdx],
  );

  const stepCaseStudy = useCallback(
    (delta: -1 | 1) => {
      if (caseStudyCount <= 0) return;
      const from = caseStudyIdx;
      const to = (from + delta + caseStudyCount) % caseStudyCount;
      setCaseStudyEnterDir(caseStudyEnterDirection(from, to, caseStudyCount));
      setCaseStudyIdx(to);
    },
    [caseStudyCount, caseStudyIdx],
  );

  const caseStudyMediaAnim = showCaseStudyNav
    ? caseStudyEnterDir === 'next'
      ? 'animate-case-media-next'
      : 'animate-case-media-prev'
    : '';
  const caseStudyCopyAnim = showCaseStudyNav
    ? caseStudyEnterDir === 'next'
      ? 'animate-case-copy-next'
      : 'animate-case-copy-prev'
    : '';

  const displayTestimonial = useMemo(() => {
    if (!content) return null;
    const list = content.testimonials;
    if (caseStudyCount > 0 && list?.length) {
      const row = list[caseStudyIdx];
      if (row) return row;
    }
    return content.testimonial ?? null;
  }, [content, caseStudyIdx, caseStudyCount]);

  const serviceSchema = buildDetailedServiceSchema({
    name: service.serviceType,
    description: content.metaDescription,
    slug: service.slug,
    serviceType: service.serviceType,
    priceFrom: service.priceFrom,
    priceCurrency: service.priceCurrency,
  });

  const breadcrumb = buildBreadcrumbList([
    { name: t('detail.breadcrumbHome'), path: '/' },
    { name: t('detail.breadcrumbServices'), path: '/services' },
    { name: service.serviceType, path: `/services/${service.slug}` },
  ]);

  const faqSchema = buildFAQPageSchema(content.faq);
  const localBusinessSchema = buildLocalBusinessSchema();

  return (
    <>
      <SEO
        title={content.metaTitle}
        description={content.metaDescription}
        keywords={content.keywords}
        url={`/services/${service.slug}`}
        type="website"
        jsonLd={[breadcrumb, serviceSchema, faqSchema, localBusinessSchema]}
      />

      <article className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 min-h-screen">
        {/* ─────────────────────────── HERO */}
        <section className="relative py-10 sm:py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 animate-grid" />
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
            {/* Hero animates on mount (above the fold) — don't wait for scroll */}
            <Reveal as="nav" variant="fade-in" className="mb-6 sm:mb-8">
              <ol
                aria-label="Breadcrumb"
                className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 flex-wrap"
              >
                <li>
                  <LangLink to="/" className="hover:text-white transition-colors">
                    {t('detail.breadcrumbHome')}
                  </LangLink>
                </li>
                <li aria-hidden>
                  <Icon name="chevron-right" width={12} />
                </li>
                <li>
                  <LangLink to="/services" className="hover:text-white transition-colors">
                    {t('detail.breadcrumbServices')}
                  </LangLink>
                </li>
                <li aria-hidden>
                  <Icon name="chevron-right" width={12} />
                </li>
                <li className="text-slate-300 truncate max-w-[60vw]" aria-current="page">
                  {service.serviceType}
                </li>
              </ol>
            </Reveal>

            <Reveal variant="fade-up" delay={80} className="flex items-start gap-4 mb-6">
              <div
                className={`shrink-0 h-14 w-14 sm:h-16 sm:w-16 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center ${colors.accent} ${colors.glow}`}
              >
                <Icon name={service.icon} width={28} />
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium uppercase tracking-wider ${colors.bg} ${colors.accent} border ${colors.border} mb-3`}
                >
                  {t('detail.ourServicesBadge')}
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tighter [text-wrap:balance] leading-[1.1]">
                  {content.h1.split(' ').map((word, i, arr) => {
                    const isHighlight = i >= arr.length - 2;
                    return (
                      <span
                        key={i}
                        className={
                          isHighlight
                            ? `text-transparent bg-clip-text bg-gradient-to-r ${colors.gradient}`
                            : ''
                        }
                      >
                        {word}
                        {i < arr.length - 1 ? ' ' : ''}
                      </span>
                    );
                  })}
                </h1>
              </div>
            </Reveal>

            <Reveal variant="fade-up" delay={200}>
              <p className="text-lg sm:text-xl text-slate-300 font-light max-w-3xl mb-8 [text-wrap:balance]">
                {content.tagline}
              </p>
            </Reveal>

            <Reveal variant="fade-up" delay={320} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <LangLink
                to="/contact#contact-info"
                onClick={() => trackServiceCTA(service.slug, service.serviceType)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-950 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.4)] group"
              >
                {t('detail.ctaRequestFreeQuote')}
                <Icon
                  name="arrow-right"
                  width={16}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </LangLink>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/10 text-white rounded-lg font-medium text-sm hover:border-indigo-400/60 hover:bg-white/5 transition-all"
              >
                {t('detail.ctaViewPricing')}
              </a>
            </Reveal>
          </div>
        </section>

        {/* ─────────────────────────── INTRO */}
        <section className="py-10 sm:py-14 relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="space-y-5 text-base sm:text-lg text-slate-300 font-light leading-relaxed">
              {content.intro.map((para, i) => (
                <Reveal key={i} variant="fade-up" delay={i * 80} as="p" className="[text-wrap:pretty]">
                  {para}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────── WHAT WE DO / FOR WHOM / OUTCOMES */}
        <section className="py-10 sm:py-14 relative z-10 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Reveal variant="fade-up" as="h2" className="text-2xl sm:text-3xl md:text-4xl font-medium text-white tracking-tighter mb-10 [text-wrap:balance]">
              {t('detail.sectionWhatWeOffer')}
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <Reveal variant="fade-up" delay={0} className="p-5 sm:p-6 rounded-2xl glass border border-white/5">
                <div
                  className={`h-10 w-10 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center ${colors.accent} mb-4`}
                >
                  <Icon name="check" width={18} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-4">{t('detail.cardDeliver')}</h3>
                <ul className="space-y-2.5 text-sm text-slate-400 font-light">
                  {content.whatWeDo.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${colors.bg} ${colors.accent}`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal variant="fade-up" delay={120} className="p-5 sm:p-6 rounded-2xl glass border border-white/5">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                  <Icon name="users" width={18} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-4">{t('detail.cardForWhom')}</h3>
                <ul className="space-y-2.5 text-sm text-slate-400 font-light">
                  {content.forWhom.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500/40" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal variant="fade-up" delay={240} className="p-5 sm:p-6 rounded-2xl glass border border-white/5">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                  <Icon name="trending-up" width={18} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-4">{t('detail.cardOutcomes')}</h3>
                <ul className="space-y-2.5 text-sm text-slate-400 font-light">
                  {content.outcomes.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500/40" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {service.techStack && service.techStack.length > 0 && (
              <Reveal variant="fade-up" delay={100} className="mt-8 sm:mt-10 p-5 sm:p-6 rounded-2xl glass border border-white/5">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">
                  {t('detail.techStack')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {service.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </section>

        {/* ─────────────────────────── PROCESS */}
        <section
          className={`py-10 sm:py-14 relative z-10 border-t border-white/5 ${
            service.slug === 'blockchain' ? 'overflow-hidden' : ''
          }`}
        >
          {service.slug === 'blockchain' && <BlockchainProcessVideoBg />}
          <div
            className={`max-w-5xl mx-auto px-4 sm:px-6 ${
              service.slug === 'blockchain' ? 'relative z-10' : ''
            }`}
          >
            <Reveal variant="fade-up" as="h2" className="text-2xl sm:text-3xl md:text-4xl font-medium text-white tracking-tighter mb-10 [text-wrap:balance]">
              {t('detail.howWeWork')}
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {content.process.map((step, i) => (
                <Reveal
                  key={step.title}
                  variant="fade-up"
                  delay={i * 90}
                  className="p-5 sm:p-6 rounded-2xl glass border border-white/5 hover:border-white/10 transition-all"
                >
                  <h3 className={`text-lg font-semibold mb-2 ${colors.accent}`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-400 font-light leading-relaxed">
                    {step.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────── CASE STUDY / CAROUSEL (optional) */}
        {activeCaseStudy && (
          <section
            className="py-12 sm:py-16 relative z-10 border-t border-white/5"
            role="region"
            aria-roledescription={showCaseStudyNav ? 'carousel' : undefined}
            aria-label={t('detail.caseStudyTitle')}
          >
            <div className="max-w-6xl xl:max-w-[72rem] mx-auto px-4 sm:px-6">
              <Reveal variant="fade-up" className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 sm:gap-6 mb-10 lg:mb-12">
                <div className="min-w-0">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white tracking-tighter [text-wrap:balance]">
                    {t('detail.caseStudyTitle')}
                  </h2>
                  {showCaseStudyNav && (
                    <p className="mt-2.5 text-xs sm:text-sm text-slate-500 font-light tabular-nums tracking-wide">
                      {caseStudyIdx + 1} / {caseStudyCount}
                    </p>
                  )}
                </div>
                <LangLink
                  to="/portfolio"
                  className="group shrink-0 self-start sm:self-auto inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white rounded-lg px-3.5 py-2.5 -mx-1 border border-white/5 hover:border-white/15 hover:bg-white/[0.04] transition-all"
                >
                  {t('detail.viewFullPortfolio')}
                  <Icon
                    name="arrow-right"
                    width={14}
                    className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform"
                  />
                </LangLink>
              </Reveal>

              {showCaseStudyNav && (
                <p className="sr-only" aria-live="polite">
                  {t('detail.caseStudySlideStatus', {
                    current: caseStudyIdx + 1,
                    total: caseStudyCount,
                  })}
                </p>
              )}

              <div
                className={`rounded-[1.75rem] border border-white/[0.08] bg-[#080910] bg-gradient-to-b from-white/[0.045] via-transparent to-slate-950/80 backdrop-blur-md shadow-[0_28px_90px_-28px_rgba(0,0,0,0.75)] overflow-hidden p-5 sm:p-6 md:p-8 lg:p-9 ${
                  showCaseStudyNav ? 'pb-4 sm:pb-5' : 'pb-5 sm:pb-6'
                }`}
              >
                {/* Inner box: arrows align to grid+dots only — avoids “floating” in empty card space */}
                <div className="relative">
                  {showCaseStudyNav && (
                    <div className="pointer-events-none absolute inset-x-0 top-[46%] z-20 hidden -translate-y-1/2 lg:flex lg:items-center lg:justify-between lg:px-0.5 xl:px-0">
                      <button
                        type="button"
                        onClick={() => stepCaseStudy(-1)}
                        className={`pointer-events-auto h-11 w-11 shrink-0 xl:h-12 xl:w-12 inline-flex items-center justify-center rounded-full border border-white/12 bg-[#0a0b14]/95 text-white shadow-xl shadow-black/50 backdrop-blur-sm hover:border-white/25 hover:bg-slate-900/95 hover:scale-105 active:scale-95 transition-all ${colors.accent}`}
                        aria-label={t('detail.caseStudyPrev')}
                      >
                        <Icon name="arrow-left" width={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => stepCaseStudy(1)}
                        className={`pointer-events-auto h-11 w-11 shrink-0 xl:h-12 xl:w-12 inline-flex items-center justify-center rounded-full border border-white/12 bg-[#0a0b14]/95 text-white shadow-xl shadow-black/50 backdrop-blur-sm hover:border-white/25 hover:bg-slate-900/95 hover:scale-105 active:scale-95 transition-all ${colors.accent}`}
                        aria-label={t('detail.caseStudyNext')}
                      >
                        <Icon name="arrow-right" width={18} />
                      </button>
                    </div>
                  )}

                  <div
                    key={caseStudyIdx}
                    className={`mx-auto max-w-[1180px] grid grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.08fr)] gap-8 lg:gap-10 xl:gap-12 lg:items-start min-h-[640px] sm:min-h-[680px] lg:min-h-[520px] ${
                      showCaseStudyNav ? 'animate-case-shell lg:px-12 xl:px-14' : ''
                    }`}
                  >
                    <div
                      className={`relative mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none lg:self-center overflow-hidden rounded-2xl aspect-[16/10] ring-1 ring-white/[0.12] shadow-[0_24px_56px_-20px_rgba(0,0,0,0.85)] [&_picture]:block [&_picture]:h-full [&_img]:h-full [&_img]:w-full ${caseStudyMediaAnim}`}
                    >
                      <div
                        className={`pointer-events-none absolute inset-0 bg-gradient-to-tr ${colors.bg} opacity-[0.1] z-[1]`}
                        aria-hidden
                      />
                      <ResponsiveImage
                        src={activeCaseStudy.meta.image}
                        alt={activeCaseStudy.copy.name}
                        className="relative z-0 size-full object-cover object-center"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <div className={`flex min-h-0 flex-col justify-start lg:py-0.5 ${caseStudyCopyAnim}`}>
                      <h3 className="text-2xl sm:text-[1.65rem] md:text-3xl font-semibold text-white mb-3 sm:mb-4 tracking-tight leading-[1.2] [text-wrap:balance]">
                        {activeCaseStudy.copy.name}
                      </h3>
                      <p className="text-slate-400 text-base sm:text-[1.0625rem] font-light mb-5 sm:mb-6 leading-relaxed [text-wrap:pretty] max-w-xl lg:max-w-none min-h-[3.75rem] sm:min-h-[4.75rem]">
                        {activeCaseStudy.copy.summary}
                      </p>
                      <ul
                        className={`mb-5 sm:mb-6 space-y-3 sm:space-y-3.5 rounded-2xl border border-white/[0.07] bg-slate-900/45 px-5 py-5 sm:px-6 sm:py-5 origin-top shadow-inner shadow-black/20 ${
                          showCaseStudyNav ? 'animate-case-panel-expand' : ''
                        } min-h-[11.5rem]`}
                      >
                        {activeCaseStudy.copy.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-3.5 text-sm sm:text-[0.9375rem] text-slate-200/95 font-light leading-relaxed">
                            <Icon
                              name="check"
                              width={17}
                              className={`mt-0.5 ${colors.accent} shrink-0 opacity-95`}
                            />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                      <a
                        href={activeCaseStudy.meta.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/cta inline-flex w-fit items-center gap-2.5 rounded-lg border border-white/20 bg-white/[0.05] px-4 py-3 sm:px-5 sm:py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/[0.1]"
                      >
                        {t('detail.viewLiveProject')}
                        <Icon
                          name="external-link"
                          width={15}
                          className={`opacity-80 transition-opacity group-hover/cta:opacity-100 ${colors.accent}`}
                        />
                      </a>
                    </div>
                  </div>

                  {showCaseStudyNav && (
                    <div className="mx-auto mt-5 max-w-[1180px] border-t border-white/[0.06] pt-4 sm:pt-5 flex flex-col sm:flex-row items-center justify-center gap-4 lg:px-12 xl:px-14">
                      <div className="flex items-center gap-2.5">
                        {caseStudySlides.map((slide, i) => (
                          <button
                            key={slide.copy.name}
                            type="button"
                            aria-label={t('detail.caseStudyGoToSlide', {
                              current: i + 1,
                              total: caseStudyCount,
                            })}
                            aria-current={i === caseStudyIdx ? 'true' : undefined}
                            onClick={() => goCaseStudy(i)}
                            className={`rounded-full transition-[width,height,transform,box-shadow,background-color] duration-500 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:ring-white/40 ${
                              i === caseStudyIdx
                                ? `h-2.5 w-9 ${colors.bg} ${colors.accent} shadow-[0_0_16px_-2px_currentColor] ring-1 ring-white/20`
                                : 'h-2 w-2 bg-white/25 hover:bg-white/45 hover:scale-110'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2 lg:hidden">
                        <button
                          type="button"
                          onClick={() => stepCaseStudy(-1)}
                          className="inline-flex h-11 px-4 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.05] text-sm text-slate-200 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-colors"
                        >
                          <Icon name="arrow-left" width={16} />
                          {t('detail.caseStudyPrev')}
                        </button>
                        <button
                          type="button"
                          onClick={() => stepCaseStudy(1)}
                          className="inline-flex h-11 px-4 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.05] text-sm text-slate-200 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-colors"
                        >
                          {t('detail.caseStudyNext')}
                          <Icon name="arrow-right" width={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─────────────────────────── TESTIMONIAL (optional) */}
        {displayTestimonial && (
          <section className="py-10 sm:py-14 relative z-10 border-t border-white/5">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
              <Reveal variant="fade-scale" key={caseStudyIdx}>
                <Icon
                  name="quote"
                  width={32}
                  className={`mx-auto mb-6 ${colors.accent} opacity-50`}
                />
                <blockquote className="text-lg sm:text-xl md:text-2xl text-white font-light leading-relaxed [text-wrap:balance] mb-6">
                  “{displayTestimonial.quote}”
                </blockquote>
                <footer className="text-sm text-slate-400">
                  <span className="font-medium text-white">{displayTestimonial.author}</span>
                  {displayTestimonial.role && (
                    <>
                      <span className="mx-2 text-slate-600">•</span>
                      <span>{displayTestimonial.role}</span>
                    </>
                  )}
                </footer>
              </Reveal>
            </div>
          </section>
        )}

        {/* ─────────────────────────── PRICING */}
        {pricingTiers.length > 0 && (
          <section
            id="pricing"
            className="py-10 sm:py-14 relative z-10 border-t border-white/5 scroll-mt-24"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <Reveal variant="fade-up" className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white tracking-tighter mb-3 [text-wrap:balance]">
                  {t('detail.pricingTitle')}
                </h2>
                <p className="text-sm sm:text-base text-slate-400 font-light max-w-2xl mx-auto">
                  {t('detail.pricingSubtitle')}
                </p>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {pricingTiers.map((tier, tierIdx) => (
                  <Reveal
                    key={tier.name}
                    variant="fade-up"
                    delay={tierIdx * 120}
                    className={`relative p-5 sm:p-6 md:p-8 rounded-2xl glass border transition-all flex h-full flex-col ${
                      tier.popular
                        ? `${colors.border} ${colors.glow} border-2`
                        : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    {tier.popular && (
                      <span
                        className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${colors.bg} ${colors.accent} border ${colors.border} bg-slate-950`}
                      >
                        {t('detail.mostPopular')}
                      </span>
                    )}
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                      {tier.name}
                    </h3>
                    <p className="text-sm text-slate-400 font-light mb-4">{tier.description}</p>
                    <div className="mb-6 flex items-baseline gap-1">
                      <span className="text-sm text-slate-500">{t('detail.fromPrefix')}</span>
                      <span className="text-3xl sm:text-4xl font-semibold text-white ml-1">
                        {tier.priceFrom.toLocaleString(numberLocale)}
                      </span>
                      <span className="text-sm text-slate-400 ml-1">{tier.priceCurrency}</span>
                    </div>
                    <ul className="space-y-2.5 mb-6 flex-1">
                      {tier.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-sm text-slate-300 font-light"
                        >
                          <Icon
                            name="check"
                            width={14}
                            className={`mt-1 ${colors.accent} shrink-0`}
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <LangLink
                      to="/contact#contact-info"
                      onClick={() =>
                        trackServiceCTA(`${service.slug}-${tier.name}`, service.serviceType)
                      }
                      className={`mt-auto block w-full text-center px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        tier.popular
                          ? 'bg-white text-slate-950 hover:bg-slate-200'
                          : 'border border-white/10 text-white hover:border-indigo-400/60 hover:bg-white/5'
                      }`}
                    >
                      {t('detail.requestCustom')}
                    </LangLink>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─────────────────────────── FAQ */}
        <section className="py-10 sm:py-14 relative z-10 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <Reveal variant="fade-up" as="h2" className="text-2xl sm:text-3xl md:text-4xl font-medium text-white tracking-tighter mb-10 [text-wrap:balance]">
              {t('detail.faqTitle')}
            </Reveal>

            <div className="space-y-3">
              {content.faq.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <Reveal
                    key={item.question}
                    variant="fade-up"
                    delay={idx * 60}
                    className={`rounded-xl glass border transition-colors duration-300 ${
                      isOpen
                        ? `${colors.border} border-white/10`
                        : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                      className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${service.slug}-${idx}`}
                    >
                      <span className="text-sm sm:text-base font-medium text-white [text-wrap:balance]">
                        {item.question}
                      </span>
                      {/* Custom +/– icon so the lines animate into each other instead of swapping */}
                      <span
                        aria-hidden
                        className={`relative shrink-0 h-4 w-4 ${colors.accent}`}
                      >
                        <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-current rounded-full" />
                        <span
                          className={`absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-current rounded-full transition-transform duration-300 ease-out ${
                            isOpen ? 'scale-y-0' : 'scale-y-100'
                          }`}
                        />
                      </span>
                    </button>

                    {/*
                      Smooth accordion expand using the CSS grid-template-rows
                      trick: 0fr → 1fr animates height naturally without a fixed
                      max-height guess. Child must have overflow:hidden.
                    */}
                    <div
                      id={`faq-panel-${service.slug}-${idx}`}
                      role="region"
                      className="grid transition-all duration-300 ease-out"
                      style={{
                        gridTemplateRows: isOpen ? '1fr' : '0fr',
                        opacity: isOpen ? 1 : 0,
                      }}
                    >
                      <div className="overflow-hidden">
                        <div className="px-4 sm:px-5 pb-4 sm:pb-5 -mt-1">
                          <p className="text-sm sm:text-base text-slate-400 font-light leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─────────────────────────── RELATED SERVICES (internal linking) */}
        {relatedServices.length > 0 && (
          <section className="py-10 sm:py-14 relative z-10 border-t border-white/5">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <Reveal variant="fade-up" as="h2" className="text-2xl sm:text-3xl font-medium text-white tracking-tighter mb-8 [text-wrap:balance]">
                {t('detail.relatedServices')}
              </Reveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {relatedServices.map((r, i) => {
                  const rColors = colorClasses[r.color];
                  const rTagline = t(`content.${r.slug}.tagline`, { defaultValue: '' });
                  return (
                    <Reveal key={r.slug} variant="fade-up" delay={i * 110}>
                      <Link
                        to={`/services/${r.slug}`}
                        className="group block p-5 sm:p-6 rounded-2xl glass border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all"
                      >
                        <div
                          className={`h-10 w-10 rounded-lg ${rColors.bg} border ${rColors.border} flex items-center justify-center ${rColors.accent} mb-4 group-hover:scale-110 transition-transform`}
                        >
                          <Icon name={r.icon} width={18} />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                          {r.serviceType}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-400 font-light line-clamp-2">
                          {rTagline}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1 text-xs text-slate-500 group-hover:text-white transition-colors">
                          {t('detail.learnMore')}
                          <Icon
                            name="arrow-right"
                            width={12}
                            className="group-hover:translate-x-0.5 transition-transform"
                          />
                        </span>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ─────────────────────────── FINAL CTA */}
        <section className="py-12 sm:py-16 md:py-20 relative z-10 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <Reveal variant="fade-scale">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-medium text-white tracking-tighter mb-4 sm:mb-6 [text-wrap:balance]">
                {t('detail.readyToStart')}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-slate-400 mb-6 sm:mb-8 font-light max-w-2xl mx-auto">
                {t('detail.readyToStartSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <LangLink
                  to="/contact#contact-info"
                  onClick={() => trackServiceCTA(service.slug, service.serviceType)}
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-slate-950 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.4)] group"
                >
                  {t('detail.ctaRequestFreeQuote')}
                  <Icon
                    name="arrow-right"
                    width={16}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </LangLink>
                <LangLink
                  to="/portfolio"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 border border-white/10 text-white rounded-lg font-medium text-sm hover:border-indigo-400/60 hover:bg-white/5 transition-all"
                >
                  {t('detail.ctaViewPortfolio')}
                </LangLink>
              </div>
            </Reveal>
          </div>
        </section>
      </article>
    </>
  );
}
