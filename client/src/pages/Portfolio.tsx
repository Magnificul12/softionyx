import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '../components/Icons';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';
import { buildBreadcrumbList } from '../utils/structuredData';

const projects = [
  {
    id: 1,
    title: 'portfolio.projects.rightmob.title',
    category: 'portfolio.categories.web',
    description: 'portfolio.projects.rightmob.desc',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
    url: 'https://rightmob.md',
    image: '/rightmob.png',
    imageAlt: 'portfolio.projects.rightmob.imageAlt',
  },
  {
    id: 2,
    title: 'portfolio.projects.work2now.title',
    category: 'portfolio.categories.web',
    description: 'portfolio.projects.work2now.desc',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
    url: 'https://work2now.com/',
    image: '/Work2Now.png',
    imageAlt: 'portfolio.projects.work2now.imageAlt',
  },
  {
    id: 3,
    title: 'portfolio.projects.easywaste.title',
    category: 'portfolio.categories.web',
    description: 'portfolio.projects.easywaste.desc',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
    url: 'https://easywasteremoval.ie/',
    image: '/easywaste-removal.png',
    imageAlt: 'portfolio.projects.easywaste.imageAlt',
  },
  {
    id: 4,
    title: 'portfolio.projects.cetateniero.title',
    category: 'portfolio.categories.web',
    description: 'portfolio.projects.cetateniero.desc',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
    url: 'https://cetateniero.md/',
    image: '/CetatetiaRo-Main.jpg',
    imageAlt: 'portfolio.projects.cetateniero.imageAlt',
  },
];

const categories = ['portfolio.categories.all', 'portfolio.categories.web'];

export default function Portfolio() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('portfolio.categories.all');

  const filteredProjects =
    selectedCategory === 'portfolio.categories.all'
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <>
      <SEO
        title="Portofoliu SoftIonyx - Proiecte Realizate & Studii de Caz"
        description="Explorează portofoliul SoftIonyx: proiecte web, aplicații mobile, platforme enterprise și soluții blockchain livrate cu succes clienților noștri."
        keywords="portofoliu IT, studii de caz, proiecte web, case studies, referințe SoftIonyx"
        url="/portfolio"
        jsonLd={buildBreadcrumbList([
          { name: 'Acasă', path: '/' },
          { name: 'Portofoliu', path: '/portfolio' },
        ])}
      />
    <div className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-10 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 animate-grid"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-medium text-white tracking-tighter mb-4 sm:mb-6 animate-in-portfolio [text-wrap:balance] leading-[1.15]">
            {t('portfolio.heroTitlePrefix')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
              {t('portfolio.heroTitleHighlight')}
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light animate-in-portfolio delay-100 px-2">
            {t('portfolio.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 sm:py-10 md:py-12 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center">
            {categories.map((categoryKey, i) => (
              <button
                key={categoryKey}
                type="button"
                onClick={() => setSelectedCategory(categoryKey)}
                className={`animate-in-portfolio px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  i === 0 ? 'delay-200' : 'delay-300'
                } ${
                  selectedCategory === categoryKey
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/[0.02] border border-white/5 text-slate-400 hover:text-white hover:border-indigo-500/20'
                }`}
              >
                {t(categoryKey)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 sm:py-16 md:py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div
            key={selectedCategory}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="group card-glow animate-in-portfolio p-4 sm:p-5 md:p-6 rounded-2xl glass border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all duration-500 backdrop-blur-md relative overflow-hidden"
                style={{ animationDelay: `${420 + index * 130}ms` }}
              >
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="aspect-[16/9] sm:h-48 sm:aspect-auto rounded-lg overflow-hidden mb-4 group-hover:scale-[1.02] transition-transform duration-500 relative z-10 shadow-lg bg-slate-900/50">
                  <ResponsiveImage
                    src={project.image}
                    alt={t(project.imageAlt)}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                    width={800}
                    height={450}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-white mb-2">{t(project.title)}</h3>
                <p className="text-slate-400 text-sm mb-4 font-light leading-relaxed">{t(project.description)}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs rounded bg-slate-900/50 border border-white/5 text-slate-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/visit mt-1 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-indigo-500/35 bg-gradient-to-r from-indigo-500/15 via-indigo-500/10 to-violet-500/10 px-4 py-2.5 text-sm font-semibold text-indigo-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm transition-all duration-300 hover:border-indigo-400/55 hover:from-indigo-500/25 hover:to-violet-500/20 hover:text-white hover:shadow-[0_0_28px_-6px_rgba(99,102,241,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500/60"
                  >
                    {t('portfolio.visitSite')}
                    <Icon
                      name="arrow-right"
                      width={16}
                      className="shrink-0 transition-transform duration-300 group-hover/visit:translate-x-0.5"
                    />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
