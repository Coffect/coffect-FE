/*
  author      : 썬더
  description : 알림 목록/카운트/읽음 처리/토큰 등록 + FCM 수신 캐시 반영 훅
*/
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
  registerFcmToken,
} from "@/api/alert";
import { onMessageListener, type FcmPayload } from "@/utils/fcm";

export const QK = {
  list: ["notifications"],
  unread: ["notifications", "unreadCount"],
};

interface NotificationItem {
  id: string | number;
  type: string;
  name?: string;
  message?: string;
  image?: string;
  createdAt: string;
  raw: FcmPayload;
  read?: boolean;
}

export const useNotificationQueries = () => {
  const qc = useQueryClient();

  const listQuery = useQuery({
    queryKey: QK.list,
    queryFn: getNotifications,
  });

  const unreadQuery = useQuery({
    queryKey: QK.unread,
    queryFn: getUnreadCount,
  });

  const readOne = useMutation({
    mutationFn: (id: number) => markAsRead(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: QK.unread });
      const prevUnread = qc.getQueryData<number | undefined>(QK.unread);
      const prevList = qc.getQueryData<NotificationItem[] | undefined>(QK.list);

      qc.setQueryData<number | undefined>(QK.unread, (v) =>
        typeof v === "number" && v > 0 ? v - 1 : 0,
      );

      qc.setQueryData<NotificationItem[] | undefined>(QK.list, (old) =>
        Array.isArray(old)
          ? old.map((n) =>
              String(n.id) === String(id) ? { ...n, read: true } : n,
            )
          : old,
      );

      return { prevUnread, prevList };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prevUnread !== undefined)
        qc.setQueryData(QK.unread, ctx.prevUnread);
      if (ctx?.prevList !== undefined) qc.setQueryData(QK.list, ctx.prevList);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: QK.list });
      qc.invalidateQueries({ queryKey: QK.unread });
    },
  });

  const readAll = useMutation({
    mutationFn: () => markAllAsRead(),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: QK.unread });
      const prevUnread = qc.getQueryData<number | undefined>(QK.unread);
      qc.setQueryData<number | undefined>(QK.unread, 0);
      return { prevUnread };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prevUnread !== undefined)
        qc.setQueryData(QK.unread, ctx.prevUnread);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: QK.list });
      qc.invalidateQueries({ queryKey: QK.unread });
    },
  });

  const registerToken = useMutation({
    mutationFn: (token: string) => registerFcmToken(token),
  });

  useEffect(() => {
    const unsub = onMessageListener((payload: FcmPayload) => {
      const data = payload.data ?? {};
      const idRaw = data.id; // string | undefined
      const idParsed =
        idRaw != null && !Number.isNaN(Number(idRaw)) ? Number(idRaw) : idRaw;
      qc.setQueryData<NotificationItem[] | undefined>(QK.list, (old) => {
        const next = Array.isArray(old) ? [...old] : [];
        next.unshift({
          id: idParsed ?? Date.now(),
          type: data.type ?? "unknown",
          name: data.name,
          message: data.message,
          image: data.image,
          createdAt: new Date().toISOString(),
          raw: payload,
        });
        return next;
      });

      qc.setQueryData<number | undefined>(QK.unread, (prev) =>
        typeof prev === "number" ? prev + 1 : 1,
      );
    });

    return () => unsub?.();
  }, [qc]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.source !== "fcm-sw") return;
      const payload = e.data?.payload as FcmPayload;
      const data = payload.data ?? {};

      qc.setQueryData<NotificationItem[] | undefined>(QK.list, (old) => {
        const next = Array.isArray(old) ? [...old] : [];
        next.unshift({
          id: data.id ?? Date.now(),
          type: data.type ?? "unknown",
          name: data.name,
          message: data.message,
          image: data.image,
          createdAt: new Date().toISOString(),
          raw: payload,
        });
        return next;
      });

      qc.setQueryData<number | undefined>(QK.unread, (prev) =>
        typeof prev === "number" ? prev + 1 : 1,
      );
    };

    navigator.serviceWorker.addEventListener("message", handler);
    return () =>
      navigator.serviceWorker.removeEventListener("message", handler);
  }, [qc]);

  return { listQuery, unreadQuery, readOne, readAll, registerToken };
};
