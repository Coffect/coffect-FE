import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig(() => {
  const serverTarget =
    process.env.VITE_SERVER_API_URL || "http://13.124.169.70:3000";

  return {
    plugins: [
      react(),
      svgr(),
      tailwindcss(),
      tsconfigPaths(),
      VitePWA({
        strategies: "injectManifest", // Workbox가 src/sw.ts를 빌드에 포함
        srcDir: "src",
        filename: "sw.js", // 최종 서비스워커 파일명
        injectRegister: null, // index.html 자동 등록 비활성화
        devOptions: { enabled: true },
        manifest: {
          name: "Coffect",
          short_name: "Coffect",
          start_url: "/",
          scope: "/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#ffffff",
          // @ts-expect-error: Android PWA FCM을 위한 비표준 필드
          gcm_sender_id: "103953800507",

          icons: [
            {
              src: "/icons/pwa-192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/icons/pwa-522.png",
              sizes: "522x522",
              type: "image/png",
              purpose: "any",
            },
          ],
        },
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
