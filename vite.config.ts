import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base relativo: funciona en GitHub Pages, Vercel, Netlify o abriendo /dist
export default defineConfig({
  plugins: [react()],
  base: './',
});
