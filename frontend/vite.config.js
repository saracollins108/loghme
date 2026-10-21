import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const previewMode = process.env.BASE44_PREVIEW_MODE === '1';
const sandboxHosts =
  previewMode && process.env.BASE44_SANDBOX_HOST_DOMAIN
    ? ['.' + process.env.BASE44_SANDBOX_HOST_DOMAIN]
    : [];

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: sandboxHosts,
    proxy: {
      '/api': {
        target: 'http://api:4000',
        changeOrigin: true,
      },
    },
  },
});
