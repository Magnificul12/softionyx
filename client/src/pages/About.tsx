import { Icon } from '@iconify/react';

export default function About() {
  const teamMembers = [
    { name: 'Vutcari Ion', role: 'CEO & Founder', bio: 'Leading strategy and innovation for SoftIonyx.', initials: 'VI' },
    { name: 'Popovici Vasile', role: 'CTO', bio: 'Architecting reliable, scalable, and secure platforms.', initials: 'PV' },
    { name: 'Tertea Nicu', role: 'Lead Developer', bio: 'Building high-quality software with modern stacks.', initials: 'TN' },
    { name: 'Elena Romasenco', role: 'Project Manager', bio: 'Ensuring seamless project delivery and client satisfaction.', initials: 'ER' }
  ];

  // Duplicate members for seamless infinite scroll
  const duplicatedMembers = [...teamMembers, ...teamMembers];
  return (
    <div className="pt-32 pb-20 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 animate-grid"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="animate-in">
            <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tighter mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">SoftIonyx</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">Empowering businesses with cutting-edge IT solutions</p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight mb-8">Company Overview</h2>
            <p className="text-lg text-slate-400 leading-relaxed font-light">
              SoftIonyx Technologies is a leading IT services company dedicated to delivering 
              innovative technology solutions that drive business growth. With a team of expert 
              developers, designers, and consultants, we help businesses transform their digital 
              presence and achieve their technological goals.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section className="py-20 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl glass border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-500 backdrop-blur-md card-glow">
              <div className="h-12 w-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <Icon icon="lucide:target" width={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-indigo-300 transition-colors">Our Mission</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light group-hover:text-slate-300 transition-colors">
                To provide exceptional IT services that enable businesses to thrive in the digital age, 
                delivering innovative solutions with integrity, excellence, and customer-centric focus.
              </p>
            </div>
            <div className="group p-8 rounded-2xl glass border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all duration-500 backdrop-blur-md card-glow">
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <Icon icon="lucide:eye" width={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-purple-300 transition-colors">Our Vision</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light group-hover:text-slate-300 transition-colors">
                To be the most trusted IT partner for businesses worldwide, recognized for our 
                technical expertise, innovative solutions, and unwavering commitment to client success.
              </p>
            </div>
            <div className="group p-8 rounded-2xl glass border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all duration-500 backdrop-blur-md card-glow">
              <div className="h-12 w-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                <Icon icon="lucide:heart" width={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-emerald-300 transition-colors">Our Values</h3>
              <ul className="text-slate-400 text-sm space-y-2 font-light group-hover:text-slate-300 transition-colors">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Innovation & Excellence
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Integrity & Transparency
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Customer-Centric Approach
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Continuous Learning
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Collaboration & Teamwork
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 relative z-10 border-t border-white/5">
        <div className="w-full">
          <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight mb-12 text-center px-6">Our Team</h2>
          
          {/* Infinite Carousel Container */}
          <div className="relative overflow-hidden w-full">
            <style>{`
              @keyframes infiniteScroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
            `}</style>
            <div 
              className="flex gap-6"
              style={{
                animation: `infiniteScroll ${teamMembers.length * 15}s linear infinite`,
                width: 'max-content',
                willChange: 'transform'
              }}
            >
              {duplicatedMembers.map((member, idx) => (
                <div 
                  key={idx}
                  className="flex-shrink-0 p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:bg-white/[0.04] transition-all"
                  style={{ 
                    width: `calc((100vw - 7.5rem) / ${teamMembers.length})`,
                    minWidth: '400px',
                    maxWidth: '600px'
                  }}
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
      <section className="py-20 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight mb-12">Achievements & Milestones</h2>
          <div className="space-y-8">
            <div className="flex gap-8 items-start">
              <div className="flex-shrink-0 w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold text-lg">
                2026
              </div>
              <div className="flex-1 pt-2">
                <h4 className="text-white font-medium text-lg mb-2">Company Founded</h4>
                <p className="text-slate-400 text-sm font-light">Started with a vision to transform businesses through technology</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight mb-12">Certifications & Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['AWS Certified', 'Microsoft Partner', 'Google Cloud Partner', 'ISO 27001 Certified'].map((cert, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm text-center hover:bg-white/[0.04] transition-all">
                <p className="text-white font-medium">{cert}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
