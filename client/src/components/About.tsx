import { useEffect, useRef, useState, memo } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

function About() {
  const { t } = useTranslation();
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
              {t('homeAbout.titleLine1')}<br />{t('homeAbout.titleLine2')}
            </h2>
            <p className="text-slate-400 text-lg font-light mb-10 leading-relaxed">
              {t('homeAbout.subtitle')}
            </p>
            
            <div className="space-y-8">
              {[
                { icon: 'lucide:zap', title: 'homeAbout.points.uptime.title', desc: 'homeAbout.points.uptime.desc', delay: 'delay-100' },
                { icon: 'lucide:lock', title: 'homeAbout.points.threat.title', desc: 'homeAbout.points.threat.desc', delay: 'delay-200' },
                { icon: 'lucide:rocket', title: 'homeAbout.points.deploy.title', desc: 'homeAbout.points.deploy.desc', delay: 'delay-300' }
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
                    <h4 className="text-white font-medium text-lg">{t(item.title)}</h4>
                    <p className="text-slate-500 text-sm mt-1 font-light">{t(item.desc)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className={`relative group ${isVisible ? 'animate-slide-right' : ''}`} style={{ opacity: isVisible ? 1 : 0 }}>
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse-glow"></div>
            <div className="relative glass-strong rounded-xl border border-white/10 p-4 sm:p-6 md:p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-3 sm:gap-6">
                {[
                  { label: 'homeAbout.stats.projects', value: '100+', icon: 'lucide:folder' },
                  { label: 'homeAbout.stats.clients', value: '50+', icon: 'lucide:users' },
                  { label: 'homeAbout.stats.technologies', value: '10+', icon: 'lucide:code' },
                  { label: 'homeAbout.stats.experience', value: '1+', subtext: 'homeAbout.stats.years', icon: 'lucide:calendar' }
                ].map((stat, idx) => (
                  <div key={idx} className="group/stat glass rounded-lg p-4 sm:p-5 md:p-6 border border-white/5 hover:border-indigo-500/30 transition-all duration-300 hover:bg-white/[0.03]">
                    <div className="flex items-center gap-3 mb-2 sm:mb-3">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover/stat:scale-110 transition-transform">
                        <Icon icon={stat.icon} width={16} />
                      </div>
                      <div className="text-[10px] sm:text-xs text-slate-500 font-medium uppercase tracking-wider">{t(stat.label)}</div>
                    </div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white group-hover/stat:text-indigo-300 transition-colors">{stat.value}</div>
                    {stat.subtext && <div className="text-[10px] sm:text-xs text-slate-500 mt-1">{t(stat.subtext)}</div>}
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
