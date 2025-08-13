import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
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
});
