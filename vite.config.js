import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    assetsInlineLimit: 2048,
    cssCodeSplit: false,
    sourcemap: false,
    manifest: true,
  },
  ssr: { noExternal: ['react-router-dom', 'react-router'] },
});
