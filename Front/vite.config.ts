import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import dns from "dns";

dns.setDefaultResultOrder("verbatim");
//commit
// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd()); // env 사용위해 추가
  return defineConfig({
    plugins: [react(), VitePWA()],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
          // rewrite: path => path.replace(/^\/api/, ""),
        },
      },
    },
    define: {
      _global: {},
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: "globalThis",
        },
      },
    },
  });
};
