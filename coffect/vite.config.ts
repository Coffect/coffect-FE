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
        filename: "sw.ts", // 최종 서비스워커 파일명
        injectRegister: null, // index.html 자동 등록 비활성화
        devOptions: { enabled: false }, // 개발 모드에서는 PWA 기능 비활성화 (fcm 배너 개발 시에만 true로 설정할 것)
        manifest: {
          name: "Coffect",
          short_name: "Coffect",
          start_url: "/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#ffffff",
          icons: [
            {
              src: "assets/icons/pwa-192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "assets/icons/pwa-512.png",
              sizes: "512x512",
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
