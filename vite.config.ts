import { defineConfig } from 'vite'
// @ts-ignore - path is available in Node.js runtime
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      // @ts-ignore - __dirname is available in Node.js runtime
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // 1. Safeddara API (User API)
      '/api': {
        target: 'https://api.safeddara.tj',
        changeOrigin: true,
        secure: true,
        timeout: 120000, // 120 seconds timeout (увеличено для медленных запросов)
        ws: false, // Отключить WebSocket прокси
        // Keep /api prefix - don't rewrite
        configure: (proxy: any) => {
          proxy.on('error', (err: any) => {
            console.error('[Proxy Error]', err.message);
          });
          proxy.on('proxyReq', (proxyReq: any, req: any) => {
            // Убеждаемся что все заголовки передаются
            if (req.headers['content-type']) {
              proxyReq.setHeader('Content-Type', req.headers['content-type']);
            }
          });
        },
      },
      
      // 2. Backend API (Admin API) - если используется
      '/api-aux': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api-aux/, '/api'),
        configure: (proxy: any) => {
          proxy.on('error', (err: any) => {
            console.error('[Proxy Error] /api-aux -> localhost:3001:', err.message);
          });
        },
      },
      
      // 3. Загрузка файлов с backend - если используется
      '/backend-uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/backend-uploads/, '/uploads'),
        configure: (proxy: any) => {
          proxy.on('error', (err: any) => {
            console.error('[Proxy Error] /backend-uploads -> localhost:3001:', err.message);
          });
        },
      },
    },
  },
})
