/*
  author      : 이희선
  description : PWA + FCM 통합 서비스워커
                - Workbox 프리캐시
                - FCM 백그라운드/표준 Web Push/포그라운드 저장 통합
                - 페이지↔SW 메시지(fcm-flush, fcm-delete, fcm-save, fcm-save-many)
                - 알림 requireInteraction, 삭제 버튼 제공
                - 모든 수신 경로에 대해 source(fcm-bg|fcm-fg|webpush) 로그
*/
/// <reference lib="webworker" />
export {};

self.addEventListener("install", () => {
  self.skipWaiting(); // 새 SW 즉시 활성화
});
self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim()); // 곧바로 모든 클라이언트 제어
});

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: readonly string[];
};

import { precacheAndRoute } from "workbox-precaching";
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

// ===== Workbox =====
precacheAndRoute(self.__WB_MANIFEST);

// ===== Firebase =====
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

/* ------------------------------- Debug ---------------------------------- */

const DEBUG = false;
function debug(label: string, data?: unknown) {
  if (!DEBUG) return;
  try {
    console.groupCollapsed(`[SW] ${label}`);
    if (data !== undefined) console.dir(data);
    console.groupEnd();
  } catch {
    console.log(`[SW] ${label}`, data);
  }
}

/* --------------------------- IndexedDB utils ---------------------------- */
const DB_NAME = "coffect-fcm";
const STORE = "suggests";
const TTL_MS = 24 * 60 * 60 * 1000;

type FcmPayload = {
  data?: Record<string, string | number | boolean | undefined>;
  notification?: {
    title?: string;
    body?: string;
    image?: string;
    icon?: string;
  };
};
type SourceTag = "fcm-bg" | "fcm-fg" | "webpush";
type StoredItem = {
  cardId: string;
  ts: number;
  payload: FcmPayload;
  source: SourceTag;
};
type WebPushPayload = {
  title?: string;
  body?: string;
  image?: string;
  icon?: string;
  data?: Record<string, unknown>;
  click_action?: string;
};

function pickClickAction(x: unknown): string | undefined {
  if (
    x &&
    typeof x === "object" &&
    "click_action" in (x as Record<string, unknown>)
  ) {
    const v = (x as Record<string, unknown>).click_action;
    return typeof v === "string" ? v : undefined;
  }
  return undefined;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE))
        db.createObjectStore(STORE, { keyPath: "cardId" });
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
  debug("DB putItem", item);
}
async function getAll(): Promise<StoredItem[]> {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, "readonly");
    const st = tx.objectStore(STORE);
    const req = st.getAll();
    req.onsuccess = () => {
      const list = (req.result as StoredItem[]) || [];
      debug("DB getAll ->", list.length);
      res(list);
    };
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
  debug("DB deleteById", cardId);
}
async function pruneExpired(): Promise<void> {
  const items = await getAll();
  const now = Date.now();
  const expired = items.filter((i) => now - i.ts > TTL_MS).map((i) => i.cardId);
  await Promise.all(expired.map((id) => deleteById(id)));
  if (expired.length) debug("DB pruneExpired removed", expired);
}

/* ----------------------------- helpers ---------------------------------- */
function buildCardIdFromPayload(payload: FcmPayload): string {
  const d = payload?.data || {};
  const raw = d.coffectId ?? d.coffeeChatId ?? d.coffeeid ?? Date.now();
  return String(raw);
}

const isWindowClient = (c: Client): c is WindowClient => "focus" in c;

async function broadcastToClients(msg: {
  source?: SourceTag;
  payload?: FcmPayload;
  payloads?: FcmPayload[];
  deletedCardId?: string;
}) {
  debug("broadcastToClients", msg);
  const clientList = await self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });
  for (const c of clientList) if (isWindowClient(c)) c.postMessage(msg);
}

/* ----------------------- persist / message types ------------------------- */
type SwMessage =
  | { type: "fcm-flush" }
  | { type: "fcm-delete"; cardId: string }
  | { type: "fcm-save"; payload: FcmPayload } // foreground → save
  | { type: "fcm-save-many"; payloads: FcmPayload[] }; // batch

async function persistAndBroadcast(p: FcmPayload, source: SourceTag) {
  const cardId = buildCardIdFromPayload(p);
  const item: StoredItem = { cardId, ts: Date.now(), payload: p, source };
  debug(`persistAndBroadcast.save [${source}]`, { cardId, payload: p });
  await putItem(item);
  await broadcastToClients({ source, payload: p });
}
async function persistMany(ps: FcmPayload[], source: SourceTag) {
  for (const p of ps) {
    const cardId = buildCardIdFromPayload(p);
    const item: StoredItem = { cardId, ts: Date.now(), payload: p, source };
    await putItem(item);
  }
  await pruneExpired();
  await broadcastToClients({ payloads: ps, source });
}

/* --------------------- FCM background (BG 수신) -------------------------- */
onBackgroundMessage(messaging, async (payload) => {
  debug("RECV FCM [background] payload", payload);
  try {
    await persistAndBroadcast(payload, "fcm-bg");
    await pruneExpired();

    const { title, body, image, icon } = payload.notification ?? {};
    const notiTitle = title ?? "새 알림";
    const cardId = buildCardIdFromPayload(payload);

    await self.registration.showNotification(notiTitle, {
      body: body ?? "",
      icon: icon ?? image ?? "/favicon.ico",
      data: {
        ...(payload.data ?? {}),
        cardId,
        click_action: (payload.data?.click_action as string) ?? "/",
        source: "fcm-bg",
      },
      requireInteraction: true,
      tag: `card-${cardId}`,
    });
  } catch (e) {
    console.error("[SW] 백그라운드 메시지 처리 실패:", e);
  }
});

/* ---------------------- Standard Web Push (iOS 등) ---------------------- */
self.addEventListener("push", (event: PushEvent) => {
  const raw = (() => {
    try {
      return event.data?.json?.() ?? {};
    } catch {
      try {
        return JSON.parse(event.data?.text?.() ?? "{}");
      } catch {
        return {};
      }
    }
  })() as unknown;
  debug("RECV WebPush [push] raw", raw);

  const wp = (raw ?? {}) as WebPushPayload;
  const title = wp.title ?? "새 알림";
  const clickAction = pickClickAction(wp) ?? pickClickAction(wp.data) ?? "/";

  const fcmLike: FcmPayload = {
    data: (wp.data ?? {}) as Record<
      string,
      string | number | boolean | undefined
    >,
    notification: {
      title,
      body: wp.body ?? "",
      image: wp.image ?? wp.icon,
      icon: wp.icon,
    },
  };
  debug("WebPush normalized → fcmLike", fcmLike);

  event.waitUntil(
    (async () => {
      await persistAndBroadcast(fcmLike, "webpush");
      await pruneExpired();

      const cardId = buildCardIdFromPayload(fcmLike);
      await self.registration.showNotification(title, {
        body: wp.body ?? "",
        icon: wp.icon ?? wp.image ?? "/favicon.ico",
        data: {
          ...(wp.data ?? {}),
          cardId,
          click_action: clickAction,
          source: "webpush",
        },
        requireInteraction: true,
        tag: `card-${cardId}`,
      });
    })(),
  );
});

/* -------------------------- Page → SW messages -------------------------- */
self.addEventListener("message", (ev: ExtendableMessageEvent) => {
  const msg = (ev.data || {}) as SwMessage;
  debug("Page→SW message", msg);

  if (msg.type === "fcm-flush") {
    ev.waitUntil(
      (async () => {
        await pruneExpired();
        const items = await getAll();
        items.sort((a, b) => b.ts - a.ts);
        // flush는 혼합 소스일 수 있어 source 생략
        await broadcastToClients({ payloads: items.map((i) => i.payload) });
      })(),
    );
  } else if (msg.type === "fcm-delete" && msg.cardId) {
    ev.waitUntil(
      (async () => {
        await deleteById(msg.cardId);
        await broadcastToClients({ deletedCardId: msg.cardId });
      })(),
    );
  } else if (msg.type === "fcm-save" && msg.payload) {
    // 페이지(포그라운드)에서 받은 걸 저장
    ev.waitUntil(
      (async () => {
        debug("RECV FCM [foreground] via page→SW", msg.payload);
        await persistAndBroadcast(msg.payload, "fcm-fg");
        await pruneExpired();
      })(),
    );
  } else if (msg.type === "fcm-save-many" && msg.payloads) {
    ev.waitUntil(persistMany(msg.payloads, "fcm-fg"));
  }
});

/* ------------------------------- lifecycle ------------------------------ */
self.addEventListener("activate", (event) => {
  event.waitUntil(pruneExpired());
});

/* --------------------------- notification click ------------------------- */
self.addEventListener("notificationclick", (event: NotificationEvent) => {
  debug("notificationclick", {
    action: event.action,
    data: event.notification.data,
  });

  const data = event.notification.data as
    | { click_action?: string; cardId?: string; source?: SourceTag }
    | undefined;
  const urlToOpen = data?.click_action ?? "/";
  const cardId = data?.cardId;

  if (event.action === "dismiss") {
    event.notification.close();
    event.waitUntil(
      (async () => {
        if (cardId) {
          await deleteById(cardId);
          await broadcastToClients({ deletedCardId: cardId });
        }
      })(),
    );
    return;
  }

  event.waitUntil(
    (async () => {
      const clientList = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
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

registerRoute(({ request, url }) => {
  if (url.pathname.endsWith(".ts") || url.pathname.endsWith(".tsx")) {
    return false;
  }
  return (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "document"
  );
}, new StaleWhileRevalidate());
