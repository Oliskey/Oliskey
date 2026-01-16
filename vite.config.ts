import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // Listen on 0.0.0.0 (all interfaces). Fixes 'refused to connect' in most environments.
    port: 5173,        // Hardcoded port
    strictPort: true,  // Fail if 5173 is busy (preserves Auth redirects)
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});