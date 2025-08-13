import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";

let messaging: Messaging | null = null;
let app: FirebaseApp | null = null;

export const initFirebase = async () => {
  try {
    // Firebase 앱 초기화 및 인스턴스 저장
    app = initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    });

    console.log("[FCM] Firebase 앱 초기화 완료:", app.name);

    const supported = await isSupported().catch(() => false);
    console.log("[FCM] isSupported:", supported);

    if (supported) {
      messaging = getMessaging(app);
      console.log("[FCM] getMessaging OK:", !!messaging);
    } else {
      console.warn("[FCM] Firebase Messaging이 지원되지 않는 환경입니다.");
    }
  } catch (error) {
    console.error("[FCM] Firebase 초기화 실패:", error);
    throw error;
  }
};

export const getMessagingOrNull = () => messaging;
export const getFirebaseApp = () => app;
