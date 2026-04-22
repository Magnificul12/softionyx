import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '../components/Icons';
import SEO from '../components/SEO';
import { buildBreadcrumbList, buildJobPostingSchema } from '../utils/structuredData';

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

  const jobsJsonLd = jobListings.map((job) =>
    buildJobPostingSchema({
      title: t(job.title),
      description: t(job.description),
      department: t(job.department),
      location: t(job.location),
      employmentType: t(job.type),
    })
  );

  return (
    <>
      <SEO
        title="Cariere SoftIonyx - Joburi IT, Full-Stack, Frontend, Backend"
        description="Alătură-te echipei SoftIonyx. Descoperă pozițiile deschise: full-stack, frontend, backend, mobile & DevOps. Cultură prietenoasă, proiecte internaționale, pachet competitiv."
        keywords="joburi IT, cariere SoftIonyx, angajări programatori, full-stack developer job, recrutare IT"
        url="/careers"
        jsonLd={[
          buildBreadcrumbList([
            { name: 'Acasă', path: '/' },
            { name: 'Cariere', path: '/careers' },
          ]),
          ...jobsJsonLd,
        ]}
      />
    <div className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-10 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 animate-grid"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="animate-in">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-medium text-white tracking-tighter mb-4 sm:mb-6 [text-wrap:balance] leading-[1.15]">
              {t('careers.heroTitlePrefix')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">{t('careers.heroTitleHighlight')}</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light px-2">{t('careers.heroSubtitle')}</p>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12 sm:py-16 md:py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="space-y-3 sm:space-y-4">
            {jobListings.map((job) => (
              <div
                key={job.id}
                className="group card-glow p-4 sm:p-5 md:p-6 rounded-2xl glass border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all duration-500 backdrop-blur-md cursor-pointer relative overflow-hidden"
                onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
              >
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg md:text-xl font-medium text-white mb-2 pr-2">{t(job.title)}</h3>
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs sm:text-sm text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Icon name="briefcase" width={16} />
                        {t(job.department)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="map-pin" width={16} />
                        {t(job.location)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="clock" width={16} />
                        {t(job.type)}
                      </span>
                    </div>
                    {selectedJob === job.id && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-slate-400 text-sm font-light mb-4 leading-relaxed">{t(job.description)}</p>
                        <button className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all">
                          {t('careers.apply')}
                        </button>
                      </div>
                    )}
                  </div>
                  <Icon name="chevron-down" width={20} className={`shrink-0 mt-1 transition-transform ${selectedJob === job.id ? 'rotate-180' : ''}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
