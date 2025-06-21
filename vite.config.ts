import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { json } from "stream/consumers";

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
    // __BASE_URL__: JSON.stringify("/Conscience"),
    __BASE_URL__: JSON.stringify(""),
    __API_URL__: JSON.stringify("https://conscience.pythonanywhere.com"),
    __AUTHOR_WEBSITE__: JSON.stringify("https://originalvondo.github.io/")
    // __API_URL__: JSON.stringify("http://127.0.0.1:8000"),
  },
  build: {
    // outDir: "docs",
  },
  // base: '/Conscience/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
}));
