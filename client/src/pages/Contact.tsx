import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';
import { Icon } from '../components/Icons';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';
import SEO from '../components/SEO';
import { buildBreadcrumbList } from '../utils/structuredData';
import { trackEvent } from '../utils/analytics';
import './ContactPage.css';

// Lista completă de coduri de țară (sortată alfabetic după numele țării)
const countryCodesRaw = [
  { code: '+355', country: 'Albania', flag: '🇦🇱' },
  { code: '+213', country: 'Algeria', flag: '🇩🇿' },
  { code: '+376', country: 'Andorra', flag: '🇦🇩' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+43', country: 'Austria', flag: '🇦🇹' },
  { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
  { code: '+375', country: 'Belarus', flag: '🇧🇾' },
  { code: '+32', country: 'Belgium', flag: '🇧🇪' },
  { code: '+387', country: 'Bosnia', flag: '🇧🇦' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+359', country: 'Bulgaria', flag: '🇧🇬' },
  { code: '+1', country: 'Canada', flag: '🇨🇦' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+385', country: 'Croatia', flag: '🇭🇷' },
  { code: '+357', country: 'Cyprus', flag: '🇨🇾' },
  { code: '+420', country: 'Czech Republic', flag: '🇨🇿' },
  { code: '+45', country: 'Denmark', flag: '🇩🇰' },
  { code: '+20', country: 'Egypt', flag: '🇪🇬' },
  { code: '+372', country: 'Estonia', flag: '🇪🇪' },
  { code: '+358', country: 'Finland', flag: '🇫🇮' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+298', country: 'Faroe Islands', flag: '🇫🇴' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+350', country: 'Gibraltar', flag: '🇬🇮' },
  { code: '+30', country: 'Greece', flag: '🇬🇷' },
  { code: '+299', country: 'Greenland', flag: '🇬🇱' },
  { code: '+36', country: 'Hungary', flag: '🇭🇺' },
  { code: '+354', country: 'Iceland', flag: '🇮🇸' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+353', country: 'Ireland', flag: '🇮🇪' },
  { code: '+972', country: 'Israel', flag: '🇮🇱' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+383', country: 'Kosovo', flag: '🇽🇰' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+371', country: 'Latvia', flag: '🇱🇻' },
  { code: '+370', country: 'Lithuania', flag: '🇱🇹' },
  { code: '+352', country: 'Luxembourg', flag: '🇱🇺' },
  { code: '+389', country: 'North Macedonia', flag: '🇲🇰' },
  { code: '+356', country: 'Malta', flag: '🇲🇹' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽' },
  { code: '+373', country: 'Moldova', flag: '🇲🇩' },
  { code: '+377', country: 'Monaco', flag: '🇲🇨' },
  { code: '+382', country: 'Montenegro', flag: '🇲🇪' },
  { code: '+212', country: 'Morocco', flag: '🇲🇦' },
  { code: '+95', country: 'Myanmar', flag: '🇲🇲' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+47', country: 'Norway', flag: '🇳🇴' },
  { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
  { code: '+51', country: 'Peru', flag: '🇵🇪' },
  { code: '+63', country: 'Philippines', flag: '🇵🇭' },
  { code: '+48', country: 'Poland', flag: '🇵🇱' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+40', country: 'România', flag: '🇷🇴' },
  { code: '+7', country: 'Russia', flag: '🇷🇺' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+381', country: 'Serbia', flag: '🇷🇸' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+421', country: 'Slovakia', flag: '🇸🇰' },
  { code: '+386', country: 'Slovenia', flag: '🇸🇮' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+46', country: 'Sweden', flag: '🇸🇪' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+66', country: 'Thailand', flag: '🇹🇭' },
  { code: '+90', country: 'Turkey', flag: '🇹🇷' },
  { code: '+380', country: 'Ukraine', flag: '🇺🇦' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
];

// Sortează alfabetic după numele țării
const countryCodes = countryCodesRaw.sort((a, b) => a.country.localeCompare(b.country));

export default function Contact() {
  const { t } = useTranslation();
  const location = useLocation();
  const contactSectionRef = useRef<HTMLElement | null>(null);
  const [contactVisible, setContactVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+373', // Default Moldova
    phone: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [emailError, setEmailError] = useState<string>('');
  const countryCodeButtonRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!isCountryDropdownOpen || !countryCodeButtonRef.current) return;
    const updatePosition = () => {
      if (countryCodeButtonRef.current) {
        const rect = countryCodeButtonRef.current.getBoundingClientRect();
        const maxWidth = Math.min(280, window.innerWidth - 16);
        const left = Math.max(8, Math.min(rect.left, window.innerWidth - maxWidth - 8));
        setDropdownPosition({ top: rect.bottom + 4, left });
      }
    };
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isCountryDropdownOpen]);

  useEffect(() => {
    if (location.hash === '#contact-info') {
      const target = document.getElementById('contact-info');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location.hash]);

  useEffect(() => {
    const target = contactSectionRef.current;
    if (!target) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      setContactVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setContactVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Validare pentru telefon - doar cifre și caractere telefonice (+, -, spații, paranteze)
    if (name === 'phone') {
      // Permite doar cifre, +, -, spații, paranteze
      const phoneRegex = /^[0-9+\-() ]*$/;
      if (phoneRegex.test(value) || value === '') {
        // Numără doar cifrele (exclude +, -, spații, paranteze)
        const digitsOnly = value.replace(/[^0-9]/g, '');
        // Limitează la 15 cifre
        if (digitsOnly.length <= 15) {
          setFormData({
            ...formData,
            [name]: value,
          });
        }
      }
    } else if (name === 'email') {
      setFormData({
        ...formData,
        [name]: value,
      });
      // Validare în timp real pentru email
      if (value === '') {
        setEmailError('');
      } else if (!validateEmail(value)) {
        setEmailError('Please enter a valid email address.');
      } else {
        setEmailError('');
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });
    trackEvent('contact_start', { metadata: { subject: formData.subject } });

    // Validare email
    if (!validateEmail(formData.email)) {
      setStatus({
        type: 'error',
        message: 'Please enter a valid email address.',
      });
      setIsSubmitting(false);
      return;
    }

    // Validare telefon (dacă este completat)
    if (formData.phone) {
      if (!/^[0-9+\-() ]*$/.test(formData.phone)) {
        setStatus({
          type: 'error',
          message: 'Phone number can only contain numbers and phone characters (+, -, spaces, parentheses).',
        });
        setIsSubmitting(false);
        return;
      }
      // Verifică că nu are mai mult de 15 cifre (fără codul de țară)
      const digitsOnly = formData.phone.replace(/[^0-9]/g, '');
      if (digitsOnly.length > 15) {
        setStatus({
          type: 'error',
          message: 'Phone number cannot exceed 15 digits.',
        });
        setIsSubmitting(false);
        return;
      }
    }

    // Combină codul de țară cu numărul de telefon pentru trimitere
    const fullPhone = formData.phone ? `${formData.countryCode} ${formData.phone}`.trim() : '';

    try {
      const response = await axios.post('/api/contact', {
        ...formData,
        phone: fullPhone, // Trimite numărul complet cu codul de țară
      });
      setStatus({ type: 'success', message: response.data.message });
      setFormData({ name: '', email: '', countryCode: '+373', phone: '', subject: '', message: '' });
      setEmailError('');
      trackEvent('contact_submit', { metadata: { subject: formData.subject } });
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: error.response?.data?.error || t('contactPage.errors.submit'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact SoftIonyx - Discută cu Specialiștii Noștri IT"
        description="Contactează echipa SoftIonyx pentru consultanță IT, ofertă personalizată sau colaborare. Răspundem rapid solicitărilor tale despre dezvoltare web, mobile, backend și blockchain."
        keywords="contact SoftIonyx, consultanță IT, ofertă dezvoltare, email SoftIonyx, colaborare software"
        url="/contact"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact SoftIonyx',
            url: 'https://softionyx.com/contact',
          },
          buildBreadcrumbList([
            { name: 'Acasă', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
        ]}
      />
    <div className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-10 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 animate-grid"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="animate-in">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-medium text-white tracking-tighter mb-4 sm:mb-6 [text-wrap:balance] leading-[1.15]">
              {t('contactPage.heroTitlePrefix')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">{t('contactPage.heroTitleHighlight')}</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light px-2">{t('contactPage.heroSubtitle')}</p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section
        id="contact-info"
        ref={contactSectionRef}
        className={`py-12 sm:py-16 md:py-20 relative z-10 contact-reveal-section ${contactVisible ? 'is-visible' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-medium text-white mb-6 sm:mb-8 contact-reveal-item [text-wrap:balance]">{t('contactPage.infoTitle')}</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4 contact-reveal-item" style={{ ['--reveal-delay' as never]: '120ms' } as CSSProperties}>
                  <div className="h-12 w-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <Icon name="mail" width={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">{t('contactPage.info.email')}</h3>
                    <p className="text-slate-400 text-sm">
                      <a href="mailto:softionyxgroup@gmail.com" className="hover:text-indigo-400 transition-colors">
                        softionyxgroup@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 contact-reveal-item" style={{ ['--reveal-delay' as never]: '240ms' } as CSSProperties}>
                  <div className="h-12 w-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <Icon name="phone" width={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">{t('contactPage.info.phone')}</h3>
                    <p className="text-slate-400 text-sm">
                      <a href="tel:+37378200341" className="hover:text-indigo-400 transition-colors">
                        +373 78 200 341
                      </a>
                    </p>
                  </div>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=46.99045,28.87113"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 contact-reveal-item w-full text-left rounded-xl p-2 -m-2 hover:bg-white/[0.03] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 no-underline"
                  style={{ ['--reveal-delay' as never]: '360ms' } as CSSProperties}
                  aria-label="Vezi locația în Google Maps"
                >
                  <span className="h-12 w-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <Icon name="map-pin" width={20} />
                  </span>
                  <div>
                    <h3 className="text-white font-medium mb-1">{t('contactPage.info.address')}</h3>
                    <p className="text-slate-400 text-sm">
                      Mun. Chisinau Str. Nicolae Titulescu 36/B
                    </p>
                    <p className="text-indigo-400/80 text-xs mt-1">
                      Click pentru a deschide în Google Maps
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-strong border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden contact-reveal-item" style={{ ['--reveal-delay' as never]: '480ms' } as CSSProperties}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-5 sm:mb-6 relative z-10">{t('contactPage.formTitle')}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {status.type && (
                  <div className={`p-4 rounded-lg text-sm ${
                    status.type === 'success' 
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' 
                      : 'bg-red-500/10 border border-red-500/20 text-red-300'
                  }`}>
                    {status.message}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="contact-reveal-item" style={{ ['--reveal-delay' as never]: '600ms' } as CSSProperties}>
                    <label className="block text-xs font-medium text-slate-400 mb-2 ml-1 uppercase tracking-wider">{t('contactPage.fields.name')}</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                    />
                  </div>
                  <div className="contact-reveal-item" style={{ ['--reveal-delay' as never]: '720ms' } as CSSProperties}>
                    <label className="block text-xs font-medium text-slate-400 mb-2 ml-1 uppercase tracking-wider">{t('contactPage.fields.email')}</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                      className={`w-full bg-slate-950/50 border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 transition-all placeholder:text-slate-600 ${
                        emailError 
                          ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' 
                          : 'border-white/10 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                    />
                    {emailError && (
                      <p className="text-red-400 text-xs mt-1 ml-1">{emailError}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="contact-reveal-item flex flex-col min-w-0" style={{ ['--reveal-delay' as never]: '840ms' } as CSSProperties}>
                    <label className="block text-xs font-medium text-slate-400 mb-2 ml-1 uppercase tracking-wider">{t('contactPage.fields.phone')}</label>
                    <div className="flex gap-2 min-w-0">
                      <div className="relative shrink-0" ref={countryCodeButtonRef}>
                        <button
                          type="button"
                          onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                          className="w-[70px] bg-slate-950/50 border border-white/10 rounded-lg px-1.5 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer pr-6 flex items-center justify-center"
                          style={{ 
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")', 
                            backgroundPosition: 'right 0.35rem center', 
                            backgroundRepeat: 'no-repeat', 
                            backgroundSize: '1em 1em',
                          }}
                        >
                          <span className="text-sm">
                            {formData.countryCode}
                          </span>
                        </button>
                        {isCountryDropdownOpen && createPortal(
                          <>
                            <div
                              className="fixed inset-0 z-[9998]"
                              onClick={() => setIsCountryDropdownOpen(false)}
                              aria-hidden
                            />
                            <div
                              className="country-code-dropdown w-[min(280px,calc(100vw-1rem))] border border-white/10 rounded-lg shadow-2xl z-[9999] max-h-[240px] overflow-y-auto"
                              style={{
                                position: 'fixed',
                                top: dropdownPosition.top,
                                left: dropdownPosition.left,
                                backgroundColor: '#0f172a',
                                backgroundImage: 'none',
                              }}
                            >
                              {countryCodes.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => {
                                    setFormData((prev) => ({ ...prev, countryCode: country.code }));
                                    setIsCountryDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-sm text-white hover:bg-slate-700 transition-colors flex items-center gap-2 ${
                                    formData.countryCode === country.code ? 'bg-indigo-600' : ''
                                  }`}
                                >
                                  <span className="font-medium">{country.code}</span>
                                  <span className="text-slate-400">{country.country}</span>
                                </button>
                              ))}
                            </div>
                          </>,
                          document.body
                        )}
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        pattern="[0-9+\-\(\) ]+"
                        placeholder="78 200 341"
                        className="flex-1 min-w-0 bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                  <div className="contact-reveal-item flex flex-col min-w-0" style={{ ['--reveal-delay' as never]: '960ms' } as CSSProperties}>
                    <label className="block text-xs font-medium text-slate-400 mb-2 ml-1 uppercase tracking-wider">{t('contactPage.fields.subject')}</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full min-w-0 bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>
                <div className="contact-reveal-item" style={{ ['--reveal-delay' as never]: '1080ms' } as CSSProperties}>
                  <label className="block text-xs font-medium text-slate-400 mb-2 ml-1 uppercase tracking-wider">{t('contactPage.fields.message')}</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600 resize-none"
                  ></textarea>
                </div>
                <div className="contact-reveal-item" style={{ ['--reveal-delay' as never]: '1200ms' } as CSSProperties}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? t('contactPage.sending') : t('contactPage.cta')}
                    {!isSubmitting && (
                      <Icon name="arrow-right" width={16} />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
