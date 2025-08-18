// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initFirebase, getFirebaseApp } from "@/firebase";
import { isSupported, getMessaging, getToken } from "firebase/messaging";
import { onMessageListener } from "@/utils/fcm";

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

(async () => {
  try {
    // 1) Firebase 초기화
    await initFirebase();
    console.log("[Firebase] 초기화 완료");

    // 2) SW 등록 (dev=dev-sw.js?dev-sw [module], prod=sw.js [classic])
    if (!("serviceWorker" in navigator)) return;

    const isDev = import.meta.env.DEV;
    const swUrl = isDev ? "/dev-sw.js?dev-sw" : "/sw.js";

    // 반대편 SW 정리(선택)
    for (const r of await navigator.serviceWorker.getRegistrations()) {
      const url = r.active?.scriptURL || "";
      if (isDev ? url.includes("/sw.js") : url.includes("/dev-sw")) {
        await r.unregister();
      }
    }

    const reg = await navigator.serviceWorker.register(swUrl, {
      type: isDev ? "module" : "classic",
      scope: "/",
    });
    console.log("[SW] register ok:", reg.scope);

    // 3) SW가 이 탭을 제어하면 DB→페이지로 복원 요청
    const flush = () => reg.active?.postMessage({ type: "fcm-flush" });

    if (navigator.serviceWorker.controller) flush();
    else {
      const once = () => {
        navigator.serviceWorker.removeEventListener("controllerchange", once);
        flush();
      };
      navigator.serviceWorker.addEventListener("controllerchange", once);
    }
    // 탭 재포커스/다시 보일 때도 복원
    window.addEventListener("focus", flush);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") flush();
    });

    // 4) FCM: 이 등록(reg)과 묶어서 토큰 발급 + 포그라운드 수신은 항상 SW에 저장
    const supported = await isSupported().catch(() => false);
    if (supported) {
      const app = getFirebaseApp()!;
      const msg = getMessaging(app);

      // 포그라운드 → SW IndexedDB 저장 (배너가 없어도 저장됨)
      onMessageListener((payload) => {
        console.log("[FCM][fg] payload → SW 저장", payload);
        reg.active?.postMessage({ type: "fcm-save", payload });
      });

      const token = await getToken(msg, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: reg, // ★ 이 탭의 SW와 바인딩
      });
      console.log("[FCM] token:", token);
    }

    // 5) SW → 페이지 메시지 전역 브리지 (배너는 이 이벤트만 들으면 됨)
    const onSwMessage = (ev: MessageEvent) => {
      window.dispatchEvent(new CustomEvent("coffect:fcm", { detail: ev.data }));
    };
    navigator.serviceWorker.addEventListener("message", onSwMessage);
    window.addEventListener("message", onSwMessage);
  } catch (err) {
    console.error("[Bootstrap] 초기화 실패:", err);
  }
})();
