import { Link } from 'react-router-dom';
import { useEffect, useRef, useState, memo } from 'react';

const services = [
  {
    icon: 'lucide:shield-check',
    title: 'Cyber Security',
    description: 'Zero-trust architecture and 24/7 autonomous threat monitoring.',
    color: 'indigo'
  },
  {
    icon: 'lucide:cloud',
    title: 'Cloud Infrastructure',
    description: 'Scalable serverless computing and multi-cloud management strategies.',
    color: 'purple'
  },
  {
    icon: 'lucide:cpu',
    title: 'AI & Machine Learning',
    description: 'Predictive analytics and custom model training for business intelligence.',
    color: 'emerald'
  },
  {
    icon: 'lucide:code-2',
    title: 'Software Engineering',
    description: 'Custom software developed with modern stacks and rigorous testing.',
    color: 'blue'
  },
  {
    icon: 'lucide:database',
    title: 'Data Management',
    description: 'Secure warehousing, processing, and real-time data pipelines.',
    color: 'orange'
  },
  {
    icon: 'lucide:network',
    title: 'Network Solutions',
    description: 'High-bandwidth, low-latency network architecture and optimization.',
    color: 'pink'
  }
];

const colorClasses = {
  indigo: {
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    text: 'text-indigo-400',
    hoverBorder: 'hover:border-indigo-500/20',
    gradient: 'from-indigo-500/[0.05]'
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    text: 'text-purple-400',
    hoverBorder: 'hover:border-purple-500/20',
    gradient: 'from-purple-500/[0.05]'
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    hoverBorder: 'hover:border-emerald-500/20',
    gradient: 'from-emerald-500/[0.05]'
  },
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    hoverBorder: 'hover:border-blue-500/20',
    gradient: 'from-blue-500/[0.05]'
  },
  orange: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    text: 'text-orange-400',
    hoverBorder: 'hover:border-orange-500/20',
    gradient: 'from-orange-500/[0.05]'
  },
  pink: {
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    text: 'text-pink-400',
    hoverBorder: 'hover:border-pink-500/20',
    gradient: 'from-pink-500/[0.05]'
  }
};

function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Disconnect after first trigger to prevent re-animation
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: '0px 0px -100px 0px' // Trigger slightly before it's fully visible
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
    <section ref={sectionRef} className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight mb-6">Comprehensive IT Ecosystem</h2>
            <p className="text-slate-400 text-lg font-light leading-relaxed">End-to-end digital solutions tailored to complex enterprise environments. We build the systems that power tomorrow.</p>
          </div>
          <Link to="/services" className="text-white hover:text-indigo-300 text-sm font-medium flex items-center gap-2 transition-colors border-b border-transparent hover:border-indigo-300 pb-0.5">
            View all services <span className="iconify" data-icon="lucide:arrow-right"></span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const colors = colorClasses[service.color as keyof typeof colorClasses];
            
            // Determine animation based on position in grid (3 columns)
            // Column 0 (left): slide from left
            // Column 1 (middle): fade/scale from center
            // Column 2 (right): slide from right
            const columnIndex = index % 3;
            let animationClass = '';
            let delayClass = '';
            
            // Calculate delay based on row (0-100ms per row)
            const rowIndex = Math.floor(index / 3);
            const delayMap: { [key: number]: string } = {
              0: '',
              1: 'delay-100',
              2: 'delay-200',
              3: 'delay-300',
              4: 'delay-400',
              5: 'delay-500'
            };
            delayClass = delayMap[rowIndex] || '';
            
            if (columnIndex === 0) {
              // Left column - slide from left
              animationClass = isVisible ? 'animate-slide-left' : '';
            } else if (columnIndex === 1) {
              // Middle column - fade/scale from center
              animationClass = isVisible ? 'animate-fade-scale' : '';
            } else {
              // Right column - slide from right
              animationClass = isVisible ? 'animate-slide-right' : '';
            }
            
            return (
              <div
                key={index}
                className={`group card-glow p-8 rounded-2xl glass border ${colors.border} ${colors.hoverBorder} hover:bg-white/[0.05] transition-all duration-500 backdrop-blur-md relative overflow-hidden ${animationClass} ${delayClass}`}
                style={{ opacity: isVisible ? 1 : 0 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className={`h-12 w-12 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center ${colors.text} mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10 shadow-lg`}>
                  <span className="iconify group-hover:scale-110 transition-transform duration-300" data-icon={service.icon} data-width="24"></span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 relative z-10 group-hover:text-indigo-300 transition-colors">{service.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed relative z-10 font-light group-hover:text-slate-300 transition-colors">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default memo(Services);
