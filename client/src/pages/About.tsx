import { CSSProperties, useEffect, useRef, useState } from 'react';
import { Icon } from '../components/Icons';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { buildBreadcrumbList } from '../utils/structuredData';
import './AboutPage.css';

export default function About() {
  const { t } = useTranslation();
  const overviewRef = useRef<HTMLElement | null>(null);
  const missionRef = useRef<HTMLElement | null>(null);
  const teamRef = useRef<HTMLElement | null>(null);
  const achievementsRef = useRef<HTMLElement | null>(null);
  const certRef = useRef<HTMLElement | null>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      setVisibleSections(new Set(['overview', 'mission', 'team', 'achievements', 'cert']));
      return;
    }

    const sections = [
      { ref: overviewRef, id: 'overview' },
      { ref: missionRef, id: 'mission' },
      { ref: teamRef, id: 'team' },
      { ref: achievementsRef, id: 'achievements' },
      { ref: certRef, id: 'cert' }
    ];

    const observers = sections.map(({ ref, id }) => {
      if (!ref.current) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(id));
            observer.disconnect();
          }
        },
        { threshold: 0.15 }
      );

      observer.observe(ref.current);
      return { observer, id };
    });

    return () => {
      observers.forEach((item) => {
        if (item) item.observer.disconnect();
      });
    };
  }, []);

  const teamMembers = [
    { name: 'Vutcari Ion', role: 'CEO & Founder', bio: 'Leading strategy and innovation for SoftIonyx.', initials: 'VI' },
    { name: 'Popovici Vasile', role: 'CTO', bio: 'Architecting reliable, scalable, and secure platforms.', initials: 'PV' },
    { name: 'Tertea Nicu', role: 'Lead Developer', bio: 'Building high-quality software with modern stacks.', initials: 'TN' },
    { name: 'Elena Romasenco', role: 'Product Owner', bio: 'Ensuring seamless project delivery and client satisfaction.', initials: 'ER' },
    { name: 'Bulai Constantin', role: 'Developer', bio: 'Creating innovative solutions with cutting-edge technologies.', initials: 'BC' },
    { name: 'Ivasenco Alex', role: 'Developer', bio: 'Delivering robust and efficient software solutions.', initials: 'IA' },
    { name: 'Horozova Olga', role: 'Developer', bio: 'Building scalable applications with modern frameworks.', initials: 'HO' }
  ];

  // Duplicate members for seamless infinite scroll
  const duplicatedMembers = [...teamMembers, ...teamMembers];
  const certItems = t('aboutPage.certItems', { returnObjects: true }) as unknown as string[];
  return (
    <>
      <SEO
        title="Despre SoftIonyx - Echipa, Misiunea & Valorile Noastre"
        description="Află povestea SoftIonyx Technologies: echipa de specialiști IT, misiunea noastră, valorile, realizările și certificările care ne definesc ca partener de încredere pentru dezvoltare software."
        keywords="despre SoftIonyx, echipă IT, companie software, misiune, valori, agenție dezvoltare web"
        url="/about"
        jsonLd={buildBreadcrumbList([
          { name: 'Acasă', path: '/' },
          { name: 'Despre', path: '/about' },
        ])}
      />
    <div className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-10 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 animate-grid"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="animate-in">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-medium text-white tracking-tighter mb-4 sm:mb-6 [text-wrap:balance] leading-[1.15]">
              {t('aboutPage.heroTitlePrefix')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">SoftIonyx</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light px-2">{t('aboutPage.heroSubtitle')}</p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section
        ref={overviewRef}
        className={`py-12 sm:py-16 md:py-20 relative z-10 about-reveal-section ${visibleSections.has('overview') ? 'is-visible' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-medium text-white tracking-tight mb-4 sm:mb-6 md:mb-8 about-reveal-item [text-wrap:balance]">{t('aboutPage.overviewTitle')}</h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-400 leading-relaxed font-light about-reveal-item" style={{ ['--reveal-delay' as never]: '280ms' } as CSSProperties}>
              {t('aboutPage.overviewText')}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section
        ref={missionRef}
        className={`py-12 sm:py-16 md:py-20 relative z-10 border-t border-white/5 about-reveal-section ${visibleSections.has('mission') ? 'is-visible' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="group p-5 sm:p-6 md:p-8 rounded-2xl glass border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-500 backdrop-blur-md card-glow about-reveal-item" style={{ ['--reveal-delay' as never]: '0ms' } as CSSProperties}>
              <div className="h-12 w-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <Icon name="target" width={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-indigo-300 transition-colors">{t('aboutPage.missionTitle')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light group-hover:text-slate-300 transition-colors">
                {t('aboutPage.missionText')}
              </p>
            </div>
            <div className="group p-5 sm:p-6 md:p-8 rounded-2xl glass border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all duration-500 backdrop-blur-md card-glow about-reveal-item" style={{ ['--reveal-delay' as never]: '300ms' } as CSSProperties}>
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <Icon name="eye" width={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-purple-300 transition-colors">{t('aboutPage.visionTitle')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light group-hover:text-slate-300 transition-colors">
                {t('aboutPage.visionText')}
              </p>
            </div>
            <div className="group p-5 sm:p-6 md:p-8 rounded-2xl glass border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all duration-500 backdrop-blur-md card-glow about-reveal-item" style={{ ['--reveal-delay' as never]: '600ms' } as CSSProperties}>
              <div className="h-12 w-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <Icon name="heart" width={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-emerald-300 transition-colors">{t('aboutPage.valuesTitle')}</h3>
              <ul className="text-slate-400 text-sm space-y-2 font-light group-hover:text-slate-300 transition-colors">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {t('aboutPage.values.innovation')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {t('aboutPage.values.integrity')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {t('aboutPage.values.customer')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {t('aboutPage.values.learning')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {t('aboutPage.values.collaboration')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 sm:py-16 md:py-20 relative z-10 border-t border-white/5">
        <div className="w-full">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-medium text-white tracking-tight mb-8 sm:mb-10 md:mb-12 text-center px-4 sm:px-6 [text-wrap:balance]">{t('aboutPage.teamTitle')}</h2>
          
          {/* Infinite Carousel Container */}
          <div className="relative overflow-hidden w-full">
            <style>{`
              @keyframes infiniteScroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
            `}</style>
            <div 
              className="flex gap-4 md:gap-6"
              style={{
                animation: `infiniteScroll ${teamMembers.length * 12}s linear infinite`,
                width: 'max-content',
                willChange: 'transform'
              }}
            >
              {duplicatedMembers.map((member, idx) => (
                <div 
                  key={idx}
                  className="flex-shrink-0 p-4 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:bg-white/[0.04] transition-all w-[280px] md:w-[calc((100vw-7.5rem)/4)] md:min-w-[400px] md:max-w-[600px]"
                >
                  <div className="h-16 w-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xl font-semibold mb-4">
                    {member.initials}
                  </div>
                  <h4 className="text-white font-medium mb-1">{member.name}</h4>
                  <p className="text-indigo-400 text-sm mb-2">{member.role}</p>
                  <p className="text-slate-500 text-xs font-light">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section
        ref={achievementsRef}
        className={`py-12 sm:py-16 md:py-20 relative z-10 border-t border-white/5 about-reveal-section ${visibleSections.has('achievements') ? 'is-visible' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-medium text-white tracking-tight mb-8 sm:mb-10 md:mb-12 about-reveal-item [text-wrap:balance]">{t('aboutPage.achievementsTitle')}</h2>
          <div className="space-y-6 sm:space-y-8">
            <div className="flex gap-4 sm:gap-6 md:gap-8 items-start about-reveal-item" style={{ ['--reveal-delay' as never]: '250ms' } as CSSProperties}>
              <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold text-sm sm:text-lg">
                {t('aboutPage.achievements.year')}
              </div>
              <div className="flex-1 pt-1 sm:pt-2 min-w-0">
                <h4 className="text-white font-medium text-base sm:text-lg mb-1 sm:mb-2">{t('aboutPage.achievements.title')}</h4>
                <p className="text-slate-400 text-sm font-light">{t('aboutPage.achievements.desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section
        ref={certRef}
        className={`py-12 sm:py-16 md:py-20 relative z-10 border-t border-white/5 about-reveal-section ${visibleSections.has('cert') ? 'is-visible' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-medium text-white tracking-tight mb-8 sm:mb-10 md:mb-12 about-reveal-item [text-wrap:balance]">{t('aboutPage.certTitle')}</h2>
          <div className="relative overflow-hidden rounded-2xl">
            <div className="cert-carousel-track flex items-center gap-6 min-w-max">
              {[...certItems, ...certItems].map((cert: string, idx: number) => (
                <div
                  key={`${cert}-${idx}`}
                  className="min-w-[220px] md:min-w-[240px] p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm text-center hover:bg-white/[0.04] transition-all"
                >
                  <p className="text-white font-medium">{cert}</p>
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-950/90 to-transparent"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-950/90 to-transparent"></div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
