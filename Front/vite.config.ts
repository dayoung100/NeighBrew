import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA()],
  server: {
    proxy: {
      "/user": {
        target: "34.64.126.58",
        changeOrigin: true,
      },
    },
  },
});
