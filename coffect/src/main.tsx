import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initFirebase } from "@/firebase";

const root = createRoot(document.getElementById("root")!);

// 1) 먼저 렌더해서 흰 화면 방지
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// 2) 그 다음 비동기로 Firebase + SW 등록
(async () => {
  try {
    await initFirebase();
    console.log("[Firebase] 초기화 완료");

    if ("serviceWorker" in navigator) {
      const isDev = import.meta.env.DEV;

      // ★ (중요) '현재 모드의 반대편' SW만 정리
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const r of regs) {
        const url = r.active?.scriptURL || "";
        if (
          isDev
            ? url.includes("firebase-messaging-sw") // dev에서는 prod SW만 제거
            : url.includes("dev-sw")
        ) {
          // prod에서는 dev-sw만 제거
          await r.unregister();
        }
      }

      // ★ dev는 dev-sw, prod는 빌드 산출물
      const swUrl = isDev ? "/dev-sw.js?dev-sw" : "/firebase-messaging-sw.js";

      const reg = await navigator.serviceWorker.register(swUrl, {
        // ★ dev-sw는 ESM이므로 module로! (prod도 모듈 SW면 그대로 module 유지)
        type: isDev ? "module" : "classic", // prod 파일이 classic이면 classic, ESM이면 "module"로 변경
        scope: "/",
      });
      console.log("[SW] register ok:", reg.scope);

      // SW가 페이지를 잡으면 FCM flush
      const flush = () => reg.active?.postMessage({ type: "fcm-flush" });
      if (navigator.serviceWorker.controller) {
        flush();
      } else {
        const once = () => {
          navigator.serviceWorker.removeEventListener("controllerchange", once);
          console.log("[SW] now controlling this page");
          flush();
        };
        navigator.serviceWorker.addEventListener("controllerchange", once);
      }
    }
  } catch (err) {
    console.error("[Bootstrap] 초기화 실패:", err);
  }
})();
