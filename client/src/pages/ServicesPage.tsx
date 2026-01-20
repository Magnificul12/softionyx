import { Link } from 'react-router-dom';

const services = [
  {
    icon: 'lucide:globe',
    title: 'Website Development',
    description: 'We create stunning, high-performance websites that not only look great but also drive results.',
    color: 'indigo'
  },
  {
    icon: 'lucide:code-2',
    title: 'Frontend & Backend Development',
    description: 'Full-stack development services covering both user-facing interfaces and server-side logic.',
    color: 'purple'
  },
  {
    icon: 'lucide:link',
    title: 'Blockchain Analytics',
    description: 'Expert blockchain analysis and development services. We help you understand and leverage blockchain technology.',
    color: 'emerald'
  },
  {
    icon: 'lucide:settings',
    title: 'Programming Languages & Solutions',
    description: 'Expert development across multiple programming languages. We choose the right technology stack for your needs.',
    color: 'blue'
  },
  {
    icon: 'lucide:cloud',
    title: 'Cloud Computing',
    description: 'Comprehensive cloud solutions to scale your business. We help you migrate, optimize, and manage your infrastructure.',
    color: 'orange'
  },
  {
    icon: 'lucide:brain',
    title: 'AI & Machine Learning',
    description: 'Harness the power of AI and ML to transform your business. From predictive analytics to intelligent automation.',
    color: 'pink'
  },
  {
    icon: 'lucide:bitcoin',
    title: 'Blockchain & Cryptocurrency',
    description: 'Complete blockchain and cryptocurrency solutions. From wallet development to exchange platforms.',
    color: 'indigo'
  },
  {
    icon: 'lucide:briefcase',
    title: 'Custom Software Solutions',
    description: 'Tailored software solutions designed specifically for your business needs.',
    color: 'purple'
  }
];

const colorClasses = {
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400' },
  pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/20', text: 'text-pink-400' }
};

export default function ServicesPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 animate-grid"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="animate-in">
            <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tighter mb-6">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Services</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">Comprehensive IT solutions tailored to your business needs</p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const colors = colorClasses[service.color as keyof typeof colorClasses];
              return (
                <div
                  key={index}
                  className="group card-glow p-8 rounded-2xl glass border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all duration-500 backdrop-blur-md relative overflow-hidden animate-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className={`h-12 w-12 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center ${colors.text} mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10 shadow-lg`}>
                    <span className="iconify group-hover:scale-110 transition-transform duration-300" data-icon={service.icon} data-width="24"></span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 relative z-10 group-hover:text-indigo-300 transition-colors">{service.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed relative z-10 font-light group-hover:text-slate-300 transition-colors">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tighter mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-slate-400 mb-8 font-light">Let's discuss how we can help bring your project to life</p>
          <Link
            to="/contact"
            className="inline-flex px-8 py-3.5 bg-white text-slate-950 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.4)] items-center gap-2 group"
          >
            Contact Us
            <span className="iconify group-hover:translate-x-0.5 transition-transform" data-icon="lucide:arrow-right" data-width="16"></span>
          </Link>
        </div>
      </section>
    </div>
  );
}
