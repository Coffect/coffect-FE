/*
  desc: iOS PWA에서 알림 권한 요청 + FCM 토큰 발급 버튼
*/
import { useState } from "react";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { getFirebaseApp, initFirebase } from "@/firebase";

const nav = navigator as Navigator & { standalone?: boolean };
const isPWA =
  window.matchMedia?.("(display-mode: standalone)")?.matches === true ||
  nav.standalone === true;

export const PushEnableButton: React.FC = () => {
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    setBusy(true);
    try {
      if (!isPWA) {
        alert("홈 화면 아이콘으로 실행한 상태에서만 알림을 켤 수 있어요.");
        return;
      }
      if (!("serviceWorker" in navigator)) {
        alert("이 기기는 Service Worker를 지원하지 않습니다.");
        return;
      }

      // 0) Firebase (이미 초기화되어 있더라도 안전하게 보장)
      await initFirebase().catch(() => {});
      const app = getFirebaseApp();
      if (!app) {
        alert("Firebase 초기화에 실패했습니다.");
        return;
      }

      // 1) 권한 요청 (반드시 사용자 클릭 안)
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        alert("알림 권한이 필요합니다. iOS 설정 > 알림에서 허용해 주세요.");
        return;
      }

      // 2) 현재 등록된 SW 확보 (+ 활성 상태 보장)
      let reg = await navigator.serviceWorker.getRegistration();
      if (!reg) {
        // 아직 등록 전이면 루트로 등록 시도
        reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      }

      // reg.active가 없을 수 있으므로 controllerchange까지 대기
      if (!navigator.serviceWorker.controller) {
        await new Promise<void>((resolve) => {
          const once = () => {
            navigator.serviceWorker.removeEventListener(
              "controllerchange",
              once,
            );
            resolve();
          };
          navigator.serviceWorker.addEventListener("controllerchange", once);
        });
      }

      // 3) 브라우저 FCM 지원 확인
      const supported = await isSupported().catch(() => false);
      if (!supported) {
        alert("이 환경은 Web Push 미지원(iOS 16.4+ 필요).");
        return;
      }

      // 4) 토큰을 “현재 SW registration”에 바인딩하여 발급
      const messaging = getMessaging(app);
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: reg!,
      });

      if (!token) {
        alert("FCM 토큰 발급에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }

      console.log("[FCM] token:", token);

      // SW에 flush 요청(IndexedDB→페이지 복원)
      reg!.active?.postMessage({ type: "fcm-flush" });

      alert("알림이 켜졌습니다! 이제 푸시가 오면 배너도 표시돼요.");
    } catch {
      console.error("[PushEnableButton] error");
      alert(`알림 설정 중 오류가 발생했습니다.`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={busy}
      className="rounded-xl bg-black px-4 py-2 text-white"
    >
      {busy ? "설정 중..." : "알림 켜기"}
    </button>
  );
};

export default PushEnableButton;
