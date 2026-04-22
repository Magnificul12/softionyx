import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';
import SEO from '../components/SEO';
import { Icon } from '../components/Icons';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';
import { LangLink } from '../i18n/routing';

function getInitials(name?: string | null): string {
  if (!name) return 'A';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'A';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface DashboardStats {
  totalContacts: number;
  totalHelpRequests: number;
  totalJobApplications: number;
  totalBlogPosts: number;
  totalUsers: number;
  totalServices: number;
  recentContacts: any[];
  recentHelpRequests: any[];
  recentJobApplications: any[];
}

export default function Admin() {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [jobApplications, setJobApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState<Date>(() => new Date());
  const pagesItems = t('admin.pages.items', { returnObjects: true }) as unknown as string[];
  const servicesItems = t('admin.services.items', { returnObjects: true }) as unknown as string[];

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      loadDashboardData();
    }
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [statsRes, contactsRes, jobsRes] = await Promise.all([
        axios.get('/api/admin/stats', { headers }),
        axios.get('/api/admin/contacts', { headers }),
        axios.get('/api/admin/job-applications', { headers }),
      ]);
      
      setStats(statsRes.data);
      setContacts(contactsRes.data);
      setJobApplications(jobsRes.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="../login" replace />;
  }

  return (
    <>
      <SEO 
        title={t('admin.seoTitle')}
        description={t('admin.seoDescription')}
        noIndex
      />
      <div className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 animate-grid"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10"></div>
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Premium header bar — logo + title + quick stats + date */}
        <div className="mb-5 sm:mb-6 animate-in">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900/60 via-indigo-950/30 to-slate-900/60 p-5 sm:p-6 shadow-xl">
            <div
              className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"
              aria-hidden
            />
            <div
              className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"
              aria-hidden
            />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-tight leading-tight">
                  {t('admin.titlePrefix')}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
                    {t('admin.titleHighlight')}
                  </span>
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm truncate mt-1">
                  {t('admin.welcome', {
                    name: user?.full_name || t('admin.defaultAdmin'),
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap md:flex-nowrap">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[11px] font-medium">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                  </span>
                  Sistem operațional
                </div>
                <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-slate-300 text-[11px]">
                  <Icon name="lucide:calendar" width={12} />
                  {now.toLocaleDateString(undefined, {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}
                  {' · '}
                  {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <LangLink
                  to="/"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 hover:text-white hover:bg-white/[0.06] text-[11px] font-medium transition-colors"
                  title="Vezi site-ul public"
                >
                  <Icon name="lucide:external-link" width={12} />
                  Vezi site-ul
                </LangLink>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 sm:gap-6">
          {/* Sidebar — card premium cu profil, secțiuni și zonă de logout */}
          <aside className="lg:col-span-1 -mx-4 sm:mx-0">
            <div className="lg:sticky lg:top-24 space-y-3">
              {/* Profile card */}
              <div className="hidden lg:block rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold shadow-lg shadow-indigo-500/30">
                      {getInitials(user?.full_name)}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {user?.full_name || t('admin.defaultAdmin')}
                    </div>
                    <div className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-indigo-300">
                      <Icon name="lucide:shield-check" width={10} />
                      Admin
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav
                className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible px-4 sm:px-0 lg:px-0 pb-2 lg:pb-0 snap-x snap-mandatory lg:snap-none scrollbar-hide lg:rounded-xl lg:border lg:border-white/10 lg:bg-white/[0.02] lg:p-3 lg:shadow-lg"
              >
                {[
                  { id: 'dashboard', label: 'admin.tabs.dashboard', icon: 'lucide:bar-chart-3', badge: null as number | null },
                ].map((tab) => {
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative shrink-0 lg:w-full flex items-center gap-2.5 lg:gap-3 px-3 sm:px-3.5 py-2.5 lg:py-2.5 rounded-lg text-left text-sm font-medium transition-all snap-start whitespace-nowrap group ${
                        active
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                          : 'bg-white/[0.02] lg:bg-transparent border border-white/5 lg:border-transparent text-slate-400 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      {active && (
                        <span
                          className="hidden lg:block absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full bg-white/80"
                          aria-hidden
                        />
                      )}
                      <span
                        className={`shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-md transition-colors ${
                          active
                            ? 'bg-white/15 text-white'
                            : 'bg-white/[0.04] text-slate-400 group-hover:text-indigo-300 group-hover:bg-indigo-500/10'
                        }`}
                      >
                        <Icon name={tab.icon} width={14} />
                      </span>
                      <span className="flex-1 truncate">{t(tab.label)}</span>
                      {tab.badge != null && tab.badge > 0 && (
                        <span
                          className={`hidden lg:inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[10px] font-semibold tabular-nums ${
                            active
                              ? 'bg-white/20 text-white'
                              : 'bg-white/[0.04] text-slate-400 group-hover:bg-indigo-500/15 group-hover:text-indigo-200'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Quick actions / logout */}
              <div className="hidden lg:block rounded-xl border border-white/10 bg-white/[0.02] p-3 shadow-lg space-y-1">
                <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 px-2 pb-1">
                  Cont
                </div>
                <LangLink
                  to="/"
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors text-sm"
                >
                  <span className="shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-md bg-white/[0.04]">
                    <Icon name="lucide:home" width={14} />
                  </span>
                  Acasă
                </LangLink>
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-sm"
                >
                  <span className="shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-md bg-white/[0.04] group-hover:bg-rose-500/10">
                    <Icon name="lucide:log-out" width={14} />
                  </span>
                  Deconectare
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-5 min-w-0">
            <div className="glass-strong border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
              {activeTab === 'dashboard' && (
                <div>
                  {/* Totals strip — always shown at the top as a quick scoreboard */}
                  {stats && !loading && (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3 mb-5 sm:mb-6">
                      {[
                        { label: 'admin.dashboard.stats.totalContacts', value: stats.totalContacts, icon: 'lucide:mail' },
                        { label: 'admin.dashboard.stats.helpRequests', value: stats.totalHelpRequests, icon: 'lucide:life-buoy' },
                        { label: 'admin.dashboard.stats.jobApplications', value: stats.totalJobApplications, icon: 'lucide:briefcase' },
                        { label: 'admin.dashboard.stats.blogPosts', value: stats.totalBlogPosts, icon: 'lucide:book' },
                        { label: 'admin.dashboard.stats.totalUsers', value: stats.totalUsers, icon: 'lucide:users' },
                        { label: 'admin.dashboard.stats.services', value: stats.totalServices, icon: 'lucide:settings' },
                      ].map((stat, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-slate-900/40 border border-white/5 hover:bg-slate-900/60 transition-colors flex items-center gap-3">
                          <div className="h-8 w-8 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300 shrink-0">
                            <Icon name={stat.icon} width={14} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium uppercase tracking-wider truncate">{t(stat.label)}</div>
                            <div className="text-base sm:text-lg font-semibold text-white tabular-nums">{stat.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <AnalyticsDashboard />
                </div>
              )}

              {activeTab === 'pages' && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-medium text-white mb-4 sm:mb-6">{t('admin.pages.title')}</h2>
                  <div className="space-y-3 sm:space-y-4">
                    {pagesItems.map((page: string, idx: number) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-lg bg-white/[0.02] border border-white/5">
                        <h3 className="text-white font-medium text-sm sm:text-base">{page}</h3>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all w-full sm:w-auto">
                          {t('admin.buttons.edit')}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-medium text-white">{t('admin.services.title')}</h2>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all w-full sm:w-auto">
                      {t('admin.services.add')}
                    </button>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {servicesItems.map((service: string, idx: number) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-lg bg-white/[0.02] border border-white/5">
                        <h3 className="text-white font-medium text-sm sm:text-base">{service}</h3>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all flex-1 sm:flex-none">
                            {t('admin.buttons.edit')}
                          </button>
                          <button className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 rounded-lg text-sm font-medium transition-all flex-1 sm:flex-none">
                            {t('admin.buttons.delete')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'blog' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-medium text-white">{t('admin.blog.title')}</h2>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all w-full sm:w-auto">
                      {t('admin.blog.add')}
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                      <h3 className="text-white font-medium mb-2">{t('admin.blog.sampleTitle')}</h3>
                      <p className="text-slate-500 text-sm mb-4">{t('admin.blog.sampleDate')}</p>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all">
                          {t('admin.buttons.edit')}
                        </button>
                        <button className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 rounded-lg text-sm font-medium transition-all">
                          {t('admin.buttons.delete')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'contacts' && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-medium text-white mb-4 sm:mb-6">{t('admin.contacts.title')}</h2>
                  {loading ? (
                    <div className="text-center py-12 text-slate-400">{t('admin.loading')}</div>
                  ) : contacts.length > 0 ? (
                    <div className="space-y-4">
                      {contacts.map((contact) => (
                        <div key={contact.id} className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-white font-medium">{contact.name}</h3>
                              <p className="text-slate-500 text-sm">{contact.email}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              contact.status === 'new' ? 'bg-indigo-500/20 text-indigo-300' :
                              contact.status === 'read' ? 'bg-blue-500/20 text-blue-300' :
                              contact.status === 'replied' ? 'bg-green-500/20 text-green-300' :
                              'bg-slate-500/20 text-slate-300'
                            }`}>
                              {contact.status}
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm mb-2 font-medium">{contact.subject}</p>
                          <p className="text-slate-500 text-sm mb-4 line-clamp-2">{contact.message}</p>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                const token = localStorage.getItem('token');
                                axios.patch(`/api/admin/contacts/${contact.id}`, 
                                  { status: contact.status === 'new' ? 'read' : 'replied' },
                                  { headers: { Authorization: `Bearer ${token}` } }
                                ).then(() => loadDashboardData());
                              }}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all"
                            >
                              {t('admin.contacts.markAs')} {contact.status === 'new' ? t('admin.contacts.read') : t('admin.contacts.replied')}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-400">{t('admin.contacts.empty')}</div>
                  )}
                </div>
              )}

              {activeTab === 'jobs' && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-medium text-white mb-4 sm:mb-6">{t('admin.jobs.title')}</h2>
                  {loading ? (
                    <div className="text-center py-12 text-slate-400">{t('admin.loading')}</div>
                  ) : jobApplications.length > 0 ? (
                    <div className="space-y-4">
                      {jobApplications.map((application) => (
                        <div key={application.id} className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-white font-medium">{application.full_name}</h3>
                              <p className="text-slate-500 text-sm">{application.email}</p>
                              <p className="text-indigo-400 text-sm mt-1">{application.job_title}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              application.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                              application.status === 'reviewed' ? 'bg-blue-500/20 text-blue-300' :
                              application.status === 'interview' ? 'bg-purple-500/20 text-purple-300' :
                              application.status === 'hired' ? 'bg-green-500/20 text-green-300' :
                              'bg-red-500/20 text-red-300'
                            }`}>
                              {application.status}
                            </span>
                          </div>
                          {application.phone && <p className="text-slate-400 text-sm mb-2">{t('admin.jobs.phone')}: {application.phone}</p>}
                          {application.cover_letter && (
                            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{application.cover_letter}</p>
                          )}
                          <div className="flex gap-2">
                            {application.resume_url && (
                              <a 
                                href={application.resume_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all"
                              >
                                {t('admin.jobs.viewResume')}
                              </a>
                            )}
                            <button 
                              onClick={() => {
                                const token = localStorage.getItem('token');
                                axios.patch(`/api/admin/job-applications/${application.id}`, 
                                  { status: 'reviewed' },
                                  { headers: { Authorization: `Bearer ${token}` } }
                                ).then(() => loadDashboardData());
                              }}
                              className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-600/30 rounded-lg text-sm font-medium transition-all"
                            >
                              {t('admin.jobs.markReviewed')}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-400">{t('admin.jobs.empty')}</div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
    </>
  );
}
