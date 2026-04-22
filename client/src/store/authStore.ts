import { create } from 'zustand';
import axios from '../utils/axios';

interface User {
  id: number;
  email: string;
  full_name: string;
  company_name?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  register: (data: RegisterData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  company_name?: string;
  phone?: string;
}

export const useAuthStore = create<AuthState>((set) => {
  // Load token from localStorage on init
  const savedToken = localStorage.getItem('token');
  if (savedToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
  }

  return {
    user: null,
    token: savedToken,
    isAuthenticated: !!savedToken,

    register: async (data: RegisterData) => {
      try {
        const response = await axios.post('/api/auth/register', data);
        const { token, user } = response.data;
        
        if (!token || !user) {
          throw new Error('Invalid response from server');
        }
        
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        set({ token, user, isAuthenticated: true });
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
        throw new Error(errorMessage);
      }
    },

    login: async (email: string, password: string) => {
      try {
        const response = await axios.post('/api/auth/login', { email, password });
        const { token, user } = response.data;
        
        if (!token || !user) {
          throw new Error('Invalid response from server');
        }
        
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        set({ token, user, isAuthenticated: true });
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || error.message || 'Login failed';
        throw new Error(errorMessage);
      }
    },

    logout: () => {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      set({ token: null, user: null, isAuthenticated: false });
    },

    loadUser: async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ user: null, isAuthenticated: false });
          return;
        }
        
        const response = await axios.get('/api/auth/me');
        set({ user: response.data, isAuthenticated: true });
      } catch (error: any) {
        // Only logout if it's a 401 (unauthorized), not network errors
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          set({ token: null, user: null, isAuthenticated: false });
        }
        // For other errors, just throw so caller can handle it
        throw error;
      }
    },
  };
});

