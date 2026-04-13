// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/auth-service': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/auth-service/, '')
      },
      '/api/worker-service': {
        target: 'http://127.0.0.1:8003',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/worker-service/, '')
      },
      '/api/admin-service': {
        target: 'http://127.0.0.1:8008',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/admin-service/, '')
      },
      '/api/service-management': {
        target: 'http://127.0.0.1:8009',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/service-management/, '')
      },
      '/api/order-service': {
        target: 'http://127.0.0.1:8002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/order-service/, '')
      },
      '/api/review-service': {
        target: 'http://127.0.0.1:8007',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/review-service/, '')
      },
      '/api/payment-service': {
        target: 'http://127.0.0.1:8006', // Cổng của Payment Service
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/payment-service/, '')
      }
    }
  }
})