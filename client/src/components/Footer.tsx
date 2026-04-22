import { LangLink } from '../i18n/routing';
import { useEffect, useRef, useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, HexagonIcon } from './Icons';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={`text-slate-400 ${className ?? ''}`} style={{ flexShrink: 0 }} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
function ViberIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={`text-slate-400 ${className ?? ''}`} style={{ flexShrink: 0 }} aria-hidden>
      {/* Logo oficial Viber (Simple Icons / brand) */}
      <path d="M11.4 0C9.473.028 5.333.344 3.02 2.467 1.302 4.187.696 6.7.633 9.817.57 12.933.488 18.776 6.12 20.36h.003l-.004 2.416s-.037.977.61 1.177c.777.242 1.234-.5 1.98-1.302.407-.44.972-1.084 1.397-1.58 3.85.326 6.812-.416 7.15-.525.776-.252 5.176-.816 5.892-6.657.74-6.02-.36-9.83-2.34-11.546-.596-.55-3.006-2.3-8.375-2.323 0 0-.395-.025-1.037-.017zm.058 1.693c.545-.004.88.017.88.017 4.542.02 6.717 1.388 7.222 1.846 1.675 1.435 2.53 4.868 1.906 9.897v.002c-.604 4.878-4.174 5.184-4.832 5.395-.28.09-2.882.737-6.153.524 0 0-2.436 2.94-3.197 3.704-.12.12-.26.167-.352.144-.13-.033-.166-.188-.165-.414l.02-4.018c-4.762-1.32-4.485-6.292-4.43-8.895.054-2.604.543-4.738 1.996-6.173 1.96-1.773 5.474-2.018 7.11-2.03zm.38 2.602c-.167 0-.303.135-.304.302 0 .167.133.303.3.305 1.624.01 2.946.537 4.028 1.592 1.073 1.046 1.62 2.468 1.633 4.334.002.167.14.3.307.3.166-.002.3-.138.3-.304-.014-1.984-.618-3.596-1.816-4.764-1.19-1.16-2.692-1.753-4.447-1.765zm-3.96.695c-.19-.032-.4.005-.616.117l-.01.002c-.43.247-.816.562-1.146.932-.002.004-.006.004-.008.008-.267.323-.42.638-.46.948-.008.046-.01.093-.007.14 0 .136.022.27.065.4l.013.01c.135.48.473 1.276 1.205 2.604.42.768.903 1.5 1.446 2.186.27.344.56.673.87.984l.132.132c.31.308.64.6.984.87.686.543 1.418 1.027 2.186 1.447 1.328.733 2.126 1.07 2.604 1.206l.01.014c.13.042.265.064.402.063.046.002.092 0 .138-.008.31-.036.627-.19.948-.46.004 0 .003-.002.008-.005.37-.33.683-.72.93-1.148l.003-.01c.225-.432.15-.842-.18-1.12-.004 0-.698-.58-1.037-.83-.36-.255-.73-.492-1.113-.71-.51-.285-1.032-.106-1.248.174l-.447.564c-.23.283-.657.246-.657.246-3.12-.796-3.955-3.955-3.955-3.955s-.037-.426.248-.656l.563-.448c.277-.215.456-.737.17-1.248-.217-.383-.454-.756-.71-1.115-.25-.34-.826-1.033-.83-1.035-.137-.165-.31-.265-.502-.297zm4.49.88c-.158.002-.29.124-.3.282-.01.167.115.312.282.324 1.16.085 2.017.466 2.645 1.15.63.688.93 1.524.906 2.57-.002.168.13.306.3.31.166.003.305-.13.31-.297.025-1.175-.334-2.193-1.067-2.994-.74-.81-1.777-1.253-3.05-1.346h-.024zm.463 1.63c-.16.002-.29.127-.3.287-.008.167.12.31.288.32.523.028.875.175 1.113.422.24.245.388.62.416 1.164.01.167.15.295.318.287.167-.008.295-.15.287-.317-.03-.644-.215-1.178-.58-1.557-.367-.378-.893-.574-1.52-.607h-.018z"/>
    </svg>
  );
}
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={`text-slate-400 ${className ?? ''}`} style={{ flexShrink: 0 }} aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.12 0 2.064.925 2.063 2.063 0 1.139-.943 2.065-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={`text-slate-400 ${className ?? ''}`} style={{ flexShrink: 0 }} aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

const INSTAGRAM_URL = 'https://www.instagram.com/softionix.group?igsh=NHU4bTJ2ZmxudWh0';
// Phone number: 0782 00 341 (Moldova)
const PHONE_NUMBER = '+37378200341'; // Moldova country code +373, remove leading 0 and spaces
const PHONE_NUMBER_CLEAN = PHONE_NUMBER.replace('+', ''); // 37378200341
const WHATSAPP_URL = `https://wa.me/${PHONE_NUMBER_CLEAN}`; // WhatsApp: 37378200341
// Viber: use public chat link format (works if number has public Viber account)
// If public chat doesn't work, try: viber://contact?number=+37378200341
const VIBER_URL = `viber://contact?number=${PHONE_NUMBER}`; // Viber deep link with + sign

function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleViberClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) {
      // Desktop: Viber Desktop may need different format
      // Try chat protocol without + first (sometimes works better on desktop)
      e.preventDefault();
      window.location.href = `viber://chat?number=${PHONE_NUMBER_CLEAN}`;
      
      // If that doesn't work, try with + after a short delay
      setTimeout(() => {
        window.location.href = `viber://contact?number=${PHONE_NUMBER}`;
      }, 500);
    }
    // Mobile: let default href work (already working)
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
    <footer ref={footerRef} className="relative border-t border-white/10 bg-gradient-to-b from-slate-950 to-slate-900/50 z-10 pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 md:pb-12 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12 md:mb-16">
          <div className={`col-span-2 md:col-span-1 ${isVisible ? 'animate-slide-left' : ''}`} style={{ opacity: isVisible ? 1 : 0 }}>
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="relative">
                <span className="absolute inset-0 bg-indigo-500 blur-md opacity-30"></span>
                <HexagonIcon width={24} className="text-indigo-400 relative z-10" />
              </div>
              <span className="text-white font-semibold tracking-tight text-base sm:text-lg">SOFTIONYX</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs font-light">
              {t('footer.tagline')}
            </p>
          </div>
          
          <div className={isVisible ? 'animate-fade-scale delay-100' : ''} style={{ opacity: isVisible ? 1 : 0 }}>
            <h4 className="text-white font-semibold text-sm mb-4 sm:mb-6">{t('footer.sections.services')}</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs text-slate-400 font-light">
              {/* Deep links to each service landing page — helps Google discover
                  them through internal linking and signals topical relevance. */}
              <li><LangLink to="/services/dezvoltare-web" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <Icon name="arrow-right" width={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                Dezvoltare Web
              </LangLink></li>
              <li><LangLink to="/services/aplicatii-mobile" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <Icon name="arrow-right" width={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                Aplicații Mobile
              </LangLink></li>
              <li><LangLink to="/services/e-commerce" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <Icon name="arrow-right" width={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                E-commerce
              </LangLink></li>
              <li><LangLink to="/services/software-custom" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <Icon name="arrow-right" width={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                Software Custom
              </LangLink></li>
              <li><LangLink to="/services/seo-optimizare" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <Icon name="arrow-right" width={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                SEO & Marketing
              </LangLink></li>
              <li><LangLink to="/services/mentenanta-site" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <Icon name="arrow-right" width={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                Mentenanță
              </LangLink></li>
              <li><LangLink to="/services/cyber-security" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <Icon name="arrow-right" width={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                Cybersecurity
              </LangLink></li>
              <li><LangLink to="/services/blockchain" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <Icon name="arrow-right" width={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                Blockchain
              </LangLink></li>
            </ul>
          </div>

          <div className={isVisible ? 'animate-fade-scale delay-200' : ''} style={{ opacity: isVisible ? 1 : 0 }}>
            <h4 className="text-white font-semibold text-sm mb-4 sm:mb-6">{t('footer.sections.company')}</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs text-slate-400 font-light">
              <li><LangLink to="/about" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <Icon name="arrow-right" width={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {t('footer.links.about')}
              </LangLink></li>
              <li><LangLink to="/careers" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <Icon name="arrow-right" width={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {t('footer.links.careers')}
              </LangLink></li>
              <li><LangLink to="/contact" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <Icon name="arrow-right" width={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {t('footer.links.contact')}
              </LangLink></li>
            </ul>
          </div>

          <div className={isVisible ? 'animate-slide-right delay-300' : ''} style={{ opacity: isVisible ? 1 : 0 }}>
            <h4 className="text-white font-semibold text-sm mb-4 sm:mb-6">{t('footer.sections.legal')}</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs text-slate-400 font-light">
              <li><LangLink to="/privacy" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <Icon name="arrow-right" width={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {t('footer.links.privacy')}
              </LangLink></li>
              <li><LangLink to="/terms" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <Icon name="arrow-right" width={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {t('footer.links.terms')}
              </LangLink></li>
              <li><LangLink to="/cookies" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <Icon name="arrow-right" width={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {t('footer.links.cookies')}
              </LangLink></li>
            </ul>
          </div>
        </div>
        
        <div className={`border-t border-white/10 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 ${isVisible ? 'animate-fade-scale delay-400' : ''}`} style={{ opacity: isVisible ? 1 : 0 }}>
          <p className="text-slate-500 text-xs text-center md:text-left">© {currentYear} {t('footer.copyright')}</p>
          <div className="flex gap-3 sm:gap-4 text-slate-400">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg glass border border-white/10 flex items-center justify-center hover:text-green-400 hover:border-green-500/30 hover:bg-green-500/10 transition-all group" aria-label="WhatsApp">
              <WhatsAppIcon className="group-hover:scale-110 transition-transform" />
            </a>
            <a 
              href={VIBER_URL} 
              onClick={handleViberClick}
              className="h-9 w-9 rounded-lg glass border border-white/10 flex items-center justify-center hover:text-purple-400 hover:border-purple-500/30 hover:bg-purple-500/10 transition-all group" 
              aria-label="Viber"
            >
              <ViberIcon className="group-hover:scale-110 transition-transform" />
            </a>
            <a href="https://www.linkedin.com/company/softionyx-group/" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg glass border border-white/10 flex items-center justify-center hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all group" aria-label="LinkedIn">
              <LinkedInIcon className="group-hover:scale-110 transition-transform" />
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg glass border border-white/10 flex items-center justify-center hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all group" aria-label="Instagram">
              <InstagramIcon className="group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);