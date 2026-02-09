import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

const colorClasses = {
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400' },
  pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/20', text: 'text-pink-400' }
};

export default function ServicesPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const [activeServiceIndex, setActiveServiceIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const services = [
    {
      icon: 'lucide:shield',
      title: t('servicesPage.items.cyber.title'),
      short: t('servicesPage.items.cyber.short'),
      description: t('servicesPage.items.cyber.description'),
      services: t('servicesPage.items.cyber.services', { returnObjects: true }) as string[],
      industries: t('servicesPage.items.cyber.industries', { returnObjects: true }) as string[],
      outcomes: t('servicesPage.items.cyber.outcomes', { returnObjects: true }) as string[],
      color: 'indigo'
    },
    {
      icon: 'lucide:cloud',
      title: t('servicesPage.items.cloud.title'),
      short: t('servicesPage.items.cloud.short'),
      description: t('servicesPage.items.cloud.description'),
      services: t('servicesPage.items.cloud.services', { returnObjects: true }) as string[],
      industries: t('servicesPage.items.cloud.industries', { returnObjects: true }) as string[],
      outcomes: t('servicesPage.items.cloud.outcomes', { returnObjects: true }) as string[],
      color: 'purple'
    },
    {
      icon: 'lucide:code-2',
      title: t('servicesPage.items.software.title'),
      short: t('servicesPage.items.software.short'),
      description: t('servicesPage.items.software.description'),
      services: t('servicesPage.items.software.services', { returnObjects: true }) as string[],
      industries: t('servicesPage.items.software.industries', { returnObjects: true }) as string[],
      outcomes: t('servicesPage.items.software.outcomes', { returnObjects: true }) as string[],
      color: 'emerald'
    },
    {
      icon: 'lucide:database',
      title: t('servicesPage.items.data.title'),
      short: t('servicesPage.items.data.short'),
      description: t('servicesPage.items.data.description'),
      services: t('servicesPage.items.data.services', { returnObjects: true }) as string[],
      industries: t('servicesPage.items.data.industries', { returnObjects: true }) as string[],
      outcomes: t('servicesPage.items.data.outcomes', { returnObjects: true }) as string[],
      color: 'blue'
    },
    {
      icon: 'lucide:workflow',
      title: t('servicesPage.items.automation.title'),
      short: t('servicesPage.items.automation.short'),
      description: t('servicesPage.items.automation.description'),
      services: t('servicesPage.items.automation.services', { returnObjects: true }) as string[],
      industries: t('servicesPage.items.automation.industries', { returnObjects: true }) as string[],
      outcomes: t('servicesPage.items.automation.outcomes', { returnObjects: true }) as string[],
      color: 'purple'
    },
    {
      icon: 'lucide:blocks',
      title: t('servicesPage.items.blockchain.title'),
      short: t('servicesPage.items.blockchain.short'),
      description: t('servicesPage.items.blockchain.description'),
      services: t('servicesPage.items.blockchain.services', { returnObjects: true }) as string[],
      industries: t('servicesPage.items.blockchain.industries', { returnObjects: true }) as string[],
      outcomes: t('servicesPage.items.blockchain.outcomes', { returnObjects: true }) as string[],
      color: 'indigo'
    }
  ];
  const activeService = activeServiceIndex !== null ? services[activeServiceIndex] : null;

  useEffect(() => {
    if (activeService && modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeService]);

  useEffect(() => {
    if (location.hash === '#service-details' && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  return (
    <div className="pt-32 pb-20 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 animate-grid"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="animate-in">
            <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tighter mb-6">
              {t('servicesPage.heroTitlePrefix')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">{t('servicesPage.heroTitleHighlight')}</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">{t('servicesPage.heroSubtitle')}</p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div
            ref={detailsRef}
            id="service-details"
            style={{ scrollMarginTop: '180px' }}
          ></div>
          {activeService ? (
            <div className="relative">
              <div
                className="absolute inset-0 -m-4 bg-slate-950/70 backdrop-blur-sm rounded-3xl service-overlay-enter"
                onClick={() => setActiveServiceIndex(null)}
                aria-hidden="true"
              ></div>
              <div
                ref={modalRef}
                className="relative z-10 max-w-3xl mx-auto p-8 md:p-10 rounded-2xl glass border border-white/10 shadow-2xl service-modal-enter"
              >
                <button
                  type="button"
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                  onClick={() => setActiveServiceIndex(null)}
                  aria-label="Close service details"
                >
                  <span className="iconify" data-icon="lucide:x" data-width="20"></span>
                </button>
                <div className="flex items-start gap-4 mb-6">
                    <div className={`h-12 w-12 rounded-lg ${colorClasses[activeService.color as keyof typeof colorClasses].bg} border ${colorClasses[activeService.color as keyof typeof colorClasses].border} flex items-center justify-center ${colorClasses[activeService.color as keyof typeof colorClasses].text} shadow-lg`}>
                    <Icon icon={activeService.icon} width={24} />
                  </div>
                  <div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-white mb-2">{activeService.title}</h3>
                  <p className="text-slate-400 text-sm md:text-base font-light leading-relaxed">{activeService.description}</p>
                  </div>
                </div>
              <div className="grid grid-cols-1 gap-6 text-sm text-slate-400 font-light">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                  <h4 className="text-white font-medium mb-3">{t('servicesPage.sections.services')}</h4>
                  <ul className="space-y-2">
                    {activeService.services.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                    <h4 className="text-white font-medium mb-3">{t('servicesPage.sections.industries')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeService.industries.map((industry) => (
                        <span key={industry} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs">
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                    <h4 className="text-white font-medium mb-3">{t('servicesPage.sections.outcomes')}</h4>
                    <ul className="space-y-2">
                      {activeService.outcomes.map((outcome) => (
                        <li key={outcome} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    className="inline-flex px-6 py-3 border border-white/10 text-white rounded-lg font-medium text-sm hover:border-indigo-400/60 hover:bg-white/5 transition-all"
                    onClick={() => setActiveServiceIndex(null)}
                  >
                  {t('servicesPage.back')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 service-grid-enter">
              {services.map((service, index) => {
                const colors = colorClasses[service.color as keyof typeof colorClasses];
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveServiceIndex(index)}
                    className="text-left group card-glow service-card p-8 rounded-2xl glass border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all duration-500 backdrop-blur-md relative overflow-hidden animate-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className={`h-12 w-12 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center ${colors.text} mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10 shadow-lg`}>
                      <Icon icon={service.icon} width={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 relative z-10 group-hover:text-indigo-300 transition-colors">{service.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed relative z-10 font-light group-hover:text-slate-300 transition-colors">{service.short}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tighter mb-6">{t('servicesPage.ctaTitle')}</h2>
          <p className="text-lg text-slate-400 mb-8 font-light">{t('servicesPage.ctaSubtitle')}</p>
          <Link
            to="/contact#contact-info"
            className="inline-flex px-8 py-3.5 bg-white text-slate-950 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.4)] items-center gap-2 group"
          >
            {t('servicesPage.ctaButton')}
            <span className="iconify group-hover:translate-x-0.5 transition-transform" data-icon="lucide:arrow-right" data-width="16"></span>
          </Link>
        </div>
      </section>
    </div>
  );
}
