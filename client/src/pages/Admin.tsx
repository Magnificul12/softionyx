import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';
import axios from '../utils/axios';
import SEO from '../components/SEO';

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
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [jobApplications, setJobApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    return <Navigate to="/login" />;
  }

  return (
    <>
      <SEO 
        title="Admin Panel" 
        description="SoftIonyx Admin Dashboard"
      />
      <div className="pt-32 pb-20 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 animate-grid"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-8 animate-in">
          <h1 className="text-4xl font-semibold text-white tracking-tight mb-2">
            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Panel</span>
          </h1>
          <p className="text-slate-400">Welcome back, {user?.full_name || 'Admin'}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: 'lucide:bar-chart-3' },
                { id: 'pages', label: 'Pages', icon: 'lucide:file-text' },
                { id: 'services', label: 'Services', icon: 'lucide:settings' },
                { id: 'blog', label: 'Blog Posts', icon: 'lucide:book' },
                { id: 'contacts', label: 'Contacts', icon: 'lucide:mail' },
                { id: 'jobs', label: 'Jobs', icon: 'lucide:briefcase' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/[0.02] border border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="iconify" data-icon={tab.icon} data-width="20"></span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="glass-strong border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
              {activeTab === 'dashboard' && (
                <div>
                  <h2 className="text-2xl font-medium text-white mb-6">Dashboard Overview</h2>
                  {loading ? (
                    <div className="text-center py-12 text-slate-400">Loading...</div>
                  ) : stats ? (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                          { label: 'Total Contacts', value: stats.totalContacts },
                          { label: 'Help Requests', value: stats.totalHelpRequests },
                          { label: 'Job Applications', value: stats.totalJobApplications },
                          { label: 'Blog Posts', value: stats.totalBlogPosts },
                          { label: 'Total Users', value: stats.totalUsers },
                          { label: 'Services', value: stats.totalServices },
                        ].map((stat, idx) => (
                          <div key={idx} className="p-6 rounded-lg bg-slate-900/50 border border-white/5 hover:bg-slate-900/70 transition-colors">
                            <div className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">{stat.label}</div>
                            <div className="text-3xl font-semibold text-white">{stat.value}</div>
                          </div>
                        ))}
                      </div>
                      
                      {stats.recentContacts.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-lg font-medium text-white mb-4">Recent Contacts</h3>
                          <div className="space-y-2">
                            {stats.recentContacts.slice(0, 5).map((contact: any) => (
                              <div key={contact.id} className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-white font-medium">{contact.name}</p>
                                    <p className="text-slate-400 text-sm">{contact.email}</p>
                                    <p className="text-slate-500 text-xs mt-1">{contact.subject}</p>
                                  </div>
                                  <span className="text-xs text-slate-500">{new Date(contact.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12 text-slate-400">Failed to load dashboard data</div>
                  )}
                </div>
              )}

              {activeTab === 'pages' && (
                <div>
                  <h2 className="text-2xl font-medium text-white mb-6">Manage Pages</h2>
                  <div className="space-y-4">
                    {['Home Page', 'About Page', 'Services Page'].map((page, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5">
                        <h3 className="text-white font-medium">{page}</h3>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all">
                          Edit
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-medium text-white">Manage Services</h2>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all">
                      + Add New Service
                    </button>
                  </div>
                  <div className="space-y-4">
                    {['Web Development', 'Mobile App Development'].map((service, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5">
                        <h3 className="text-white font-medium">{service}</h3>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all">
                            Edit
                          </button>
                          <button className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 rounded-lg text-sm font-medium transition-all">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'blog' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-medium text-white">Manage Blog Posts</h2>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all">
                      + Add New Post
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                      <h3 className="text-white font-medium mb-2">The Future of Cloud Computing</h3>
                      <p className="text-slate-500 text-sm mb-4">Published: Jan 15, 2024</p>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all">
                          Edit
                        </button>
                        <button className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 rounded-lg text-sm font-medium transition-all">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'contacts' && (
                <div>
                  <h2 className="text-2xl font-medium text-white mb-6">Contact Form Submissions</h2>
                  {loading ? (
                    <div className="text-center py-12 text-slate-400">Loading...</div>
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
                              Mark as {contact.status === 'new' ? 'Read' : 'Replied'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-400">No contact submissions yet</div>
                  )}
                </div>
              )}

              {activeTab === 'jobs' && (
                <div>
                  <h2 className="text-2xl font-medium text-white mb-6">Job Applications</h2>
                  {loading ? (
                    <div className="text-center py-12 text-slate-400">Loading...</div>
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
                          {application.phone && <p className="text-slate-400 text-sm mb-2">Phone: {application.phone}</p>}
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
                                View Resume
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
                              Mark as Reviewed
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-400">No job applications yet</div>
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
