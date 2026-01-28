import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const jobListings = [
  {
    id: 1,
    title: 'careers.jobs.fullstack.title',
    department: 'careers.departments.development',
    location: 'careers.locations.remote',
    type: 'careers.types.fulltime',
    description: 'careers.jobs.fullstack.desc',
  },
  {
    id: 2,
    title: 'careers.jobs.devops.title',
    department: 'careers.departments.operations',
    location: 'careers.locations.hybrid',
    type: 'careers.types.fulltime',
    description: 'careers.jobs.devops.desc',
  },
  {
    id: 3,
    title: 'careers.jobs.design.title',
    department: 'careers.departments.design',
    location: 'careers.locations.onsite',
    type: 'careers.types.fulltime',
    description: 'careers.jobs.design.desc',
  },
  {
    id: 4,
    title: 'careers.jobs.security.title',
    department: 'careers.departments.security',
    location: 'careers.locations.remote',
    type: 'careers.types.fulltime',
    description: 'careers.jobs.security.desc',
  },
  {
    id: 5,
    title: 'careers.jobs.intern.title',
    department: 'careers.departments.development',
    location: 'careers.locations.remote',
    type: 'careers.types.internship',
    description: 'careers.jobs.intern.desc',
  },
];

export default function Careers() {
  const { t } = useTranslation();
  const [selectedJob, setSelectedJob] = useState<number | null>(null);

  return (
    <div className="pt-32 pb-20 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 animate-grid"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="animate-in">
            <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tighter mb-6">
              {t('careers.heroTitlePrefix')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">{t('careers.heroTitleHighlight')}</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">{t('careers.heroSubtitle')}</p>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-4">
            {jobListings.map((job) => (
              <div
                key={job.id}
                className="group card-glow p-6 rounded-2xl glass border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all duration-500 backdrop-blur-md cursor-pointer relative overflow-hidden"
                onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
              >
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-white mb-2">{t(job.title)}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <span className="iconify" data-icon="lucide:briefcase" data-width="16"></span>
                        {t(job.department)}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="iconify" data-icon="lucide:map-pin" data-width="16"></span>
                        {t(job.location)}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="iconify" data-icon="lucide:clock" data-width="16"></span>
                        {t(job.type)}
                      </span>
                    </div>
                    {selectedJob === job.id && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-slate-400 text-sm font-light mb-4">{t(job.description)}</p>
                        <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all">
                          {t('careers.apply')}
                        </button>
                      </div>
                    )}
                  </div>
                  <span className={`iconify transition-transform ${selectedJob === job.id ? 'rotate-180' : ''}`} data-icon="lucide:chevron-down" data-width="20"></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
