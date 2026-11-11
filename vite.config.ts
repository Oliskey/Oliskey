import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // three.js and the 3D layer load only on pages that show a 3D environment
        manualChunks: { three: ['three'], r3f: ['@react-three/fiber', '@react-three/drei'], gsap: ['gsap'] },
      },
    },
  },
});
