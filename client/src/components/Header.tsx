import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { Icon } from './Icons';
import { SERVICES as DETAIL_SERVICES } from '../data/services';
import { appLangCode } from '../utils/blogPostI18n';
import { LangLink, stripLangPrefix, withLangPrefix, normalizeLang } from '../i18n/routing';

// Keep accent-colour classes aligned with the service detail pages so the
// dropdown reads as a preview of the actual landing page. Tailwind needs the
// full class strings present in source to survive tree-shaking.
const servicesNavColors: Record<string, { bg: string; border: string; text: string }> = {
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400' },
  pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/20', text: 'text-pink-400' },
};

function getInitials(name?: string | null): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function MenuIcon({ open }: { open: boolean }) {
  const svgClass = 'text-white shrink-0';
  if (open) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={svgClass} aria-hidden>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={svgClass} aria-hidden>
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loadUser } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const servicesMenuRef = useRef<HTMLDivElement | null>(null);
  const servicesCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { i18n, t } = useTranslation();
  const language = appLangCode(i18n.resolvedLanguage || i18n.language) as
    | 'en'
    | 'ro'
    | 'ru';

  const pathNoLang = stripLangPrefix(location.pathname);

  useEffect(() => {
    if (isAuthenticated && !user) {
      loadUser().catch((error) => {
        // Silently fail - user might not be loaded yet
        console.error('Failed to load user:', error);
      });
    }
  }, [isAuthenticated, user]);

  // Close the user dropdown on outside click / escape.
  useEffect(() => {
    if (!isUserMenuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsUserMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [isUserMenuOpen]);

  // Close the Services mega-dropdown on outside click / escape. We keep it
  // open while the pointer hovers either the trigger or the panel, then wait
  // a short beat after leave — this prevents accidental flicker-close while
  // the user traverses the gap between the two.
  useEffect(() => {
    if (!isServicesOpen) return;
    const onClick = (e: MouseEvent) => {
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(e.target as Node)) {
        setIsServicesOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsServicesOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [isServicesOpen]);

  // Close every menu when the route changes — otherwise after clicking a
  // dropdown link the panel lingers over the next page.
  useEffect(() => {
    setIsServicesOpen(false);
    setIsMobileServicesOpen(false);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const openServices = () => {
    if (servicesCloseTimer.current) {
      clearTimeout(servicesCloseTimer.current);
      servicesCloseTimer.current = null;
    }
    setIsServicesOpen(true);
  };
  const scheduleCloseServices = () => {
    if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current);
    servicesCloseTimer.current = setTimeout(() => setIsServicesOpen(false), 140);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 border-b transition-all duration-300 ${
      isScrolled 
        ? 'border-white/10 bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-indigo-500/5' 
        : 'border-white/5 bg-slate-950/70 backdrop-blur-xl'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-[72px] md:h-20 flex items-center">
        <LangLink to="/" className="flex items-center gap-3 group cursor-pointer overflow-visible shrink-0 py-1">
          <div className="relative flex items-center justify-center overflow-visible">
            <img 
              src="/logo.png" 
              alt="SoftIonyx Logo" 
              width={80}
              height={80}
              decoding="async"
              className="relative z-10 h-10 sm:h-12 md:h-14 w-auto object-contain logo-slide-in"
            />
          </div>
        </LangLink>
        
        <div className="hidden md:flex items-center justify-center gap-8 text-sm font-medium flex-1">
          {/* ─── Services mega-dropdown ─────────────────────────────────── */}
          <div
            ref={servicesMenuRef}
            className="relative"
            onMouseEnter={openServices}
            onMouseLeave={scheduleCloseServices}
          >
            <LangLink
              to="/services"
              onClick={() => setIsServicesOpen(false)}
              onFocus={openServices}
              aria-haspopup="menu"
              aria-expanded={isServicesOpen}
              className={`relative inline-flex items-center gap-1 hover:text-white transition-colors duration-200 ${
                pathNoLang === '/services' || pathNoLang.startsWith('/services/')
                  ? 'text-white'
                  : 'text-slate-400'
              }`}
            >
              {(pathNoLang === '/services' ||
                pathNoLang.startsWith('/services/')) && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500"></span>
              )}
              {t('nav.services')}
              <Icon
                name="lucide:chevron-down"
                width={12}
                className={`text-slate-500 transition-transform duration-200 ${
                  isServicesOpen ? 'rotate-180 text-slate-300' : ''
                }`}
              />
            </LangLink>

            {/*
              Animated mega-panel. We keep it mounted and drive visibility via
              opacity + translate + pointer-events so the transition is smooth
              in both directions (React conditional rendering can't fade out).
            */}
            <div
              role="menu"
              aria-hidden={!isServicesOpen}
              onMouseEnter={openServices}
              onMouseLeave={scheduleCloseServices}
              className={`absolute left-1/2 top-full mt-3 -translate-x-1/2 w-[min(92vw,720px)] rounded-2xl border border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden transition-all duration-200 ease-out ${
                isServicesOpen
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 -translate-y-1 pointer-events-none'
              }`}
            >
              <div className="flex items-center justify-between gap-4 px-5 pt-4 pb-3 border-b border-white/5 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-indigo-300">
                    {t('servicesMenu.eyebrow')}
                  </div>
                  <div className="text-sm text-slate-300 font-light">
                    {t('servicesMenu.subtitle')}
                  </div>
                </div>
                <LangLink
                  to="/services"
                  onClick={() => setIsServicesOpen(false)}
                  className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white transition-colors whitespace-nowrap"
                >
                  {t('servicesMenu.viewAll')}
                  <Icon name="arrow-right" width={12} />
                </LangLink>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 p-2 max-h-[70vh] overflow-y-auto">
                {DETAIL_SERVICES.map((s) => {
                  const c = servicesNavColors[s.color] || servicesNavColors.indigo;
                  const isActive = pathNoLang === `/services/${s.slug}`;
                  return (
                    <LangLink
                      key={s.slug}
                      to={`/services/${s.slug}`}
                      onClick={() => setIsServicesOpen(false)}
                      className={`group flex items-start gap-3 p-3 rounded-xl transition-colors ${
                        isActive ? 'bg-white/[0.05]' : 'hover:bg-white/[0.04]'
                      }`}
                      role="menuitem"
                    >
                      <span
                        className={`shrink-0 h-9 w-9 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center ${c.text} group-hover:scale-110 transition-transform`}
                      >
                        <Icon name={s.icon} width={16} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="text-sm font-semibold text-white truncate">
                            {s.serviceType}
                          </span>
                          {s.priceFrom && (
                            <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
                              {t('servicesMenu.priceFrom')}{' '}
                              {s.priceFrom.toLocaleString(language === 'en' ? 'en-US' : language === 'ru' ? 'ru-RU' : 'ro-RO')}{' '}
                              {s.priceCurrency}
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-400 font-light line-clamp-2">
                          {t(`content.${s.slug}.tagline`, { ns: 'services', defaultValue: '' })}
                        </span>
                      </span>
                    </LangLink>
                  );
                })}
              </div>
            </div>
          </div>
          <LangLink 
            to="/solutions" 
            className={`relative hover:text-white transition-colors duration-200 ${
              pathNoLang === '/solutions' ? 'text-white' : 'text-slate-400'
            }`}
          >
            {pathNoLang === '/solutions' && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500"></span>
            )}
            {t('nav.solutions')}
          </LangLink>
          <LangLink 
            to="/portfolio" 
            className={`relative hover:text-white transition-colors duration-200 ${
              pathNoLang === '/portfolio' ? 'text-white' : 'text-slate-400'
            }`}
          >
            {pathNoLang === '/portfolio' && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500"></span>
            )}
            {t('nav.portfolio')}
          </LangLink>
          <LangLink 
            to="/about" 
            className={`relative hover:text-white transition-colors duration-200 ${
              pathNoLang === '/about' ? 'text-white' : 'text-slate-400'
            }`}
          >
            {pathNoLang === '/about' && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500"></span>
            )}
            {t('nav.about')}
          </LangLink>
          <LangLink
            to="/blog"
            className={`relative hover:text-white transition-colors duration-200 ${
              pathNoLang.startsWith('/blog') ? 'text-white' : 'text-slate-400'
            }`}
          >
            {pathNoLang.startsWith('/blog') && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500"></span>
            )}
            {t('nav.blog')}
          </LangLink>
          <LangLink 
            to="/contact" 
            className={`relative hover:text-white transition-colors duration-200 ${
              pathNoLang === '/contact' ? 'text-white' : 'text-slate-400'
            }`}
          >
            {pathNoLang === '/contact' && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500"></span>
            )}
            {t('nav.contact')}
          </LangLink>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <div className="hidden md:flex items-center lang-switcher">
            <div className="lang-switcher__inner flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
            {[
              { code: 'en', label: 'EN' },
              { code: 'ro', label: 'RO' },
              { code: 'ru', label: 'RU' }
            ].map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  const next = normalizeLang(item.code);
                  i18n.changeLanguage(next).catch(() => {});
                  const target = withLangPrefix(next, pathNoLang);
                  navigate(`${target}${location.search}`, { replace: false });
                }}
                className={`lang-switcher__btn px-2.5 py-1 text-[11px] font-semibold rounded-full transition-colors ${
                  language === item.code
                    ? 'bg-indigo-500/20 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                aria-pressed={language === item.code}
                data-active={language === item.code}
              >
                {t(`language.${item.code}`)}
              </button>
            ))}
            </div>
          </div>
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <LangLink
                  to="/admin"
                  aria-current={pathNoLang === '/admin' ? 'page' : undefined}
                  title={t('nav.admin')}
                  className={`group/admin hidden md:inline-flex items-center gap-2 h-9 pl-1 pr-2.5 rounded-full border text-[11px] font-medium tracking-wide transition-all ${
                    pathNoLang === '/admin'
                      ? 'border-white/20 bg-white/[0.06] text-white'
                      : 'border-white/10 bg-white/[0.03] text-slate-200 hover:text-white hover:border-white/20 hover:bg-white/[0.06]'
                  }`}
                >
                  {/* Mirror the user chip: 7x7 rounded-full gradient "avatar"
                      holding a shield icon. Same size, same radius, same
                      gradient direction — so both pills read as siblings. */}
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-inner shadow-white/10 shrink-0">
                    <Icon name="lucide:shield-check" width={13} />
                  </span>
                  <span>{t('nav.admin')}</span>
                </LangLink>
              )}

              {/* User profile dropdown — avatar + name + chevron */}
              <div ref={userMenuRef} className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={isUserMenuOpen}
                  className={`inline-flex items-center gap-2 h-9 pl-1 pr-2.5 rounded-full border transition-all ${
                    isUserMenuOpen
                      ? 'border-white/20 bg-white/[0.06]'
                      : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-[11px] font-semibold text-white shadow-inner shadow-white/10 shrink-0">
                    {getInitials(user?.full_name)}
                  </span>
                  <span className="text-[11px] font-medium text-slate-200 max-w-[140px] truncate">
                    {user?.full_name || 'User'}
                  </span>
                  <Icon
                    name="lucide:chevron-down"
                    width={13}
                    className={`text-slate-500 transition-transform ${isUserMenuOpen ? 'rotate-180 text-slate-300' : ''}`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-60 rounded-xl border border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-3 py-3 border-b border-white/5 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-semibold text-white">
                          {getInitials(user?.full_name)}
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-white truncate">
                            {user?.full_name || 'User'}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {user?.email}
                          </div>
                          {user?.role === 'admin' && (
                            <div className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-indigo-300">
                              <Icon name="lucide:shield-check" width={10} />
                              Admin
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      {user?.role === 'admin' && (
                        <LangLink
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                          role="menuitem"
                        >
                          <Icon name="lucide:layout-dashboard" width={14} className="text-indigo-300" />
                          {t('nav.admin')}
                        </LangLink>
                      )}
                      <LangLink
                        to="/"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                        role="menuitem"
                      >
                        <Icon name="lucide:home" width={14} className="text-slate-400" />
                        Acasă
                      </LangLink>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                        role="menuitem"
                      >
                        <Icon name="lucide:log-out" width={14} className="text-rose-400" />
                        {t('nav.logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile-only logout fallback (dropdown above is hidden on mobile;
                  the mobile menu below already has its own logout item, so we
                  don't duplicate it here). */}
            </>
          ) : null}
          
          {/* Mobile menu button - SVG so it always shows without Iconify */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] text-white rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors touch-manipulation"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Închide meniul' : 'Deschide meniul'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <MenuIcon open={isMobileMenuOpen} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-white/5 bg-slate-950/95 backdrop-blur-xl mobile-menu-enter max-h-[calc(100dvh-4rem)] sm:max-h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain"
        >
          <div className="px-4 sm:px-6 py-4 space-y-1">
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 w-fit mb-2">
              {[
                { code: 'en', label: 'EN' },
                { code: 'ro', label: 'RO' },
                { code: 'ru', label: 'RU' }
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    const next = normalizeLang(item.code);
                    i18n.changeLanguage(next).catch(() => {});
                    const target = withLangPrefix(next, pathNoLang);
                    navigate(`${target}${location.search}`, { replace: false });
                  }}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-full transition-colors ${
                    language === item.code
                      ? 'bg-indigo-500/20 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  aria-pressed={language === item.code}
                >
                  {t(`language.${item.code}`)}
                </button>
              ))}
            </div>
            {/* Services — expandable accordion on mobile */}
            <div className="border-b border-white/5 pb-1 mb-1">
              <div className="flex items-center">
                <LangLink
                  to="/services"
                  className="flex-1 block text-base font-medium hover:text-white transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.services')}
                </LangLink>
                <button
                  type="button"
                  onClick={() => setIsMobileServicesOpen((v) => !v)}
                  aria-expanded={isMobileServicesOpen}
                  aria-controls="mobile-services-panel"
                  className="inline-flex items-center justify-center w-10 h-10 text-slate-400 hover:text-white transition-colors rounded-md"
                  aria-label={
                    isMobileServicesOpen
                      ? t('servicesMenu.toggleClose')
                      : t('servicesMenu.toggleOpen')
                  }
                >
                  <Icon
                    name="lucide:chevron-down"
                    width={16}
                    className={`transition-transform duration-200 ${
                      isMobileServicesOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {/* grid-rows animation — same smooth accordion pattern used in FAQ */}
              <div
                id="mobile-services-panel"
                className="grid transition-all duration-300 ease-out"
                style={{
                  gridTemplateRows: isMobileServicesOpen ? '1fr' : '0fr',
                  opacity: isMobileServicesOpen ? 1 : 0,
                }}
              >
                <div className="overflow-hidden">
                  <div className="pl-3 pb-2 pt-1 space-y-0.5">
                    {DETAIL_SERVICES.map((s) => {
                      const c = servicesNavColors[s.color] || servicesNavColors.indigo;
                      return (
                        <LangLink
                          key={s.slug}
                          to={`/services/${s.slug}`}
                          onClick={() => {
                            setIsMobileServicesOpen(false);
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-white/[0.04] transition-colors"
                        >
                          <span
                            className={`shrink-0 h-8 w-8 rounded-md ${c.bg} border ${c.border} flex items-center justify-center ${c.text}`}
                          >
                            <Icon name={s.icon} width={14} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-white truncate">
                              {s.serviceType}
                            </span>
                            <span className="block text-[11px] text-slate-500 font-light truncate">
                              {t(`content.${s.slug}.tagline`, { ns: 'services', defaultValue: '' })}
                            </span>
                          </span>
                        </LangLink>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <LangLink to="/solutions" className="block text-base font-medium hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.solutions')}</LangLink>
            <LangLink to="/portfolio" className="block text-base font-medium hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.portfolio')}</LangLink>
            <LangLink to="/about" className="block text-base font-medium hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.about')}</LangLink>
            <LangLink to="/blog" className="block text-base font-medium hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.blog')}</LangLink>
            <LangLink to="/contact" className="block text-base font-medium hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.contact')}</LangLink>
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <LangLink to="/admin" className="block text-base font-medium text-indigo-400 hover:text-indigo-300 transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.admin')}</LangLink>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block text-base font-medium hover:text-white transition-colors w-full text-left py-2"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
}
