import path from "path";

import { defineConfig } from "vite";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "./src/app"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@widgets": path.resolve(__dirname, "./src/widgets"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@entities": path.resolve(__dirname, "./src/entities"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@i18n": path.resolve(__dirname, "./src/shared/i18n"),
      "@ui": path.resolve(__dirname, "./src/shared/ui"),
      "@lib": path.resolve(__dirname, "./src/shared/lib"),
    },
  },
  plugins: [react(), tailwindcss()],
});
