import { useState, useEffect, useRef, memo } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';
import './Contact.css';

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

function Contact() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
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
  const countryCodeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Recalc position on open and on scroll/resize so list stays under button
  useEffect(() => {
    if (!isCountryDropdownOpen || !countryCodeButtonRef.current) return;
    const update = () => {
      if (!countryCodeButtonRef.current) return;
      const rect = countryCodeButtonRef.current.getBoundingClientRect();
      setDropdownPosition({ top: rect.bottom + 4, left: rect.left });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [isCountryDropdownOpen]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

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
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: error.response?.data?.error || 'Failed to send message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden z-10">
      {/* Glow effect behind form */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className={isVisible ? 'animate-fade-scale delay-100' : ''} style={{ opacity: isVisible ? 1 : 0 }}>
          <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tighter mb-6">{t('homeContact.title')}</h2>
          <p className="text-slate-400 text-lg font-light mb-12">{t('homeContact.subtitle')}</p>
        </div>
        
        <div className={`glass-strong border border-white/10 rounded-2xl p-8 md:p-12 max-w-lg mx-auto text-left shadow-2xl relative overflow-visible ${isVisible ? 'animate-fade-scale delay-200' : ''}`} style={{ opacity: isVisible ? 1 : 0 }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {status.type && (
              <div className={`p-4 rounded-lg text-sm ${
                status.type === 'success' 
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' 
                  : 'bg-red-500/10 border border-red-500/20 text-red-300'
              }`}>
                {status.message}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 ml-1 uppercase tracking-wider">{t('homeContact.fields.name')}</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <span className="iconify" data-icon="lucide:user" data-width="16"></span>
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('homeContact.placeholders.name')}
                  required
                  className="w-full bg-slate-950/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 ml-1 uppercase tracking-wider">{t('homeContact.fields.email')}</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <span className="iconify" data-icon="lucide:mail" data-width="16"></span>
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('homeContact.placeholders.email')}
                  required
                  pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                  className={`w-full bg-slate-950/50 border rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 transition-all placeholder:text-slate-600 ${
                    emailError 
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' 
                      : 'border-white/10 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                />
              </div>
              {emailError && (
                <p className="text-red-400 text-xs mt-1 ml-1">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 ml-1 uppercase tracking-wider">{t('homeContact.fields.phone')}</label>
              <div className="flex gap-2 min-w-0">
                <div className="relative shrink-0 z-[100]">
                  <button
                    ref={countryCodeButtonRef}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!isCountryDropdownOpen && countryCodeButtonRef.current) {
                        const rect = countryCodeButtonRef.current.getBoundingClientRect();
                        setDropdownPosition({ top: rect.bottom + 4, left: rect.left });
                      }
                      setIsCountryDropdownOpen(!isCountryDropdownOpen);
                    }}
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
                        className="country-dropdown-backdrop"
                        style={{ position: 'fixed', inset: 0, zIndex: 2147483646 }}
                        onClick={() => setIsCountryDropdownOpen(false)}
                        aria-hidden="true"
                      />
                      <div
                        className="country-dropdown-list country-dropdown-panel"
                        role="listbox"
                        style={{
                          position: 'fixed',
                          top: dropdownPosition.top,
                          left: dropdownPosition.left,
                          width: '280px',
                          maxHeight: '220px',
                          overflowY: 'auto',
                          zIndex: 2147483647,
                          padding: '4px',
                        }}
                      >
                        {countryCodes.map((country, index) => {
                          const isSelected = formData.countryCode === country.code;
                          return (
                            <button
                              key={`${country.code}-${country.country}-${index}`}
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, countryCode: country.code }));
                                setIsCountryDropdownOpen(false);
                              }}
                              className={`country-option w-full text-left px-3 py-2.5 text-sm rounded-lg flex items-center gap-3 ${isSelected ? 'selected' : 'text-white'}`}
                            >
                              <span className="font-medium tabular-nums">{country.code}</span>
                              <span className={isSelected ? 'text-slate-300' : 'text-slate-400'}>{country.country}</span>
                              {isSelected && <span className="iconify ml-auto shrink-0 text-indigo-400" data-icon="lucide:check" data-width="16"></span>}
                            </button>
                          );
                        })}
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
            
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 ml-1 uppercase tracking-wider">{t('homeContact.fields.subject')}</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <span className="iconify" data-icon="lucide:layers" data-width="16"></span>
                </span>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={t('homeContact.placeholders.subject')}
                  required
                  className="w-full bg-slate-950/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 ml-1 uppercase tracking-wider">{t('homeContact.fields.message')}</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder={t('homeContact.placeholders.message')}
                required
                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600 resize-none"
              ></textarea>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('homeContact.sending') : t('homeContact.cta')}
                {!isSubmitting && (
                  <span className="iconify group-hover:translate-x-1 transition-transform" data-icon="lucide:arrow-right" data-width="16"></span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default memo(Contact);
