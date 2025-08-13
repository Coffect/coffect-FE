/*
  author      : 썬더
  description : Alert API 모듈
*/

import { axiosInstance } from "./axiosInstance";

export const registerFcmToken = (fcmToken: string) =>
  axiosInstance.post("/alert/registerFCMToken", { fcmToken });

export const getNotifications = () =>
  axiosInstance.get("/alert/getNotifications").then((r) => r.data);

export const markAsRead = (notificationId: number) =>
  axiosInstance.patch("/alert/markAsRead", { notificationId });

export const markAllAsRead = () =>
  axiosInstance.patch("/alert/markAllAsRead", {});

export const getUnreadCount = () =>
  axiosInstance.get("/alert/getUnreadCount").then((r) => r.data);
