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
    proxy: {},
  },
})
