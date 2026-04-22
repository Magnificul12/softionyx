import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Keep the main entry chunk smaller for better LCP/INP.
          // Heavy 3D/Spline code should load only when needed.
          if (id.includes('node_modules')) {
            if (id.includes('@splinetool')) return 'spline';
            if (id.includes('three')) return 'three';
            if (id.includes('react-router')) return 'router';
            if (id.includes('i18next')) return 'i18n';
            if (id.includes('leaflet') || id.includes('react-leaflet')) return 'maps';
            if (id.includes('howler')) return 'audio';
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    host: true, // Allow access from network
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path,
      },
      '/sitemap.xml': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/sitemap-pages.xml': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/sitemap-blog.xml': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/robots.txt': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});

