import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AnalyticsTracker from './components/AnalyticsTracker';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home'; // Eager-load home (highest priority, always LCP page)
import { LangProvider, normalizeLang, stripLangPrefix } from './i18n/routing';

// Lazy-loaded routes: split into separate chunks and fetched on navigation.
// Result: initial bundle shrinks by ~30-40%, LCP improves.
const About = lazy(() => import('./pages/About'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Solutions = lazy(() => import('./pages/Solutions'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Careers = lazy(() => import('./pages/Careers'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const Login = lazy(() => import('./pages/Login'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

function RouteFallback() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="h-10 w-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-400 animate-spin" />
    </div>
  );
}

function LangShell() {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const location = useLocation();
  const resolved = normalizeLang(lang);

  // Keep i18n language in sync with the URL segment.
  useEffect(() => {
    if (normalizeLang(i18n.resolvedLanguage || i18n.language) !== resolved) {
      i18n.changeLanguage(resolved).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolved]);

  // If someone hits an unsupported language, rewrite to /ro/... keeping rest.
  if (!lang || normalizeLang(lang) !== lang) {
    const rest = stripLangPrefix(location.pathname);
    return <Navigate to={`/ro${rest === '/' ? '' : rest}${location.search}`} replace />;
  }

  return (
    <LangProvider lang={resolved}>
      <ScrollToTop />
      <AnalyticsTracker />
      <div className="font-['Inter'] text-slate-300 antialiased selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden min-h-screen">
        <Header />
        <main className="relative z-10">
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
    </LangProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* Legacy entrypoints without lang prefix */}
          <Route path="/" element={<Navigate to="/ro" replace />} />
          <Route path="/:lang" element={<LangShell />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/:slug" element={<ServiceDetail />} />
            <Route path="solutions" element={<Solutions />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="careers" element={<Careers />} />
            <Route path="blog" element={<Blog />} />
            <Route
              path="blog/wordpress-vs-custom-moldova-2026"
              element={<Navigate to="../cms-vs-dezvoltare-custom-2026" replace />}
            />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privacy" element={<LegalPage />} />
            <Route path="terms" element={<LegalPage />} />
            <Route path="cookies" element={<LegalPage />} />
            <Route path="register" element={<Navigate to="../login" replace />} />
            <Route path="login" element={<Login />} />
            <Route path="admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          {/* Catch-all: redirect to default language */}
          <Route path="*" element={<Navigate to="/ro" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
