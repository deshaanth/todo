import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listens on all network addresses (0.0.0.0) for phone access
    port: 3000,
    open: true,
    watch: {
      ignored: ['**/android/**']
    }
  }
});
