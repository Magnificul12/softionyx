import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Header() {
  const location = useLocation();
  const { user, isAuthenticated, logout, loadUser } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !user) {
      loadUser().catch((error) => {
        // Silently fail - user might not be loaded yet
        console.error('Failed to load user:', error);
      });
    }
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 border-b transition-all duration-300 ${
      isScrolled 
        ? 'border-white/10 bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-indigo-500/5' 
        : 'border-white/5 bg-slate-950/70 backdrop-blur-xl'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group cursor-pointer overflow-visible">
          <div className="relative flex items-center justify-center overflow-visible">
            <img 
              src="/logo.png" 
              alt="SoftIonyx Logo" 
              className="relative z-10 h-28 md:h-32 w-auto group-hover:opacity-90 transition-opacity duration-300 object-contain drop-shadow-[0_6px_18px_rgba(15,23,42,0.45)]"
              style={{ transform: 'scale(1.2)' }}
            />
          </div>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link 
            to="/services" 
            className={`relative hover:text-white transition-colors duration-200 ${
              location.pathname === '/services' ? 'text-white' : 'text-slate-400'
            }`}
          >
            {location.pathname === '/services' && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500"></span>
            )}
            Services
          </Link>
          <Link 
            to="/solutions" 
            className={`relative hover:text-white transition-colors duration-200 ${
              location.pathname === '/solutions' ? 'text-white' : 'text-slate-400'
            }`}
          >
            {location.pathname === '/solutions' && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500"></span>
            )}
            Solutions
          </Link>
          <Link 
            to="/store" 
            className={`relative hover:text-white transition-colors duration-200 ${
              location.pathname === '/store' ? 'text-white' : 'text-slate-400'
            }`}
          >
            {location.pathname === '/store' && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500"></span>
            )}
            Store
          </Link>
          <Link 
            to="/about" 
            className={`relative hover:text-white transition-colors duration-200 ${
              location.pathname === '/about' ? 'text-white' : 'text-slate-400'
            }`}
          >
            {location.pathname === '/about' && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500"></span>
            )}
            About
          </Link>
          <Link 
            to="/contact" 
            className={`relative hover:text-white transition-colors duration-200 ${
              location.pathname === '/contact' ? 'text-white' : 'text-slate-400'
            }`}
          >
            {location.pathname === '/contact' && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500"></span>
            )}
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="hidden md:block text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Admin
                </Link>
              )}
              <span className="hidden md:block text-sm font-medium text-slate-400">{user?.full_name}</span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium hover:text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : null}
          
          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="iconify" data-icon={isMobileMenuOpen ? "lucide:x" : "lucide:menu"} data-width="24"></span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-slate-950/95 backdrop-blur-xl">
          <div className="px-6 py-4 space-y-4">
            <Link to="/services" className="block text-sm font-medium hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
            <Link to="/solutions" className="block text-sm font-medium hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Solutions</Link>
            <Link to="/store" className="block text-sm font-medium hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Store</Link>
            <Link to="/about" className="block text-sm font-medium hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link to="/contact" className="block text-sm font-medium hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="block text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Admin</Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block text-sm font-medium hover:text-white transition-colors w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
}
