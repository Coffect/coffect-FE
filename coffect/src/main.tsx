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
      // (중요) 예전에 켜져 있던 vite PWA dev-sw가 있으면 제거
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const r of regs) {
        if (r.active?.scriptURL.includes("dev-sw")) {
          await r.unregister();
        }
      }

      // ★ 여기서 우리 FCM SW만 등록
      const swUrl = import.meta.env.DEV
        ? "/src/firebase-messaging-sw.ts" // dev에서는 TS 그대로
        : "/firebase-messaging-sw.js"; // build 산출물

      const reg = await navigator.serviceWorker.register(swUrl, {
        type: "module",
        scope: "/", // 루트 스코프
      });
      console.log("[SW] register ok:", reg.scope);

      // SW가 이 페이지를 컨트롤 잡으면 누적 FCM flush
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
