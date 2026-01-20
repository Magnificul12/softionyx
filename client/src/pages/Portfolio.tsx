import { useState } from 'react';

const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    category: 'Web Development',
    description: 'Modern e-commerce solution with payment integration',
    technologies: ['React', 'Node.js', 'MongoDB'],
  },
  {
    id: 2,
    title: 'Mobile Banking App',
    category: 'Mobile App',
    description: 'Secure mobile banking application with biometric authentication',
    technologies: ['React Native', 'Firebase', 'AWS'],
  },
  {
    id: 3,
    title: 'Cloud Migration',
    category: 'Cloud Solutions',
    description: 'Complete cloud infrastructure migration for enterprise',
    technologies: ['AWS', 'Docker', 'Kubernetes'],
  },
  {
    id: 4,
    title: 'AI Analytics Dashboard',
    category: 'AI & Data',
    description: 'Real-time analytics dashboard with AI-powered insights',
    technologies: ['Python', 'TensorFlow', 'React'],
  },
  {
    id: 5,
    title: 'Cybersecurity Audit',
    category: 'Cybersecurity',
    description: 'Comprehensive security audit and penetration testing',
    technologies: ['Security Tools', 'Compliance'],
  },
  {
    id: 6,
    title: 'DevOps Pipeline',
    category: 'DevOps',
    description: 'Automated CI/CD pipeline implementation',
    technologies: ['Jenkins', 'GitLab CI', 'Docker'],
  },
];

const categories = ['All', 'Web Development', 'Mobile App', 'Cloud Solutions', 'AI & Data', 'Cybersecurity', 'DevOps'];

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects = selectedCategory === 'All'
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
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Portfolio</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">Showcasing our successful projects and client solutions</p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/[0.02] border border-white/5 text-slate-400 hover:text-white hover:border-indigo-500/20'
                }`}
              >
                {category}
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
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="h-48 rounded-lg bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 relative z-10 shadow-lg">
                  <span className="iconify text-6xl text-indigo-400/50 group-hover:text-indigo-300 group-hover:scale-110 transition-all duration-300" data-icon="lucide:folder" data-width="64"></span>
                </div>
                <div className="text-xs text-indigo-400 mb-2 font-medium">{project.category}</div>
                <h3 className="text-xl font-medium text-white mb-2">{project.title}</h3>
                <p className="text-slate-400 text-sm mb-4 font-light">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs rounded bg-slate-900/50 border border-white/5 text-slate-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
