/*
  author      : 썬더
  description : FCM 백그라운드 SW (Vite 번들 포함 버전)
                - import.meta.env 사용 가능
                - onBackgroundMessage → showNotification
*/
/// <reference lib="webworker" />
export {};
declare const self: ServiceWorkerGlobalScope;

import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// ========== 변수 ==========
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// ========== 함수 ==========
initializeApp(firebaseConfig);

const messaging = getMessaging();

onBackgroundMessage(messaging, (payload) => {
  const { title, body, icon } = payload.notification ?? {};
  const notificationTitle = title ?? "새 알림";
  const notificationOptions: NotificationOptions = {
    body: body ?? "",
    icon: icon ?? "/favicon.ico",
    data: payload.data ?? {},
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 알림 클릭 처리(옵션)
self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();

  // 서버에서 data.click_action 으로 보낸 경우 사용
  const data = event.notification.data as { click_action?: string } | undefined;
  const urlToOpen = data?.click_action ?? "/";

  event.waitUntil(
    (async () => {
      const clientList = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      }); // clientList: readonly Client[]

      // type guard: Client → WindowClient
      const isWindowClient = (c: Client): c is WindowClient => "focus" in c;

      for (const client of clientList) {
        if (isWindowClient(client)) {
          await client.focus();
          return;
        }
      }
      // 열려있는 창이 없으면 새 창 오픈
      await self.clients.openWindow?.(urlToOpen);
    })(),
  );
});
