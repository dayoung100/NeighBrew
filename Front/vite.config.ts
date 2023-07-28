import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
// import dns from "dns";

// dns.setDefaultResultOrder("verbatim");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA()],
  server: {
    proxy: {
      "/api": {
        target: "http://server:9999/",
        changeOrigin: true,
        secure: false,
        // rewrite: path => path.replace(/^\/api/, ""),
      },
    },
  },
  // define: {
  //   global: {},
  // },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
    },
  },
});
