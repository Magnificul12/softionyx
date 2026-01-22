import { useState, useEffect, useRef, memo } from 'react';
import axios from '../utils/axios';

// Lista completă de coduri de țară (sortată alfabetic după numele țării)
const countryCodesRaw = [
  { code: '+355', country: 'Albania' },
  { code: '+213', country: 'Algeria' },
  { code: '+376', country: 'Andorra' },
  { code: '+54', country: 'Argentina' },
  { code: '+61', country: 'Australia' },
  { code: '+43', country: 'Austria' },
  { code: '+880', country: 'Bangladesh' },
  { code: '+375', country: 'Belarus' },
  { code: '+32', country: 'Belgium' },
  { code: '+387', country: 'Bosnia' },
  { code: '+55', country: 'Brazil' },
  { code: '+359', country: 'Bulgaria' },
  { code: '+1', country: 'Canada' },
  { code: '+56', country: 'Chile' },
  { code: '+86', country: 'China' },
  { code: '+57', country: 'Colombia' },
  { code: '+385', country: 'Croatia' },
  { code: '+357', country: 'Cyprus' },
  { code: '+420', country: 'Czech Republic' },
  { code: '+45', country: 'Denmark' },
  { code: '+20', country: 'Egypt' },
  { code: '+372', country: 'Estonia' },
  { code: '+358', country: 'Finland' },
  { code: '+33', country: 'France' },
  { code: '+298', country: 'Faroe Islands' },
  { code: '+49', country: 'Germany' },
  { code: '+350', country: 'Gibraltar' },
  { code: '+30', country: 'Greece' },
  { code: '+299', country: 'Greenland' },
  { code: '+36', country: 'Hungary' },
  { code: '+354', country: 'Iceland' },
  { code: '+91', country: 'India' },
  { code: '+62', country: 'Indonesia' },
  { code: '+353', country: 'Ireland' },
  { code: '+972', country: 'Israel' },
  { code: '+39', country: 'Italy' },
  { code: '+81', country: 'Japan' },
  { code: '+254', country: 'Kenya' },
  { code: '+383', country: 'Kosovo' },
  { code: '+82', country: 'South Korea' },
  { code: '+371', country: 'Latvia' },
  { code: '+370', country: 'Lithuania' },
  { code: '+352', country: 'Luxembourg' },
  { code: '+389', country: 'North Macedonia' },
  { code: '+356', country: 'Malta' },
  { code: '+60', country: 'Malaysia' },
  { code: '+52', country: 'Mexico' },
  { code: '+373', country: 'Moldova' },
  { code: '+377', country: 'Monaco' },
  { code: '+382', country: 'Montenegro' },
  { code: '+212', country: 'Morocco' },
  { code: '+95', country: 'Myanmar' },
  { code: '+31', country: 'Netherlands' },
  { code: '+64', country: 'New Zealand' },
  { code: '+234', country: 'Nigeria' },
  { code: '+47', country: 'Norway' },
  { code: '+92', country: 'Pakistan' },
  { code: '+51', country: 'Peru' },
  { code: '+63', country: 'Philippines' },
  { code: '+48', country: 'Poland' },
  { code: '+351', country: 'Portugal' },
  { code: '+40', country: 'România' },
  { code: '+7', country: 'Russia' },
  { code: '+966', country: 'Saudi Arabia' },
  { code: '+381', country: 'Serbia' },
  { code: '+65', country: 'Singapore' },
  { code: '+421', country: 'Slovakia' },
  { code: '+386', country: 'Slovenia' },
  { code: '+27', country: 'South Africa' },
  { code: '+34', country: 'Spain' },
  { code: '+94', country: 'Sri Lanka' },
  { code: '+46', country: 'Sweden' },
  { code: '+41', country: 'Switzerland' },
  { code: '+66', country: 'Thailand' },
  { code: '+90', country: 'Turkey' },
  { code: '+380', country: 'Ukraine' },
  { code: '+971', country: 'UAE' },
  { code: '+44', country: 'UK' },
  { code: '+1', country: 'USA' },
  { code: '+84', country: 'Vietnam' },
];

// Sortează alfabetic după numele țării
const countryCodes = countryCodesRaw.sort((a, b) => a.country.localeCompare(b.country));

function Contact() {
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
          <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tighter mb-6">Ready to accelerate?</h2>
          <p className="text-slate-400 text-lg font-light mb-12">Join forward-thinking companies that trust SoftIonyx with their critical infrastructure.</p>
        </div>
        
        <div className={`glass-strong border border-white/10 rounded-2xl p-8 md:p-12 max-w-lg mx-auto text-left shadow-2xl relative overflow-hidden ${isVisible ? 'animate-fade-scale delay-200' : ''}`} style={{ opacity: isVisible ? 1 : 0 }}>
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
              <label className="block text-xs font-medium text-slate-400 mb-2 ml-1 uppercase tracking-wider">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 ml-1 uppercase tracking-wider">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
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

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 ml-1 uppercase tracking-wider">Phone</label>
              <div className="flex gap-2 min-w-0">
                <div className="relative shrink-0">
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
                  {isCountryDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsCountryDropdownOpen(false)}
                      ></div>
                      <div className="absolute top-full left-0 mt-1 w-[280px] bg-slate-900 border border-white/10 rounded-lg shadow-2xl z-50 max-h-[200px] overflow-y-auto">
                        {countryCodes.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, countryCode: country.code });
                              setIsCountryDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm text-white hover:bg-slate-800 transition-colors flex items-center gap-2 ${
                              formData.countryCode === country.code ? 'bg-indigo-500/20' : ''
                            }`}
                          >
                            <span className="font-medium">{country.code}</span>
                            <span className="text-slate-400">{country.country}</span>
                          </button>
                        ))}
                      </div>
                    </>
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
              <label className="block text-xs font-medium text-slate-400 mb-2 ml-1 uppercase tracking-wider">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                required
                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 ml-1 uppercase tracking-wider">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Your message"
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
                {isSubmitting ? 'Sending...' : 'Request Consultation'}
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
