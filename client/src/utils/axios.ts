import axios from 'axios';

// Configure axios defaults
// - Development: Vite proxy trimite /api către backend (baseURL '').
// - Producție (softionyx.com): același domeniu, nginx face proxy /api -> Node (baseURL '').
// - Dacă VITE_API_URL e setat (ex. alt domeniu pentru API), folosește-l.
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Mereu URL relativ – request-urile merg la același host (localhost cu proxy sau domeniu live)
  return '';
};

const baseURL = getBaseURL();
axios.defaults.baseURL = baseURL;
axios.defaults.timeout = 30000; // Increased timeout
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const lang = localStorage.getItem('i18nextLng');
    if (lang) {
      config.headers['Accept-Language'] = lang;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      // But don't redirect if we're already on login/register page or if it's an auth endpoint
      const currentPath = window.location.pathname;
      const isAuthEndpoint = error.config?.url?.includes('/api/auth/');
      
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      
      // Only redirect if not already on auth pages and not calling auth endpoints
      if (currentPath !== '/login' && currentPath !== '/register' && !isAuthEndpoint) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
