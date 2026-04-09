import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeroSplineBackground from './HeroSplineBackground';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden min-h-[100svh] flex flex-col justify-center">
      <HeroSplineBackground />
      {/* Enhanced Background Blobs (CSS only) */}
      <div className="absolute top-0 w-full h-full left-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[20%] w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] bg-indigo-600/20 sm:bg-indigo-600/25 rounded-full blur-[100px] sm:blur-[120px] animate-blob mix-blend-screen will-change-transform"></div>
        <div className="absolute top-[20%] right-[10%] sm:right-[20%] w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-purple-600/20 sm:bg-purple-600/25 rounded-full blur-[100px] sm:blur-[120px] animate-blob-reverse animation-delay-2000 mix-blend-screen will-change-transform"></div>
      </div>

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] sm:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:28px_28px] sm:bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10 animate-grid"></div>

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-indigo-500/5 via-transparent to-transparent -z-10"></div>

      {/* Bottom fill to avoid black gap on tall screens */}
      <div className="absolute inset-x-0 bottom-0 h-[35vh] bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950/90 -z-10"></div>

      {/* Mobile-only soft gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-indigo-900/20 to-slate-950/60 -z-10 sm:hidden"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <div className="animate-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-medium text-indigo-300 mb-8 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all cursor-default backdrop-blur-md shadow-lg shadow-indigo-500/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            {t('hero.badge')}
          </div>
        </div>

        <h1 className="animate-in delay-100 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-medium text-white tracking-tight mb-6 sm:mb-8 max-w-5xl mx-auto leading-[1.2]">
          {t('hero.titleLine1')} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white via-purple-200 to-indigo-300 animate-text-gradient relative inline-block overflow-hidden">
            {t('hero.titleHighlight')}
            <span className="absolute inset-0 pointer-events-none mix-blend-screen">
              <span className="absolute inset-y-0 left-[-60%] w-[50%] bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.15),rgba(255,255,255,0.55),rgba(255,255,255,0.15),transparent)] blur-sm skew-x-[-12deg] animate-sheen-diag"></span>
            </span>
          </span>
        </h1>

        <p className="animate-in delay-200 text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed font-light">
          {t('hero.subtitle')}
        </p>

        <div className="animate-in delay-300 flex flex-col md:flex-row items-center justify-center gap-4">
          <Link
            to="/request-help"
            className="group relative w-full md:w-auto px-8 py-3.5 bg-white text-slate-950 rounded-lg font-semibold text-sm hover:bg-slate-100 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.6)] flex items-center justify-center gap-2 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
            <span className="relative z-10">{t('hero.ctaPrimary')}</span>
            <span className="iconify group-hover:translate-x-1 transition-transform relative z-10" data-icon="lucide:arrow-right" data-width="16"></span>
          </Link>
          <Link
            to="/services"
            className="group w-full md:w-auto px-8 py-3.5 glass border border-white/20 hover:border-indigo-500/40 hover:bg-white/10 text-white rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-md hover:shadow-lg hover:shadow-indigo-500/20"
          >
            <span className="iconify group-hover:rotate-12 transition-transform" data-icon="lucide:layers" data-width="18"></span>
            {t('hero.ctaSecondary')}
          </Link>
        </div>
      </div>
    </section>
  );
}
