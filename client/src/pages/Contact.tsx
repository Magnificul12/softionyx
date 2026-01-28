import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';
import './ContactPage.css';

export default function Contact() {
  const { t } = useTranslation();
  const location = useLocation();
  const contactSectionRef = useRef<HTMLElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [contactVisible, setContactVisible] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
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
    <div className="pt-32 pb-20 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 animate-grid"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="animate-in">
            <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tighter mb-6">
              {t('contactPage.heroTitlePrefix')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">{t('contactPage.heroTitleHighlight')}</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">{t('contactPage.heroSubtitle')}</p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section
        id="contact-info"
        ref={contactSectionRef}
        className={`py-20 relative z-10 contact-reveal-section ${contactVisible ? 'is-visible' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-medium text-white mb-8 contact-reveal-item">{t('contactPage.infoTitle')}</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4 contact-reveal-item" style={{ ['--reveal-delay' as never]: '120ms' } as CSSProperties}>
                  <div className="h-12 w-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <Icon icon="lucide:mail" width={20} />
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
                    <Icon icon="lucide:phone" width={20} />
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
                <div className="flex items-start gap-4 contact-reveal-item" style={{ ['--reveal-delay' as never]: '360ms' } as CSSProperties}>
                  <button
                    onClick={() => {
                      setShowMap(!showMap);
                      if (!showMap && mapRef.current) {
                        setTimeout(() => {
                          mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                      }
                    }}
                    className="h-12 w-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all cursor-pointer"
                    aria-label="Toggle map"
                  >
                    <Icon icon="lucide:map-pin" width={20} />
                  </button>
                  <div>
                    <h3 className="text-white font-medium mb-1">{t('contactPage.info.address')}</h3>
                    <p className="text-slate-400 text-sm">
                      Mun. Chisinau Str. Nicolae Titulescu 36/B
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Container */}
              {showMap && (
                <div
                  ref={mapRef}
                  className="mt-8 contact-map-wrapper"
                >
                  <div className="contact-map-container rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <iframe
                      src="https://maps.google.com/maps?q=Mun.+Chisinau+Str.+Nicolae+Titulescu+36%2FB&t=&z=15&ie=UTF8&iwloc=&output=embed"
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="contact-map-iframe"
                    ></iframe>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="glass-strong border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden contact-reveal-item" style={{ ['--reveal-delay' as never]: '480ms' } as CSSProperties}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
              <h2 className="text-2xl font-semibold text-white mb-6 relative z-10">{t('contactPage.formTitle')}</h2>
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
                      className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="contact-reveal-item" style={{ ['--reveal-delay' as never]: '840ms' } as CSSProperties}>
                    <label className="block text-xs font-medium text-slate-400 mb-2 ml-1 uppercase tracking-wider">{t('contactPage.fields.phone')}</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                    />
                  </div>
                  <div className="contact-reveal-item" style={{ ['--reveal-delay' as never]: '960ms' } as CSSProperties}>
                    <label className="block text-xs font-medium text-slate-400 mb-2 ml-1 uppercase tracking-wider">{t('contactPage.fields.subject')}</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
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
                      <span className="iconify" data-icon="lucide:arrow-right" data-width="16"></span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
