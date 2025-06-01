import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react()
  ].filter(Boolean),
  define: {
    __BASE_URL__: JSON.stringify("/Conscience")
  },
  build: {
    outDir: "docs",
  },
  base: '/Conscience',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
}));
