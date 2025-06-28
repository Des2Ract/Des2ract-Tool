import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  base: "./",
  define: {
    PROJECTS_DIR: JSON.stringify("projects"),
  },
  build: {
    outDir: "dist-react",
  },
  server: {
    port: 5123,
    strictPort: true,
    watch: {
      ignored: [ '**/tmp/**' ]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
