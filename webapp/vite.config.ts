import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      "@providers": path.resolve(__dirname, './src/app/providers'),
      '@components': path.resolve(__dirname, './src/components'),
      "@assets": path.resolve(__dirname, './src/assets'),
      "@pages": path.resolve(__dirname, './src/pages'),
    },
  },
  plugins: [
    react(),
    tailwindcss()
  ],
})
