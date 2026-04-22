import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Icon } from '../components/Icons';
import SEO from '../components/SEO';
import { LangLink } from '../i18n/routing';

type QuickLink = {
  key: 'home' | 'services' | 'solutions' | 'portfolio' | 'blog' | 'contact' | 'about' | 'careers';
  to: string;
  icon: string;
  accent: string;
};

const QUICK_LINKS: QuickLink[] = [
  { key: 'home',      to: '/',          icon: 'hexagon',   accent: 'from-indigo-500/20 to-indigo-500/5  text-indigo-300  border-indigo-500/20' },
  { key: 'services',  to: '/services',  icon: 'settings',  accent: 'from-purple-500/20 to-purple-500/5  text-purple-300  border-purple-500/20' },
  { key: 'solutions', to: '/solutions', icon: 'layers',    accent: 'from-sky-500/20    to-sky-500/5     text-sky-300     border-sky-500/20' },
  { key: 'portfolio', to: '/portfolio', icon: 'folder',    accent: 'from-emerald-500/20 to-emerald-500/5 text-emerald-300 border-emerald-500/20' },
  { key: 'blog',      to: '/blog',      icon: 'book',      accent: 'from-amber-500/20  to-amber-500/5   text-amber-300   border-amber-500/20' },
  { key: 'contact',   to: '/contact',   icon: 'mail',      accent: 'from-rose-500/20   to-rose-500/5    text-rose-300    border-rose-500/20' },
  { key: 'about',     to: '/about',     icon: 'users',     accent: 'from-cyan-500/20   to-cyan-500/5    text-cyan-300    border-cyan-500/20' },
  { key: 'careers',   to: '/careers',   icon: 'briefcase', accent: 'from-fuchsia-500/20 to-fuchsia-500/5 text-fuchsia-300 border-fuchsia-500/20' },
];

export default function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');

  const requestedPath = useMemo(() => {
    const path = `${location.pathname}${location.search}`;
    return path.length > 60 ? `${path.slice(0, 57)}…` : path;
  }, [location.pathname, location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      navigate('/');
      return;
    }
    navigate(`/blog?q=${encodeURIComponent(q)}`);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <SEO
        title={`${t('notFound.code')} — ${t('notFound.title')}`}
        description={t('notFound.subtitle')}
        noIndex
      />
      <Helmet>
        {/* Hint for prerender services (Prerender.io / react-snap) to emit HTTP 404 */}
        <meta name="prerender-status-code" content="404" />
      </Helmet>

      <main
        role="main"
        aria-labelledby="not-found-title"
        className="relative isolate overflow-hidden min-h-screen flex items-center pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20"
      >
        {/* Ambient backgrounds */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] animate-grid" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />
        <div
          className="pointer-events-none absolute -top-32 -left-32 h-[30rem] w-[30rem] rounded-full bg-indigo-500/15 blur-3xl -z-10 animate-blob"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-40 -right-32 h-[32rem] w-[32rem] rounded-full bg-purple-500/10 blur-3xl -z-10 animate-blob"
          style={{ animationDelay: '-6s' }}
          aria-hidden
        />

        {/* ═════════ LEFT — minimalist waypoint rail ═════════ */}
        <aside
          aria-hidden
          className="pointer-events-none hidden lg:flex absolute left-10 xl:left-20 top-16 bottom-16 flex-col z-10"
        >
          {/* A single vertical line with 5 waypoints, spanning most of the viewport height. */}
          <div className="relative flex flex-col items-center h-full">
            {/* Top tick */}
            <span className="block h-3 w-px bg-white/40" />
            {/* Long dashed line (full viewport height) */}
            <span className="block flex-1 w-px bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.18)_8%,rgba(255,255,255,0.18)_92%,transparent)]" />
            {/* Bottom tick */}
            <span className="block h-3 w-px bg-white/40" />

            {/* Waypoints positioned along the line */}
            {[
              { top: '10%', label: '01',  sub: 'start',    active: false },
              { top: '30%', label: '02',  sub: 'search',   active: false },
              { top: '50%', label: '404', sub: 'lost',     active: true  },
              { top: '70%', label: '03',  sub: 'recover',  active: false },
              { top: '90%', label: '∞',   sub: 'home',     active: false },
            ].map((wp) => (
              <div
                key={wp.label}
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-5"
                style={{ top: wp.top }}
              >
                {/* Label sits to the LEFT of the line */}
                <div className="flex flex-col items-end leading-none text-right w-20">
                  <span
                    className={`text-sm font-mono tracking-[0.2em] ${
                      wp.active ? 'text-indigo-300' : 'text-slate-500'
                    }`}
                  >
                    {wp.label}
                  </span>
                  <span
                    className={`mt-1.5 text-[10px] font-mono uppercase tracking-[0.35em] ${
                      wp.active ? 'text-indigo-400/80' : 'text-slate-600'
                    }`}
                  >
                    {wp.sub}
                  </span>
                </div>

                {/* Waypoint dot sits centered on the line */}
                <span
                  className={`relative rounded-full ${
                    wp.active
                      ? 'h-3.5 w-3.5 bg-indigo-400 shadow-[0_0_18px_rgba(129,140,248,0.9)]'
                      : 'h-2.5 w-2.5 bg-slate-900 border border-white/25'
                  }`}
                >
                  {wp.active && (
                    <>
                      <span className="absolute inset-0 rounded-full bg-indigo-400/50 animate-ping" />
                      <span className="absolute -inset-2.5 rounded-full border border-indigo-400/30" />
                      <span className="absolute -inset-5 rounded-full border border-indigo-400/15" />
                    </>
                  )}
                </span>

                {/* Spacer to preserve rhythm on the right */}
                <span className="w-20" aria-hidden />
              </div>
            ))}
          </div>
        </aside>

        {/* ═════════ RIGHT — minimalist radar pulse ═════════ */}
        <aside
          aria-hidden
          className="pointer-events-none hidden lg:flex absolute right-8 xl:right-14 top-1/2 -translate-y-1/2 items-center justify-center z-10"
        >
          {/* A single circular radar with a slow sweeping scan line. */}
          <div className="relative h-48 w-48 xl:h-56 xl:w-56">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border border-white/10" />
            {/* Middle ring (dashed) */}
            <div
              className="absolute inset-[14%] rounded-full border border-white/10"
              style={{ borderStyle: 'dashed' }}
            />
            {/* Inner ring */}
            <div className="absolute inset-[30%] rounded-full border border-white/10" />

            {/* Crosshair */}
            <span className="absolute top-1/2 left-0 right-0 h-px bg-white/5" />
            <span className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5" />

            {/* Rotating scan sweep — conic gradient */}
            <div
              className="absolute inset-0 rounded-full animate-spin-slow"
              style={{
                background:
                  'conic-gradient(from 0deg, rgba(129,140,248,0.35) 0deg, rgba(129,140,248,0) 90deg, transparent 360deg)',
                maskImage: 'radial-gradient(circle, black 60%, transparent 62%)',
                WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 62%)',
              }}
            />

            {/* Center dot */}
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-indigo-300 shadow-[0_0_12px_rgba(129,140,248,0.9)]">
              <span className="absolute inset-0 rounded-full bg-indigo-400/50 animate-ping" />
            </span>

            {/* Tiny tick marks at N/E/S/W */}
            {[0, 90, 180, 270].map((deg) => (
              <span
                key={deg}
                className="absolute top-1/2 left-1/2 h-1.5 w-px bg-white/25"
                style={{
                  transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-94px)`,
                }}
              />
            ))}

            {/* Label floating below */}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-[0.3em] text-slate-600 whitespace-nowrap">
              no · signal
            </span>
          </div>
        </aside>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6">
          {/* Badge */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] sm:text-xs font-medium text-indigo-300 uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              {t('notFound.badge')}
            </span>
          </div>

          {/* Giant 404 */}
          <h1
            id="not-found-title"
            className="text-center font-semibold tracking-tighter leading-none select-none mb-4 sm:mb-6"
          >
            <span
              aria-hidden
              className="block text-[5.5rem] sm:text-[8rem] md:text-[11rem] lg:text-[14rem] text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-200 to-indigo-500/40 drop-shadow-[0_0_60px_rgba(99,102,241,0.35)]"
            >
              404
            </span>
            <span className="sr-only">
              {t('notFound.code')} — {t('notFound.title')}
            </span>
          </h1>

          {/* Terminal / HTTP response console — decorative, on-brand for a tech company */}
          <div
            role="img"
            aria-label="HTTP 404 response"
            className="max-w-xl mx-auto mb-8 sm:mb-10 glass-strong border border-white/10 rounded-xl shadow-2xl shadow-indigo-500/10 overflow-hidden"
          >
            {/* Titlebar with mac-style traffic lights */}
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 border-b border-white/5 bg-slate-950/60">
              <span className="flex items-center gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              </span>
              <span className="ml-2 text-[10px] sm:text-xs font-mono text-slate-500 tracking-wider uppercase select-none">
                response.log
              </span>
              <span className="ml-auto text-[10px] sm:text-xs font-mono text-red-400/80 font-semibold">
                ● 404
              </span>
            </div>

            {/* Body */}
            <pre className="px-3 sm:px-5 py-3 sm:py-4 text-[11px] sm:text-xs font-mono leading-relaxed overflow-x-auto text-slate-300">
              <code>
                <span className="text-emerald-400">$</span>{' '}
                <span className="text-slate-400">curl -I</span>{' '}
                <span className="text-indigo-300 break-all">
                  https://softionyx.com{location.pathname}
                </span>
                {'\n'}
                <span className="text-slate-500">&gt;</span>{' '}
                <span className="text-slate-400">HTTP/2</span>{' '}
                <span className="text-red-400 font-semibold">404</span>{' '}
                <span className="text-slate-400">Not Found</span>
                {'\n'}
                <span className="text-slate-500">&gt;</span>{' '}
                <span className="text-slate-400">content-type:</span>{' '}
                <span className="text-sky-300">text/html; charset=utf-8</span>
                {'\n'}
                <span className="text-slate-500">&gt;</span>{' '}
                <span className="text-slate-400">x-served-by:</span>{' '}
                <span className="text-indigo-300">softionyx-edge</span>
                {'\n'}
                <span className="text-slate-600">
                  # {t('notFound.subtitle')}
                </span>
                {'\n'}
                <span className="text-emerald-400">$</span>{' '}
                <span
                  aria-hidden
                  className="inline-block align-middle w-2 h-3.5 sm:h-4 bg-indigo-300 animate-pulse ml-0.5"
                />
              </code>
            </pre>
          </div>

          {/* Title + subtitle */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-white mb-3 sm:mb-4 [text-wrap:balance]">
              {t('notFound.title')}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed [text-wrap:balance]">
              {t('notFound.subtitle')}
            </p>

            {/* Requested path */}
            <div className="mt-4 sm:mt-5 inline-flex max-w-full items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-white/5 text-[11px] sm:text-xs text-slate-500 font-mono">
              <span className="uppercase tracking-wider text-slate-600">
                {t('notFound.requestedPath')}:
              </span>
              <code className="text-slate-300 truncate max-w-[60vw] sm:max-w-sm">{requestedPath}</code>
            </div>
          </div>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="max-w-xl mx-auto mb-6 sm:mb-8"
            role="search"
          >
            <label htmlFor="nf-search" className="sr-only">
              {t('notFound.searchPlaceholder')}
            </label>
            <div className="relative flex items-center glass-strong border border-white/10 rounded-xl focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/40 transition-all overflow-hidden">
              <span className="pl-4 pr-2 text-slate-500 flex items-center" aria-hidden>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-3.5-3.5" />
                </svg>
              </span>
              <input
                id="nf-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('notFound.searchPlaceholder')}
                className="flex-1 min-w-0 bg-transparent py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                autoComplete="off"
              />
              <button
                type="submit"
                className="shrink-0 m-1 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors"
              >
                {t('notFound.searchCta')}
              </button>
            </div>
          </form>

          {/* Primary CTAs */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10 sm:mb-14">
            <LangLink
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
            >
              <Icon name="hexagon" width={16} />
              {t('notFound.primaryCta')}
            </LangLink>
            <LangLink
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 hover:border-indigo-500/50 hover:bg-indigo-500/5 text-slate-300 hover:text-white text-sm font-medium transition-all"
            >
              <Icon name="mail" width={16} />
              {t('notFound.secondaryCta')}
            </LangLink>
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-transparent text-slate-400 hover:text-white hover:border-white/10 text-sm font-medium transition-all"
            >
              <Icon name="arrow-left" width={16} />
              {t('notFound.backCta')}
            </button>
          </div>

          {/* Helpful / quick links */}
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-xs sm:text-sm uppercase tracking-[0.2em] text-slate-500 mb-4 sm:mb-6">
              {t('notFound.helpful')}
            </p>
            <nav
              aria-label={t('notFound.helpful')}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3"
            >
              {QUICK_LINKS.map((link) => (
                <LangLink
                  key={link.key}
                  to={link.to}
                  className={`group relative flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-br ${link.accent} border hover:border-white/20 transition-all overflow-hidden`}
                >
                  <span className="shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-lg bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                    <Icon name={link.icon} width={18} />
                  </span>
                  <span className="flex-1 min-w-0 text-sm font-medium text-white truncate">
                    {t(`notFound.links.${link.key}`)}
                  </span>
                  <Icon
                    name="arrow-right"
                    width={14}
                    className="shrink-0 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all"
                  />
                </LangLink>
              ))}
            </nav>
          </div>
        </div>
      </main>
    </>
  );
}
