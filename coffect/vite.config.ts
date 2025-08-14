import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  build: {
    outDir: "dist",
  },
  server: {
    proxy: {
      // API 프록시
      "/api": {
        target: "http://13.124.169.70:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      // 소켓 프록시
      "/socket.io": {
        target: "http://13.124.169.70:3000",
        changeOrigin: true,
        ws: true, // WebSocket 지원
      },
    },
  },

export default defineConfig(() => {
  const serverTarget =
    process.env.VITE_SERVER_API_URL || "http://13.124.169.70:3000";

  return {
    plugins: [
      react(),
      tailwindcss(),
      tsconfigPaths(),
      VitePWA({
        strategies: "injectManifest", // Workbox가 src/sw.ts를 빌드에 포함
        srcDir: "src",
        filename: "sw.js", // 최종 서비스워커 파일명
        injectRegister: null, // index.html 자동 등록 비활성화
        devOptions: { enabled: false },
      }),
    ],
    server: {
      proxy: {
        "/api": {
          target: serverTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "/socket.io": {
          target: serverTarget,
          changeOrigin: true,
          ws: true,
        },
      },
    },
  };
});
