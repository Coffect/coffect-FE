// src/components/dev/FcmDebugPanel.tsx
import { useEffect, useState } from "react";
import { onMessageListener, type FcmPayload } from "@/utils/fcm";

type SwEnvelope =
  | { source?: string; payload?: FcmPayload; payloads?: FcmPayload[] }
  | FcmPayload;

const isFcmPayload = (x: unknown): x is FcmPayload =>
  !!x &&
  typeof x === "object" &&
  ("data" in (x as Record<string, unknown>) ||
    "notification" in (x as Record<string, unknown>));

export default function FcmDebugPanel() {
  const [items, setItems] = useState<FcmPayload[]>([]);

  const push = (p: FcmPayload) => setItems((prev) => [p, ...prev].slice(0, 50)); // 최대 50개만 보관

  useEffect(() => {
    // 1) 포그라운드 수신(onMessage)
    const unsub = onMessageListener((payload) => push(payload));

    // 2) SW → Page postMessage 수신 (단건/배열 모두 처리)
    const onAnyMessage = (ev: MessageEvent<SwEnvelope>) => {
      const d = ev.data;
      if (isFcmPayload(d)) {
        push(d);
        return;
      }
      if (d && typeof d === "object") {
        if (d.payload) push(d.payload);
        if (Array.isArray(d.payloads)) d.payloads.forEach(push);
      }
    };

    navigator.serviceWorker.addEventListener("message", onAnyMessage);
    window.addEventListener("message", onAnyMessage);

    // 3) 마운트 시 SW에 누적분 요청(레이스 방지)
    (async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      reg?.active?.postMessage({ type: "fcm-flush" });
    })();

    return () => {
      unsub?.();
      navigator.serviceWorker.removeEventListener("message", onAnyMessage);
      window.removeEventListener("message", onAnyMessage);
    };
  }, []);

  const getType = (p: FcmPayload) => {
    const d = p.data as Record<string, unknown> | undefined;
    return typeof d?.type === "string" ? d.type : undefined;
  };

  return (
    <div
      style={{
        position: "fixed",
        left: 12,
        right: 12,
        bottom: 12,
        maxHeight: "45vh",
        overflow: "auto",
        background: "#121212",
        color: "#eee",
        padding: 10,
        borderRadius: 12,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        boxShadow: "0 8px 24px rgba(0,0,0,.35)",
        zIndex: 9999,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8 }}>
        [FCM Inbox] {items.length}개
      </div>

      {items.length === 0 ? (
        <div style={{ opacity: 0.7 }}>수신된 FCM 없음</div>
      ) : (
        items.map((p, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #2a2a2a",
              borderRadius: 10,
              padding: 8,
              marginBottom: 8,
              background: "#1b1b1b",
            }}
          >
            <div>title: {p.notification?.title ?? "-"}</div>
            <div>body: {p.notification?.body ?? "-"}</div>
            <div>type: {getType(p) ?? "-"}</div>
            <details style={{ marginTop: 6 }}>
              <summary>raw</summary>
              <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                {JSON.stringify(p, null, 2)}
              </pre>
            </details>
          </div>
        ))
      )}
    </div>
  );
}
