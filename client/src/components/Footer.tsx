import { Link } from 'react-router-dom';
import { useEffect, useRef, useState, memo } from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
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

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <footer ref={footerRef} className="relative border-t border-white/10 bg-gradient-to-b from-slate-950 to-slate-900/50 relative z-10 pt-20 pb-12 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div className={`col-span-2 md:col-span-1 ${isVisible ? 'animate-slide-left' : ''}`} style={{ opacity: isVisible ? 1 : 0 }}>
            <div className="flex items-center gap-2 mb-6">
              <div className="relative">
                <span className="absolute inset-0 bg-indigo-500 blur-md opacity-30"></span>
                <span className="iconify text-indigo-400 relative z-10" data-icon="lucide:hexagon" data-width="24"></span>
              </div>
              <span className="text-white font-semibold tracking-tight text-lg">SOFTIONYX</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs font-light">
              Professional IT solutions designed for modern enterprise performance, security, and scalability.
            </p>
          </div>
          
          <div className={isVisible ? 'animate-fade-scale delay-100' : ''} style={{ opacity: isVisible ? 1 : 0 }}>
            <h4 className="text-white font-semibold text-sm mb-6">Services</h4>
            <ul className="space-y-3 text-xs text-slate-400 font-light">
              <li><Link to="/services" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span className="w-0 group-hover:w-1.5 h-0.5 bg-indigo-400 transition-all duration-300"></span>
                Web Development
              </Link></li>
              <li><Link to="/services" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span className="w-0 group-hover:w-1.5 h-0.5 bg-indigo-400 transition-all duration-300"></span>
                Frontend & Backend
              </Link></li>
              <li><Link to="/services" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span className="w-0 group-hover:w-1.5 h-0.5 bg-indigo-400 transition-all duration-300"></span>
                Blockchain Analytics
              </Link></li>
              <li><Link to="/services" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span className="w-0 group-hover:w-1.5 h-0.5 bg-indigo-400 transition-all duration-300"></span>
                Programming
              </Link></li>
            </ul>
          </div>

          <div className={isVisible ? 'animate-fade-scale delay-200' : ''} style={{ opacity: isVisible ? 1 : 0 }}>
            <h4 className="text-white font-semibold text-sm mb-6">Company</h4>
            <ul className="space-y-3 text-xs text-slate-400 font-light">
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span className="w-0 group-hover:w-1.5 h-0.5 bg-indigo-400 transition-all duration-300"></span>
                About Us
              </Link></li>
              <li><Link to="/careers" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span className="w-0 group-hover:w-1.5 h-0.5 bg-indigo-400 transition-all duration-300"></span>
                Careers
              </Link></li>
              <li><Link to="/blog" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span className="w-0 group-hover:w-1.5 h-0.5 bg-indigo-400 transition-all duration-300"></span>
                Blog
              </Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span className="w-0 group-hover:w-1.5 h-0.5 bg-indigo-400 transition-all duration-300"></span>
                Contact
              </Link></li>
            </ul>
          </div>

          <div className={isVisible ? 'animate-slide-right delay-300' : ''} style={{ opacity: isVisible ? 1 : 0 }}>
            <h4 className="text-white font-semibold text-sm mb-6">Legal</h4>
            <ul className="space-y-3 text-xs text-slate-400 font-light">
              <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span className="w-0 group-hover:w-1.5 h-0.5 bg-indigo-400 transition-all duration-300"></span>
                Privacy Policy
              </a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span className="w-0 group-hover:w-1.5 h-0.5 bg-indigo-400 transition-all duration-300"></span>
                Terms of Service
              </a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span className="w-0 group-hover:w-1.5 h-0.5 bg-indigo-400 transition-all duration-300"></span>
                Cookie Policy
              </a></li>
            </ul>
          </div>
        </div>
        
        <div className={`border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 ${isVisible ? 'animate-fade-scale delay-400' : ''}`} style={{ opacity: isVisible ? 1 : 0 }}>
          <p className="text-slate-500 text-xs">© {currentYear} SoftIonyx Technologies. All rights reserved.</p>
          <div className="flex gap-4 text-slate-400">
            <a href="#" className="h-9 w-9 rounded-lg glass border border-white/10 flex items-center justify-center hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all group">
              <span className="iconify group-hover:scale-110 transition-transform" data-icon="lucide:twitter" data-width="18"></span>
            </a>
            <a href="#" className="h-9 w-9 rounded-lg glass border border-white/10 flex items-center justify-center hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all group">
              <span className="iconify group-hover:scale-110 transition-transform" data-icon="lucide:github" data-width="18"></span>
            </a>
            <a href="#" className="h-9 w-9 rounded-lg glass border border-white/10 flex items-center justify-center hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all group">
              <span className="iconify group-hover:scale-110 transition-transform" data-icon="lucide:linkedin" data-width="18"></span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);