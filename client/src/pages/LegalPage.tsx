import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Icon } from '../components/Icons';
import SEO from '../components/SEO';
import { LangLink } from '../i18n/routing';

type LegalType = 'privacy' | 'terms' | 'cookies';

const PATH_TO_TYPE: Record<string, LegalType> = {
  '/privacy': 'privacy',
  '/terms': 'terms',
  '/cookies': 'cookies',
};

const SEO_META: Record<LegalType, { title: string; description: string }> = {
  privacy: {
    title: 'Politică de Confidențialitate',
    description: 'Politica de confidențialitate SoftIonyx: cum colectăm, folosim și protejăm datele tale personale în conformitate cu GDPR.',
  },
  terms: {
    title: 'Termeni și Condiții',
    description: 'Termenii și condițiile de utilizare a site-ului și serviciilor SoftIonyx Technologies.',
  },
  cookies: {
    title: 'Politica de Cookies',
    description: 'Cum folosește SoftIonyx cookies și tehnologii similare pentru a îmbunătăți experiența ta pe site.',
  },
};

export default function LegalPage() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const pathnameNoLang = pathname.replace(/^\/(ro|en|ru)(\/|$)/, '/');
  const legalType = PATH_TO_TYPE[pathnameNoLang] ?? 'privacy';
  const key = `legal.${legalType}`;

  const title = t(`${key}.title`);
  const lastUpdated = t(`${key}.lastUpdated`);
  const sections = t(`${key}.sections`, { returnObjects: true }) as Array<{ title: string; content: string }>;
  const seoMeta = SEO_META[legalType];

  return (
    <>
      <SEO
        title={seoMeta.title}
        description={seoMeta.description}
        url={pathnameNoLang}
      />
    <div className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 min-h-screen">
      <section className="relative py-8 sm:py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 animate-grid" />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          <LangLink
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400 text-sm mb-5 sm:mb-8 transition-colors"
          >
            <Icon name="arrow-left" width={18} />
            {t('legal.back')}
          </LangLink>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white tracking-tight mb-3 sm:mb-4 [text-wrap:balance] leading-[1.2]">
            {title}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">{lastUpdated}</p>
        </div>
      </section>

      <section className="py-8 sm:py-10 md:py-12 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="prose prose-invert prose-slate max-w-none">
            {Array.isArray(sections) && sections.map((section, idx) => (
              <div key={idx} className="mb-8 sm:mb-10">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{section.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line break-words">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
