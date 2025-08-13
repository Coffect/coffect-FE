import { getMessagingOrNull } from "@/firebase";
import { getToken, deleteToken, onMessage } from "firebase/messaging";
import type { MessagePayload } from "firebase/messaging";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string;
export type FcmPayload = MessagePayload;

/* 토큰 발급 (디버그 로그 포함) */
export const getFcmToken = async (): Promise<string | null> => {
  try {
    console.log("[FCM] 토큰 발급 시작");

    if (!("Notification" in window)) {
      console.warn("[FCM] Notification API 미지원 환경");
      return null;
    }

    console.log("[FCM] 현재 알림 권한 상태:", Notification.permission);
    const permission = await Notification.requestPermission();
    console.log("[FCM] 알림 권한 요청 결과:", permission);
    if (permission !== "granted") {
      console.warn("[FCM] 알림 권한 거부됨");
      return null;
    }

    const messaging = getMessagingOrNull();
    console.log("[FCM] messaging 객체:", messaging);
    if (!messaging) {
      console.error(
        "[FCM] messaging이 null - initFirebase 실행 여부 확인 필요",
      );
      return null;
    }

    console.log("[FCM] Service Worker 대기 중...");
    const sw = await navigator.serviceWorker.ready;
    console.log("[FCM] Service Worker 준비 완료:", sw.scope);

    console.log("[FCM] VAPID 키 존재 여부:", !!VAPID_KEY);
    if (!VAPID_KEY) {
      console.error("[FCM] VAPID 키가 비어있음");
    }

    console.log("[FCM] getToken 요청 시작");
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: sw,
    });

    console.log("[FCM] 발급된 토큰:", token);
    return token ?? null;
  } catch (err) {
    console.error("[FCM] getFcmToken 에러:", err);
    return null;
  }
};

/* 포그라운드 메시지 리스너 */
export const onMessageListener = (cb: (payload: FcmPayload) => void) => {
  const messaging = getMessagingOrNull();
  if (!messaging) {
    console.warn("[FCM] onMessageListener - messaging이 null");
    return () => {};
  }
  console.log("[FCM] onMessageListener 등록 완료");
  const unsubscribe = onMessage(messaging, (payload) => cb(payload));
  return unsubscribe;
};

/* 토큰 삭제 */
export const deleteFcmToken = async (): Promise<boolean> => {
  const messaging = getMessagingOrNull();
  if (!messaging) {
    console.warn("[FCM] deleteFcmToken - messaging이 null");
    return false;
  }
  try {
    console.log("[FCM] 토큰 삭제 시도");
    const result = await deleteToken(messaging);
    console.log("[FCM] 토큰 삭제 결과:", result);
    return result;
  } catch (err) {
    console.error("[FCM] 토큰 삭제 에러:", err);
    return false;
  }
};
