import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA()],
  server: {
    proxy: {
      "/api": {
        target: "http://34.64.126.58:9999/",
        changeOrigin: true,
        secure: false,
        // rewrite: path => path.replace(/^\/api/, ""),
      },
    },
  },
  define: {
    global: {},
  },
});
