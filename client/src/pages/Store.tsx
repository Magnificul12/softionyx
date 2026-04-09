import { useTranslation } from 'react-i18next';

export default function Store() {
  const { t } = useTranslation();
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 animate-grid"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="animate-in">
            <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tighter mb-6">
              {t('storePage.heroTitlePrefix')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">{t('storePage.heroTitleHighlight')}</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
              {t('storePage.heroSubtitle')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center backdrop-blur-sm">
            <p className="text-slate-400 text-sm font-light">{t('storePage.notice')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
