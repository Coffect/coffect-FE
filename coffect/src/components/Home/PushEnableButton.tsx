// PushEnableButton.tsx
/*
  desc: iOS PWA에서 알림 권한 요청 + FCM 토큰 발급 버튼
*/
import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const nav = navigator as Navigator & { standalone?: boolean };
const isPWA =
  window.matchMedia?.("(display-mode: standalone)")?.matches === true ||
  nav.standalone === true;

export const PushEnableButton: React.FC = () => {
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    try {
      setBusy(true);

      if (!isPWA) {
        alert(
          "홈 화면 아이콘으로 실행된 상태에서만 알림을 켤 수 있어요.\n사파리 → 홈 화면에 추가 후 아이콘으로 실행해 주세요.",
        );
        return;
      }

      if (!("serviceWorker" in navigator)) {
        alert("이 기기/브라우저는 Service Worker를 지원하지 않습니다.");
        return;
      }

      const supported = await isSupported();
      if (!supported) {
        alert("이 환경은 Web Push 미지원(iOS 16.4+ 필요).");
        return;
      }

      // 1) 권한 요청 (반드시 사용자 클릭 안에서 호출)
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        alert("알림 권한이 거부되었습니다. iOS 설정 > 알림에서 허용해 주세요.");
        return;
      }

      // 2) SW 등록 확인
      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) {
        alert("서비스워커가 아직 활성화되지 않았습니다. 앱을 재시작해 주세요.");
        return;
      }

      // 3) Firebase 초기화 + 토큰 발급
      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY, // 환경변수에 넣어둔 VAPID 공개키
        serviceWorkerRegistration: reg,
      });

      if (!token) {
        alert("FCM 토큰을 받지 못했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }

      console.log("[FCM] token:", token);
      alert("알림이 켜졌습니다! 이제 푸시가 오면 배너도 함께 떠요.");

      // TODO: 여기서 서버에 토큰 등록 API 호출
      // await api.post('/user/registerFcm', { token })
    } catch (e) {
      console.error(e);
      alert("알림 설정 중 오류가 발생했습니다.");
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
