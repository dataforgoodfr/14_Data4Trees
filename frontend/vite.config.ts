import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      "@assets": path.resolve(__dirname, './src/assets'),
      "@entities": path.resolve(__dirname, './src/entities'),
      "@features": path.resolve(__dirname, './src/features'),
      "@widgets": path.resolve(__dirname, './src/widgets'),
      "@pages": path.resolve(__dirname, './src/pages'),
    },
  },
  plugins: [react()],
})
