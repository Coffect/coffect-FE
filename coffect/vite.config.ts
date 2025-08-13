import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    VitePWA({
      // FCM SW 번들(.env 빌드 과정에서 치환되도록)
      strategies: "injectManifest", //직접 작성한 코드 주입(플러그인x)
      srcDir: "src", // 서비스워커 위치
      filename: "firebase-messaging-sw.ts",
      registerType: "autoUpdate", // 새 버전 자동 적용
      injectRegister: null, // ★ 플러그인의 자동 register 스크립트 주입 금지
      devOptions: { enabled: false }, // ★ 개발모드에서 PWA(dev-sw) 완전 비활성
    }),
  ],
  build: {
    outDir: "dist",
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_SERVER_API_URL || "http://13.124.169.70:3000",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },
});
