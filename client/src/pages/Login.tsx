import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError(t('login.errors.required'));
      setLoading(false);
      return;
    }

    try {
      await login(formData.email, formData.password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err: any) {
      setError(err.message || err.response?.data?.error || t('login.errors.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Spline Background */}
      <div className="spline-container absolute top-96 left-0 w-full h-[calc(100vh-24rem)] -z-10">
        <iframe
          src="https://my.spline.design/glowingplanetparticles-nhVHji30IRoa5HBGe8yeDiTs"
          frameBorder="0"
          width="100%"
          height="100%"
          id="aura-spline"
          style={{ border: 'none', position: 'absolute', top: 0, left: 0 }}
        ></iframe>
      </div>
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 animate-grid"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10"></div>
      <div className="w-full max-w-md relative z-10">
        <div className="glass-strong border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium text-white tracking-tight mb-2">{t('login.title')}</h1>
            <p className="text-slate-400">{t('login.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {success && (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-2">
                <Icon icon="lucide:check-circle" width={20} />
                <span>{t('login.success')}</span>
              </div>
            )}
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-2">
                <Icon icon="lucide:alert-circle" width={20} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 ml-1 uppercase tracking-wider">{t('login.fields.email')}</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <Icon icon="lucide:mail" width={16} />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoFocus
                  className="w-full bg-slate-950/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                  placeholder={t('login.placeholders.email')}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 ml-1 uppercase tracking-wider">{t('login.fields.password')}</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <Icon icon="lucide:lock" width={16} />
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                  placeholder={t('login.placeholders.password')}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('login.loading') : (
                <>
                  <span>{t('login.cta')}</span>
                  <Icon icon="lucide:arrow-right" width={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            <p>
              {t('login.footerText')}{' '}
              <Link 
                to="/register" 
                className="text-indigo-400 hover:text-indigo-300 transition-colors relative group"
              >
                <span className="relative z-10">{t('login.footerCta')}</span>
                <span className="absolute inset-0 bg-indigo-400/10 rounded blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
