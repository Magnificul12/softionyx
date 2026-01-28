import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';

export default function Header() {
  const location = useLocation();
  const { user, isAuthenticated, logout, loadUser } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { i18n, t } = useTranslation();
  const language = (i18n.resolvedLanguage || i18n.language || 'en') as 'en' | 'ro' | 'ru';

  useEffect(() => {
    if (isAuthenticated && !user) {
      loadUser().catch((error) => {
        // Silently fail - user might not be loaded yet
        console.error('Failed to load user:', error);
      });
    }
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout();
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center">
        <Link to="/" className="flex items-center gap-3 group cursor-pointer overflow-visible">
          <div className="relative flex items-center justify-center overflow-visible">
            <img 
              src="/logo.png" 
              alt="SoftIonyx Logo" 
              className="relative z-10 h-24 sm:h-28 md:h-32 w-auto group-hover:opacity-90 transition-opacity duration-300 object-contain drop-shadow-[0_6px_18px_rgba(15,23,42,0.45)] logo-slide-in"
            />
          </div>
        </Link>
        
        <div className="hidden md:flex items-center justify-center gap-8 text-sm font-medium flex-1">
          <Link 
            to="/services" 
            className={`relative hover:text-white transition-colors duration-200 ${
              location.pathname === '/services' ? 'text-white' : 'text-slate-400'
            }`}
          >
            {location.pathname === '/services' && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500"></span>
            )}
            {t('nav.services')}
          </Link>
          <Link 
            to="/solutions" 
            className={`relative hover:text-white transition-colors duration-200 ${
              location.pathname === '/solutions' ? 'text-white' : 'text-slate-400'
            }`}
          >
            {location.pathname === '/solutions' && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500"></span>
            )}
            {t('nav.solutions')}
          </Link>
          <Link 
            to="/store" 
            className={`relative hover:text-white transition-colors duration-200 ${
              location.pathname === '/store' ? 'text-white' : 'text-slate-400'
            }`}
          >
            {location.pathname === '/store' && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500"></span>
            )}
            {t('nav.store')}
          </Link>
          <Link 
            to="/about" 
            className={`relative hover:text-white transition-colors duration-200 ${
              location.pathname === '/about' ? 'text-white' : 'text-slate-400'
            }`}
          >
            {location.pathname === '/about' && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500"></span>
            )}
            {t('nav.about')}
          </Link>
          <Link 
            to="/contact" 
            className={`relative hover:text-white transition-colors duration-200 ${
              location.pathname === '/contact' ? 'text-white' : 'text-slate-400'
            }`}
          >
            {location.pathname === '/contact' && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500"></span>
            )}
            {t('nav.contact')}
          </Link>
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
                onClick={() => i18n.changeLanguage(item.code)}
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
                <Link 
                  to="/admin" 
                  className="hidden md:block text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {t('nav.admin')}
                </Link>
              )}
              <span className="hidden md:block text-sm font-medium text-slate-400">{user?.full_name}</span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium hover:text-white transition-colors"
              >
                {t('nav.logout')}
              </button>
            </>
          ) : null}
          
          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <Icon icon={isMobileMenuOpen ? 'lucide:x' : 'lucide:menu'} width={24} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-white/5 bg-slate-950/95 backdrop-blur-xl mobile-menu-enter">
          <div className="px-4 sm:px-6 py-4 space-y-2">
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 w-fit mb-2">
              {[
                { code: 'en', label: 'EN' },
                { code: 'ro', label: 'RO' },
                { code: 'ru', label: 'RU' }
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => i18n.changeLanguage(item.code)}
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
            <Link to="/services" className="block text-base font-medium hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.services')}</Link>
            <Link to="/solutions" className="block text-base font-medium hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.solutions')}</Link>
            <Link to="/store" className="block text-base font-medium hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.store')}</Link>
            <Link to="/about" className="block text-base font-medium hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.about')}</Link>
            <Link to="/contact" className="block text-base font-medium hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.contact')}</Link>
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="block text-base font-medium text-indigo-400 hover:text-indigo-300 transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.admin')}</Link>
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
