import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import axios from '../utils/axios';

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
  const location = useLocation();
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

  useEffect(() => {
    if (location.hash === '#contact-info') {
      const target = document.getElementById('contact-info');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location.hash]);

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
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: error.response?.data?.error || 'Failed to send message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 animate-grid"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="animate-in">
            <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tighter mb-6">
              Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Touch</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section id="contact-info" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-medium text-white mb-8">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <Icon icon="lucide:mail" width={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Email</h3>
                    <p className="text-slate-400 text-sm">
                      <a href="mailto:softionyxgroup@gmail.com" className="hover:text-indigo-400 transition-colors">
                        softionyxgroup@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <Icon icon="lucide:phone" width={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Phone</h3>
                    <p className="text-slate-400 text-sm">
                      <a href="tel:+37378200341" className="hover:text-indigo-400 transition-colors">
                        +373 78 200 341
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <Icon icon="lucide:map-pin" width={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Address</h3>
                    <p className="text-slate-400 text-sm">
                      Mun. Chisinau Str. Nicolae Titulescu 36/B
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Contact Form */}
            <div className="glass-strong border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
              <h2 className="text-2xl font-semibold text-white mb-6 relative z-10">Send Us a Message</h2>
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
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2 ml-1 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
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
                  <div className="flex flex-col min-w-0">
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
                  <div className="flex flex-col min-w-0">
                    <label className="block text-xs font-medium text-slate-400 mb-2 ml-1 uppercase tracking-wider">Subject</label>
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
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2 ml-1 uppercase tracking-wider">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600 resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  {!isSubmitting && (
                    <span className="iconify" data-icon="lucide:arrow-right" data-width="16"></span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
