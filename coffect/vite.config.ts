import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";
// https://vitejs.dev/config/
export default defineConfig(() => {
  const serverTarget =
    process.env.VITE_SERVER_API_URL || "http://13.124.169.70:3000";
  return {
    plugins: [
      react(),
      tailwindcss(),
      tsconfigPaths(),
      VitePWA({
        strategies: "injectManifest",
        srcDir: "src",
        filename: "firebase-messaging-sw.ts",
        registerType: "autoUpdate",
        injectRegister: null,
        devOptions: {
          enabled: true,
          type: "module",
        },
      }),
    ],
    build: {
      outDir: "dist",
    },
    server: {
      proxy: {
        // API 프록시
        "/api": {
          target: serverTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        // 소켓 프록시
        "/socket.io": {
          target: serverTarget,
          changeOrigin: true,
          ws: true, // WebSocket 지원
        },
      },
    },
  };
});
