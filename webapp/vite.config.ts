import path from "path";

import { defineConfig } from "vite";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@providers": path.resolve(__dirname, "./src/app/providers"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@widgets": path.resolve(__dirname, "./src/widgets"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@ui": path.resolve(__dirname, "./src/components/ui"),
    },
  },
  plugins: [react(), tailwindcss()],
});
