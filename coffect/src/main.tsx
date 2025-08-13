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

// 2) Firebase 초기화 + SW 등록
(async () => {
  try {
    await initFirebase();
    console.log("[Firebase] 초기화 완료");

    if ("serviceWorker" in navigator) {
      const isDev = import.meta.env.DEV;

      // ★ 현재 모드 반대편 SW 제거
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const r of regs) {
        const url = r.active?.scriptURL || "";
        if (isDev ? url.includes("sw.js") : url.includes("dev-sw")) {
          await r.unregister();
        }
      }

      // ★ dev는 dev-sw, prod는 sw.js(PWA+FCM 통합)
      const swUrl = isDev ? "/dev-sw.js?dev-sw" : "/sw.js";

      const reg = await navigator.serviceWorker.register(swUrl, {
        type: isDev ? "module" : "classic", // dev-sw는 ESM
        scope: "/",
      });
      console.log("[SW] register ok:", reg.scope);

      // SW 활성화 시점에 FCM flush
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
