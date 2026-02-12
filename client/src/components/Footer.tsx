import { Link } from 'react-router-dom';
import { useEffect, useRef, useState, memo } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

const INSTAGRAM_URL = 'https://www.instagram.com/softionix.group?igsh=NHU4bTJ2ZmxudWh0';
// Phone number: 0782 00 341 (Moldova)
const PHONE_NUMBER = '+37378200341'; // Moldova country code +373, remove leading 0 and spaces
const PHONE_NUMBER_CLEAN = PHONE_NUMBER.replace('+', ''); // 37378200341
const WHATSAPP_URL = `https://wa.me/${PHONE_NUMBER_CLEAN}`; // WhatsApp: 37378200341
// Viber: try different formats - some work better than others
const VIBER_URL = `viber://chat?number=${PHONE_NUMBER_CLEAN}`; // Viber deep link without +

function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleViberClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Mobile: let the default href work - browser will ask to open Viber
      // No need to prevent default or add delays
    } else {
      // Desktop: try to open Viber app, but don't show annoying popups
      e.preventDefault();
      window.location.href = `viber://chat?number=${PHONE_NUMBER_CLEAN}`;
      // If Viber is not installed, browser will handle it gracefully
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <footer ref={footerRef} className="relative border-t border-white/10 bg-gradient-to-b from-slate-950 to-slate-900/50 relative z-10 pt-20 pb-12 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div className={`col-span-2 md:col-span-1 ${isVisible ? 'animate-slide-left' : ''}`} style={{ opacity: isVisible ? 1 : 0 }}>
            <div className="flex items-center gap-2 mb-6">
              <div className="relative">
                <span className="absolute inset-0 bg-indigo-500 blur-md opacity-30"></span>
                <Icon icon="lucide:hexagon" width={24} className="text-indigo-400 relative z-10" />
              </div>
              <span className="text-white font-semibold tracking-tight text-lg">SOFTIONYX</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs font-light">
              {t('footer.tagline')}
            </p>
          </div>
          
          <div className={isVisible ? 'animate-fade-scale delay-100' : ''} style={{ opacity: isVisible ? 1 : 0 }}>
            <h4 className="text-white font-semibold text-sm mb-6">{t('footer.sections.services')}</h4>
            <ul className="space-y-3 text-xs text-slate-400 font-light">
              <li><Link to="/services" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <Icon icon="lucide:arrow-right" width={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {t('footer.links.web')}
              </Link></li>
              <li><Link to="/services" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <Icon icon="lucide:arrow-right" width={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {t('footer.links.frontendBackend')}
              </Link></li>
              <li><Link to="/services" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <Icon icon="lucide:arrow-right" width={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {t('footer.links.blockchain')}
              </Link></li>
              <li><Link to="/services" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <Icon icon="lucide:arrow-right" width={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {t('footer.links.programming')}
              </Link></li>
            </ul>
          </div>

          <div className={isVisible ? 'animate-fade-scale delay-200' : ''} style={{ opacity: isVisible ? 1 : 0 }}>
            <h4 className="text-white font-semibold text-sm mb-6">{t('footer.sections.company')}</h4>
            <ul className="space-y-3 text-xs text-slate-400 font-light">
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <Icon icon="lucide:arrow-right" width={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {t('footer.links.about')}
              </Link></li>
              <li><Link to="/careers" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <Icon icon="lucide:arrow-right" width={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {t('footer.links.careers')}
              </Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <Icon icon="lucide:arrow-right" width={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {t('footer.links.contact')}
              </Link></li>
            </ul>
          </div>

          <div className={isVisible ? 'animate-slide-right delay-300' : ''} style={{ opacity: isVisible ? 1 : 0 }}>
            <h4 className="text-white font-semibold text-sm mb-6">{t('footer.sections.legal')}</h4>
            <ul className="space-y-3 text-xs text-slate-400 font-light">
              <li><Link to="/privacy" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <Icon icon="lucide:arrow-right" width={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {t('footer.links.privacy')}
              </Link></li>
              <li><Link to="/terms" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <Icon icon="lucide:arrow-right" width={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {t('footer.links.terms')}
              </Link></li>
              <li><Link to="/cookies" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <Icon icon="lucide:arrow-right" width={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {t('footer.links.cookies')}
              </Link></li>
            </ul>
          </div>
        </div>
        
        <div className={`border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 ${isVisible ? 'animate-fade-scale delay-400' : ''}`} style={{ opacity: isVisible ? 1 : 0 }}>
          <p className="text-slate-500 text-xs">© {currentYear} {t('footer.copyright')}</p>
          <div className="flex gap-4 text-slate-400">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg glass border border-white/10 flex items-center justify-center hover:text-green-400 hover:border-green-500/30 hover:bg-green-500/10 transition-all group" aria-label="WhatsApp">
              <Icon icon="mdi:whatsapp" width={18} className="group-hover:scale-110 transition-transform" />
            </a>
            <a 
              href={VIBER_URL} 
              onClick={handleViberClick}
              className="h-9 w-9 rounded-lg glass border border-white/10 flex items-center justify-center hover:text-purple-400 hover:border-purple-500/30 hover:bg-purple-500/10 transition-all group" 
              aria-label="Viber"
            >
              <Icon icon="simple-icons:viber" width={18} className="group-hover:scale-110 transition-transform" />
            </a>
            <a href="#" className="h-9 w-9 rounded-lg glass border border-white/10 flex items-center justify-center hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all group">
              <Icon icon="lucide:linkedin" width={18} className="group-hover:scale-110 transition-transform" />
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg glass border border-white/10 flex items-center justify-center hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all group" aria-label="Instagram">
              <Icon icon="lucide:instagram" width={18} className="group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);