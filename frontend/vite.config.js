// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['emoji-mart'],  // Ensure emoji-mart is bundled correctly
  },
  esbuild: {
    target: 'esnext',  // Ensure modern JavaScript features are supported
  },
});
