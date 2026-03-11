import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '../components/Icons';

const projects = [
  {
    id: 1,
    title: 'portfolio.projects.rightmob.title',
    category: 'portfolio.categories.web',
    description: 'portfolio.projects.rightmob.desc',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
    url: 'https://rightmob.md',
  },
];

const categories = ['portfolio.categories.all', 'portfolio.categories.web'];

export default function Portfolio() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('portfolio.categories.all');

  const filteredProjects = selectedCategory === 'portfolio.categories.all'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className="pt-32 pb-20 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 animate-grid"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="animate-in">
            <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tighter mb-6">
              {t('portfolio.heroTitlePrefix')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">{t('portfolio.heroTitleHighlight')}</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">{t('portfolio.heroSubtitle')}</p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((categoryKey) => (
              <button
                key={categoryKey}
                onClick={() => setSelectedCategory(categoryKey)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
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
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group card-glow p-6 rounded-2xl glass border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all duration-500 backdrop-blur-md relative overflow-hidden"
              >
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="h-48 rounded-lg overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-500 relative z-10 shadow-lg">
                  <img
                    src="/rightmob.png"
                    alt="RightMob.md homepage"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="text-xs text-indigo-400 mb-2 font-medium">{t(project.category)}</div>
                <h3 className="text-xl font-medium text-white mb-2">{t(project.title)}</h3>
                <p className="text-slate-400 text-sm mb-4 font-light">{t(project.description)}</p>
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
                    className="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Vizitează site-ul
                    <Icon name="arrow-right" width={16} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
