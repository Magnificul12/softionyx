import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';

const services = [
  {
    icon: 'lucide:shield',
    title: 'Cyber Security',
    short: 'Audits, IAM, Zero-Trust, SIEM/SOC, DevSecOps, compliance.',
    description: 'Security audits, penetration testing, identity controls, and continuous monitoring.',
    services: [
      'Security audits & penetration testing (web, mobile, infrastructure)',
      'Vulnerability assessment & remediation',
      'Zero-Trust architecture design & implementation',
      'Identity & Access Management (IAM)',
      'Network security (firewalls, IDS/IPS, WAF)',
      'Endpoint protection & device hardening',
      'Security monitoring & alerting (SIEM, SOC setup)',
      'Incident response & breach recovery',
      'Secure authentication (SSO, MFA, OAuth, JWT)',
      'Data encryption (at rest & in transit)',
      'Compliance support (ISO 27001, GDPR, SOC 2)',
      'Secure DevOps (DevSecOps pipelines)'
    ],
    industries: ['FinTech', 'E-commerce', 'Healthcare', 'SaaS', 'Enterprise'],
    outcomes: ['Reduced risk', 'Regulatory compliance', 'Faster response times', 'Safer access control'],
    color: 'indigo'
  },
  {
    icon: 'lucide:cloud',
    title: 'Cloud Infrastructure',
    short: 'Architecture design, migration, CI/CD, Kubernetes, cost optimization.',
    description: 'Cloud architecture, migration, orchestration, and cost-aware operations.',
    services: [
      'Cloud architecture design (AWS, GCP, Azure)',
      'Cloud migration (on-prem → cloud)',
      'Serverless infrastructure setup',
      'Kubernetes & container orchestration',
      'Infrastructure as Code (Terraform, CloudFormation)',
      'CI/CD pipeline setup & optimization',
      'Cloud cost optimization & billing analysis',
      'Multi-cloud & hybrid cloud solutions',
      'Monitoring & logging (CloudWatch, Datadog, Prometheus)'
    ],
    industries: ['SaaS', 'Logistics', 'Media', 'Retail', 'FinTech'],
    outcomes: ['Higher uptime', 'Lower cloud spend', 'Faster deployments', 'Scalable systems'],
    color: 'purple'
  },
  {
    icon: 'lucide:code-2',
    title: 'Software Engineering',
    short: 'Web & mobile apps, microservices, integrations, QA, documentation.',
    description: 'Custom software delivery with scalable architecture and quality assurance.',
    services: [
      'Custom web application development for your business',
      'Mobile app development (iOS, Android, cross-platform)',
      'Microservices architecture',
      'Third-party API integrations',
      'CRM / ERP custom development',
      'SaaS product development',
      'Performance optimization',
      'Automated testing & QA',
      'Technical documentation & maintenance'
    ],
    industries: ['Startups', 'Enterprise', 'E-commerce', 'Healthcare', 'EdTech'],
    outcomes: ['Faster time-to-market', 'Stable releases', 'Better user experience', 'Lower maintenance cost'],
    color: 'emerald'
  },
  {
    icon: 'lucide:database',
    title: 'Data Management',
    short: 'DB design, ETL/ELT, streaming, analytics, BI, governance.',
    description: 'Data platforms for analytics, governance, and operational visibility.',
    services: [
      'Database design & optimization',
      'ETL / ELT pipeline development',
      'Real-time data streaming',
      'Data migration & consolidation',
      'Analytics dashboards & reporting',
      'Business intelligence solutions',
      'Data governance & access control',
      'Backup & disaster recovery'
    ],
    industries: ['FinTech', 'Retail', 'Healthcare', 'Manufacturing', 'SaaS'],
    outcomes: ['Faster insights', 'Data reliability', 'Cost reduction', 'Operational visibility'],
    color: 'blue'
  },
  {
    icon: 'lucide:workflow',
    title: 'Business Automation',
    short: 'Process mapping, workflow automation, integrations, RPA, reporting.',
    description: 'Automate critical workflows to reduce manual work and improve speed.',
    services: [
      'Process analysis & automation design',
      'Workflow automation (approvals, handoffs, SLAs)',
      'RPA (robotic process automation)',
      'System & API integrations',
      'Document automation & e-signature flows',
      'Notifications, alerts & escalation logic',
      'Operational dashboards & reporting',
      'Automation monitoring & optimization'
    ],
    industries: ['E-commerce', 'Logistics', 'Finance', 'Healthcare', 'Professional Services'],
    outcomes: ['Lower operational costs', 'Faster execution', 'Reduced errors', 'Better visibility'],
    color: 'purple'
  },
  {
    icon: 'lucide:blocks',
    title: 'Blockchain',
    short: 'Smart contracts, wallets, tokenization, audits, integrations.',
    description: 'Build secure blockchain solutions with compliant architectures.',
    services: [
      'Smart contract development & audits',
      'Wallet and custody solutions',
      'Tokenization & asset management',
      'Blockchain integration & APIs',
      'Private blockchain setup',
      'Security reviews & best practices',
      'Performance & scalability optimization',
      'Monitoring & incident response'
    ],
    industries: ['FinTech', 'Gaming', 'Supply Chain', 'Healthcare', 'Public Sector'],
    outcomes: ['Higher trust', 'Improved traceability', 'Secure transactions', 'Operational efficiency'],
    color: 'indigo'
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
  const location = useLocation();
  const [activeServiceIndex, setActiveServiceIndex] = useState<number | null>(null);
  const activeService = activeServiceIndex !== null ? services[activeServiceIndex] : null;
  const modalRef = useRef<HTMLDivElement | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeService && modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeService]);

  useEffect(() => {
    if (location.hash === '#service-details' && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

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
          <div
            ref={detailsRef}
            id="service-details"
            style={{ scrollMarginTop: '180px' }}
          ></div>
          {activeService ? (
            <div className="relative">
              <div
                className="absolute inset-0 -m-4 bg-slate-950/70 backdrop-blur-sm rounded-3xl service-overlay-enter"
                onClick={() => setActiveServiceIndex(null)}
                aria-hidden="true"
              ></div>
              <div
                ref={modalRef}
                className="relative z-10 max-w-3xl mx-auto p-8 md:p-10 rounded-2xl glass border border-white/10 shadow-2xl service-modal-enter"
              >
                <button
                  type="button"
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                  onClick={() => setActiveServiceIndex(null)}
                  aria-label="Close service details"
                >
                  <span className="iconify" data-icon="lucide:x" data-width="20"></span>
                </button>
                <div className="flex items-start gap-4 mb-6">
                    <div className={`h-12 w-12 rounded-lg ${colorClasses[activeService.color as keyof typeof colorClasses].bg} border ${colorClasses[activeService.color as keyof typeof colorClasses].border} flex items-center justify-center ${colorClasses[activeService.color as keyof typeof colorClasses].text} shadow-lg`}>
                    <Icon icon={activeService.icon} width={24} />
                  </div>
                  <div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-white mb-2">{activeService.title}</h3>
                  <p className="text-slate-400 text-sm md:text-base font-light leading-relaxed">{activeService.description}</p>
                  </div>
                </div>
              <div className="grid grid-cols-1 gap-6 text-sm text-slate-400 font-light">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                  <h4 className="text-white font-medium mb-3">Services</h4>
                  <ul className="space-y-2">
                    {activeService.services.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                    <h4 className="text-white font-medium mb-3">Industries Served</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeService.industries.map((industry) => (
                        <span key={industry} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs">
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                    <h4 className="text-white font-medium mb-3">Typical Outcomes</h4>
                    <ul className="space-y-2">
                      {activeService.outcomes.map((outcome) => (
                        <li key={outcome} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    className="inline-flex px-6 py-3 border border-white/10 text-white rounded-lg font-medium text-sm hover:border-indigo-400/60 hover:bg-white/5 transition-all"
                    onClick={() => setActiveServiceIndex(null)}
                  >
                    Back to services
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 service-grid-enter">
              {services.map((service, index) => {
                const colors = colorClasses[service.color as keyof typeof colorClasses];
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveServiceIndex(index)}
                    className="text-left group card-glow service-card p-8 rounded-2xl glass border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all duration-500 backdrop-blur-md relative overflow-hidden animate-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className={`h-12 w-12 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center ${colors.text} mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10 shadow-lg`}>
                      <Icon icon={service.icon} width={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 relative z-10 group-hover:text-indigo-300 transition-colors">{service.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed relative z-10 font-light group-hover:text-slate-300 transition-colors">{service.short}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tighter mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-slate-400 mb-8 font-light">Let's discuss how we can help bring your project to life</p>
          <Link
            to="/contact#contact-info"
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
