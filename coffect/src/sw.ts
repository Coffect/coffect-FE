/// <reference lib="webworker" />
export {};

// 기존 선언 유지
declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: readonly string[];
};

import { precacheAndRoute } from "workbox-precaching";
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// ===== Workbox 프리캐시 자원 주입 (기존) =====
precacheAndRoute(self.__WB_MANIFEST);

// ===== Firebase Config / Init (기존) =====
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
initializeApp(firebaseConfig);
const messaging = getMessaging();

/* ------------------------------------------------------------------ */
/* ★ 24시간 보관용 IndexedDB 유틸                                    */
/* ------------------------------------------------------------------ */
const DB_NAME = "coffect-fcm";
const STORE = "suggests";
const TTL_MS = 24 * 60 * 60 * 1000; // 24h

type FcmPayload = {
  data?: Record<string, string | number | boolean | undefined>;
  notification?: {
    title?: string;
    body?: string;
    image?: string;
  };
};
type StoredItem = {
  cardId: string;
  ts: number; // 저장 시각
  payload: FcmPayload; // FCM payload (원본)
};

// 단순 IndexedDB 오픈/트랜잭션 헬퍼
function openDB(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "cardId" });
      }
    };
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}
async function txRW() {
  const db = await openDB();
  return db.transaction(STORE, "readwrite").objectStore(STORE);
}
async function putItem(item: StoredItem) {
  const store = await txRW();
  await new Promise<void>((res, rej) => {
    const req = store.put(item);
    req.onsuccess = () => res();
    req.onerror = () => rej(req.error);
  });
}
async function getAll(): Promise<StoredItem[]> {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, "readonly");
    const st = tx.objectStore(STORE);
    const req = st.getAll();
    req.onsuccess = () => res((req.result as StoredItem[]) || []);
    req.onerror = () => rej(req.error);
  });
}
async function deleteById(cardId: string) {
  const store = await txRW();
  await new Promise<void>((res, rej) => {
    const req = store.delete(cardId);
    req.onsuccess = () => res();
    req.onerror = () => rej(req.error);
  });
}
async function pruneExpired(): Promise<void> {
  const items = await getAll();
  const now = Date.now();
  await Promise.all(
    items.filter((i) => now - i.ts > TTL_MS).map((i) => deleteById(i.cardId)),
  );
}

/* ------------------------------------------------------------------ */
/* ★ cardId 산출 유틸 — 페이지와 동일 규칙 사용                      */
/* ------------------------------------------------------------------ */
function buildCardIdFromPayload(payload: FcmPayload): string {
  const d = payload?.data || {};
  const raw = d.coffectId ?? d.coffeeChatId ?? d.coffeeid ?? Date.now();
  return String(raw);
}

/* ------------------------------------------------------------------ */
/* ★ 클라이언트(모든 탭)로 전달                                       */
/* ------------------------------------------------------------------ */
async function broadcastToClients(msg: {
  payload?: FcmPayload;
  payloads?: FcmPayload[];
}) {
  const clientList = await self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });
  for (const c of clientList) {
    (c as WindowClient).postMessage(msg);
  }
}

/* ------------------------------------------------------------------ */
/* ★ 백그라운드 메시지 수신 시: 저장 + 브로드캐스트                  */
/* ------------------------------------------------------------------ */
onBackgroundMessage(messaging, async (payload) => {
  try {
    const cardId = buildCardIdFromPayload(payload);
    const item: StoredItem = { cardId, ts: Date.now(), payload };
    await putItem(item);
    await pruneExpired(); // 오래된 것 정리
    await broadcastToClients({ payload }); // 새로 온 것 즉시 페이지로도 전파

    // 알림 표시(기존)
    const { title, body, icon } = payload.notification ?? {};
    const notificationTitle = title ?? "새 알림";
    const notificationOptions: NotificationOptions = {
      body: body ?? "",
      icon: icon ?? "/favicon.ico",
      data: payload.data ?? {},
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
  } catch {
    console.error("[SW] 백그라운드 메시지 처리 실패:", payload);
  }
});

/* ------------------------------------------------------------------ */
/* ★ 페이지 → SW 메시지 처리                                          */
/*   - fcm-flush  : 24h 이내 저장분을 모두 보내기                     */
/*   - fcm-delete : 특정 cardId 삭제                                  */
/* ------------------------------------------------------------------ */
self.addEventListener("message", (ev: ExtendableMessageEvent) => {
  const data = (ev.data || {}) as { type?: string; cardId?: string };
  if (data.type === "fcm-flush") {
    ev.waitUntil(
      (async () => {
        await pruneExpired();
        const items = await getAll();
        // 최신순 정렬
        items.sort((a, b) => b.ts - a.ts);
        await broadcastToClients({
          payloads: items.map((i) => i.payload),
        });
      })(),
    );
  } else if (data.type === "fcm-delete" && data.cardId) {
    ev.waitUntil(deleteById(data.cardId));
  }
});

/* ------------------------------------------------------------------ */
/* (선택) activate에서 만료분 정리                                     */
/* ------------------------------------------------------------------ */
self.addEventListener("activate", (event) => {
  event.waitUntil(pruneExpired());
});

// ===== 기존 알림 클릭 처리 (그대로) =====
self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();
  const data = event.notification.data as { click_action?: string } | undefined;
  const urlToOpen = data?.click_action ?? "/";
  event.waitUntil(
    (async () => {
      const clientList = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      const isWindowClient = (c: Client): c is WindowClient => "focus" in c;
      for (const client of clientList) {
        if (isWindowClient(client)) {
          await client.focus();
          return;
        }
      }
      await self.clients.openWindow?.(urlToOpen);
    })(),
  );
});
