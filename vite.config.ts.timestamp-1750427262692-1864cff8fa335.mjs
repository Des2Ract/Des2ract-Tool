// vite.config.ts
import { defineConfig } from "file:///D:/faculty/GP/New%20folder/Des2ract-Tool/node_modules/vite/dist/node/index.js";
import react from "file:///D:/faculty/GP/New%20folder/Des2ract-Tool/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import tailwindcss from "file:///D:/faculty/GP/New%20folder/Des2ract-Tool/node_modules/@tailwindcss/vite/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\faculty\\GP\\New folder\\Des2ract-Tool";
var vite_config_default = defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  base: "./",
  define: {
    PROJECTS_DIR: JSON.stringify("projects")
  },
  build: {
    outDir: "dist-react"
  },
  server: {
    port: 5123,
    strictPort: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxmYWN1bHR5XFxcXEdQXFxcXE5ldyBmb2xkZXJcXFxcRGVzMnJhY3QtVG9vbFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcZmFjdWx0eVxcXFxHUFxcXFxOZXcgZm9sZGVyXFxcXERlczJyYWN0LVRvb2xcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2ZhY3VsdHkvR1AvTmV3JTIwZm9sZGVyL0RlczJyYWN0LVRvb2wvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCJcclxuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gXCJAdGFpbHdpbmRjc3Mvdml0ZVwiXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHRhaWx3aW5kY3NzKCksXHJcbiAgICByZWFjdCgpXHJcbiAgXSxcclxuICBiYXNlOiBcIi4vXCIsXHJcbiAgZGVmaW5lOiB7XHJcbiAgICBQUk9KRUNUU19ESVI6IEpTT04uc3RyaW5naWZ5KFwicHJvamVjdHNcIiksXHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgb3V0RGlyOiBcImRpc3QtcmVhY3RcIixcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgcG9ydDogNTEyMyxcclxuICAgIHN0cmljdFBvcnQ6IHRydWUsXHJcbiAgfSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBZ1QsU0FBUyxvQkFBb0I7QUFDN1UsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixPQUFPLGlCQUFpQjtBQUh4QixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxZQUFZO0FBQUEsSUFDWixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsTUFBTTtBQUFBLEVBQ04sUUFBUTtBQUFBLElBQ04sY0FBYyxLQUFLLFVBQVUsVUFBVTtBQUFBLEVBQ3pDO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLEVBQ2Q7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
