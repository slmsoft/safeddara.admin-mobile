import { defineConfig, loadEnv } from 'vite'
// @ts-ignore - path is available in Node.js runtime
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [
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
      proxy: {},
    },
  }
})
