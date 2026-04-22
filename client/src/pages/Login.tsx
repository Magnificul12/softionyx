import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Icon } from '../components/Icons';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

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
    <>
      <SEO title="Autentificare" description="Autentifică-te în contul tău SoftIonyx." url="/login" noIndex />
    <div className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 animate-grid"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10"></div>
      <div className="pointer-events-none absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-indigo-500/10 blur-3xl -z-10" aria-hidden />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-purple-500/10 blur-3xl -z-10" aria-hidden />
      <div className="w-full max-w-md relative z-10">
        {/* Subtle animated conic glow that sits just outside the card — gives
            the whole block a premium "aurora" halo without distracting from
            the form fields themselves. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-[1px] rounded-[1.25rem] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(99,102,241,0.35),rgba(168,85,247,0.25),rgba(99,102,241,0.35))] opacity-40 blur-md"
        />
        <div className="relative glass-strong border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -top-px left-12 right-12 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" aria-hidden />

          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 shadow-inner shadow-white/5 mb-4">
              <img
                src="/logo.png"
                alt="SoftIonyx"
                width={32}
                height={32}
                className="h-8 w-8 object-contain select-none"
                draggable={false}
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent tracking-tight mb-2">
              {t('login.title')}
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">{t('login.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {success && (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-2">
                <Icon name="check-circle" width={20} />
                <span>{t('login.success')}</span>
              </div>
            )}
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-2">
                <Icon name="alert-circle" width={20} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-2 ml-1 uppercase tracking-[0.14em]">
                {t('login.fields.email')}
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-300 transition-colors">
                  <Icon name="mail" width={16} />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoFocus
                  autoComplete="email"
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder:text-slate-600 hover:border-white/15"
                  placeholder={t('login.placeholders.email')}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-2 ml-1 uppercase tracking-[0.14em]">
                {t('login.fields.password')}
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-300 transition-colors">
                  <Icon name="lock" width={16} />
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder:text-slate-600 hover:border-white/15"
                  placeholder={t('login.placeholders.password')}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group/cta relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-medium py-3 px-4 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/45 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-indigo-500/25"
            >
              {/* Shiny sweep on hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.18)_50%,transparent_75%)] transition-transform duration-700 ease-out group-hover/cta:translate-x-full"
              />
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  <span>{t('login.loading')}</span>
                </>
              ) : (
                <>
                  <span>{t('login.cta')}</span>
                  <Icon name="arrow-right" width={16} className="transition-transform group-hover/cta:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Self-registration is disabled. Access is by invitation only —
              users must be created by an administrator. Styled as a soft
              info pill so it reads as an intentional design choice rather
              than an error state. */}
          <div className="mt-7 pt-5 border-t border-white/5">
            <div className="flex items-start gap-2.5 rounded-xl border border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] to-purple-500/[0.04] px-3.5 py-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-300 ring-1 ring-inset ring-indigo-400/20">
                <Icon name="lucide:shield-check" width={12} />
              </span>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-300/90">
                  {t('login.inviteOnlyTitle', 'Invitation only')}
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                  {t('login.inviteOnly', 'Access is by invitation only. Contact an administrator for account access.')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tiny footer line — brand + subtle security reassurance. */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <Icon name="lucide:lock" width={11} className="text-slate-500" />
          <span>
            {t('login.secureNote', 'Secure connection · SoftIonyx')}
          </span>
        </div>
      </div>
    </div>
    </>
  );
}
