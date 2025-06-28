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
    strictPort: true,
    watch: {
      ignored: ["**/tmp/**"]
    }
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxmYWN1bHR5XFxcXEdQXFxcXE5ldyBmb2xkZXJcXFxcRGVzMnJhY3QtVG9vbFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcZmFjdWx0eVxcXFxHUFxcXFxOZXcgZm9sZGVyXFxcXERlczJyYWN0LVRvb2xcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2ZhY3VsdHkvR1AvTmV3JTIwZm9sZGVyL0RlczJyYWN0LVRvb2wvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCJcclxuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gXCJAdGFpbHdpbmRjc3Mvdml0ZVwiXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHRhaWx3aW5kY3NzKCksXHJcbiAgICByZWFjdCgpXHJcbiAgXSxcclxuICBiYXNlOiBcIi4vXCIsXHJcbiAgZGVmaW5lOiB7XHJcbiAgICBQUk9KRUNUU19ESVI6IEpTT04uc3RyaW5naWZ5KFwicHJvamVjdHNcIiksXHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgb3V0RGlyOiBcImRpc3QtcmVhY3RcIixcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgcG9ydDogNTEyMyxcclxuICAgIHN0cmljdFBvcnQ6IHRydWUsXHJcbiAgICB3YXRjaDoge1xyXG4gICAgICBpZ25vcmVkOiBbICcqKi90bXAvKionIF1cclxuICAgIH1cclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnVCxTQUFTLG9CQUFvQjtBQUM3VSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8saUJBQWlCO0FBSHhCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLFlBQVk7QUFBQSxJQUNaLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxNQUFNO0FBQUEsRUFDTixRQUFRO0FBQUEsSUFDTixjQUFjLEtBQUssVUFBVSxVQUFVO0FBQUEsRUFDekM7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixPQUFPO0FBQUEsTUFDTCxTQUFTLENBQUUsV0FBWTtBQUFBLElBQ3pCO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
