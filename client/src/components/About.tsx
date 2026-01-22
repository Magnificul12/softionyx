import { useEffect, useRef, useState, memo } from 'react';
import { Icon } from '@iconify/react';

function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
    <section ref={sectionRef} className="py-32 relative z-10 border-t border-white/5">
      <div className="absolute inset-0 bg-slate-900/20"></div>
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className={isVisible ? 'animate-slide-left' : ''} style={{ opacity: isVisible ? 1 : 0 }}>
            <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight mb-8">
              Engineered for<br />uncompromised speed.
            </h2>
            <p className="text-slate-400 text-lg font-light mb-10 leading-relaxed">
              We don't just fix problems; we architect the future of your business. Our methodology is rooted in data-driven decisions and agile implementation.
            </p>
            
            <div className="space-y-8">
              {[
                { icon: 'lucide:zap', title: '99.99% Uptime Guarantee', desc: 'Redundant systems ensuring business continuity.', delay: 'delay-100' },
                { icon: 'lucide:lock', title: '24/7 Threat Intelligence', desc: 'Proactive monitoring to neutralize threats before impact.', delay: 'delay-200' },
                { icon: 'lucide:rocket', title: 'Rapid Deployment', desc: 'From consultation to live environment in record time.', delay: 'delay-300' }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className={`flex items-start gap-5 ${isVisible ? `animate-fade-scale ${item.delay}` : ''}`}
                  style={{ opacity: isVisible ? 1 : 0 }}
                >
                  <div className="mt-1 flex-shrink-0 h-8 w-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Icon icon={item.icon} width={16} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-lg">{item.title}</h4>
                    <p className="text-slate-500 text-sm mt-1 font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className={`relative group ${isVisible ? 'animate-slide-right' : ''}`} style={{ opacity: isVisible ? 1 : 0 }}>
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse-glow"></div>
            <div className="relative glass-strong rounded-xl border border-white/10 p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Projects', value: '100+', icon: 'lucide:folder' },
                  { label: 'Clients', value: '50+', icon: 'lucide:users' },
                  { label: 'Technologies', value: '10+', icon: 'lucide:code' },
                  { label: 'Experience', value: '1+', subtext: 'Years', icon: 'lucide:calendar' }
                ].map((stat, idx) => (
                  <div key={idx} className="group/stat glass rounded-lg p-6 border border-white/5 hover:border-indigo-500/30 transition-all duration-300 hover:bg-white/[0.03]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover/stat:scale-110 transition-transform">
                        <Icon icon={stat.icon} width={16} />
                      </div>
                      <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
                    </div>
                    <div className="text-4xl font-bold text-white group-hover/stat:text-indigo-300 transition-colors">{stat.value}</div>
                    {stat.subtext && <div className="text-xs text-slate-500 mt-1">{stat.subtext}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(About);
