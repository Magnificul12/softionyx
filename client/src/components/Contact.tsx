import { useState, useEffect, useRef, memo } from 'react';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';

function Contact() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await axios.post('/api/contact', formData);
      setStatus({ type: 'success', message: response.data.message });
      setFormData({ name: '', email: '', subject: '', message: '' });
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
                  className="w-full bg-slate-950/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
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
