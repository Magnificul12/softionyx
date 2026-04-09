import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import { Icon } from '../components/Icons';

type LegalType = 'privacy' | 'terms' | 'cookies';

const PATH_TO_TYPE: Record<string, LegalType> = {
  '/privacy': 'privacy',
  '/terms': 'terms',
  '/cookies': 'cookies',
};

export default function LegalPage() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const legalType = PATH_TO_TYPE[pathname] ?? 'privacy';
  const key = `legal.${legalType}`;

  const title = t(`${key}.title`);
  const lastUpdated = t(`${key}.lastUpdated`);
  const sections = t(`${key}.sections`, { returnObjects: true }) as Array<{ title: string; content: string }>;

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 animate-grid" />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10" />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400 text-sm mb-8 transition-colors"
          >
            <Icon name="arrow-left" width={18} />
            {t('legal.back')}
          </Link>
          <h1 className="text-4xl md:text-5xl font-medium text-white tracking-tight mb-4">
            {title}
          </h1>
          <p className="text-slate-500 text-sm">{lastUpdated}</p>
        </div>
      </section>

      <section className="py-12 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="prose prose-invert prose-slate max-w-none">
            {Array.isArray(sections) && sections.map((section, idx) => (
              <div key={idx} className="mb-10">
                <h2 className="text-xl font-semibold text-white mb-3">{section.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
