/*
 * author : 박은지
 * description : 채팅방 관련 API 함수들
 */

import { axiosInstance } from "../axiosInstance";
import type { 
  ChatRoomListResponse, 
  ChatMessageListResponse,
  SendMessageResponse 
} from "./types";

// 채팅방 목록 조회 API
export const getChatRoomList = async (): Promise<ChatRoomListResponse> => {
  const response = await axiosInstance.get("/chat/rooms");
  return response.data;
};

// 채팅방 메시지 조회 API
export const getChatMessages = async (
  chatRoomId: string,
): Promise<ChatMessageListResponse> => {
  const response = await axiosInstance.get(`/chat?chatRoomId=${chatRoomId}`);
  return response.data;
};

// 메시지 전송 API
export const sendMessage = async (
  chatRoomId: string,
  message: string,
): Promise<SendMessageResponse> => {
  const response = await axiosInstance.post(`/chat/message?chatRoomId=${chatRoomId}`, {
    message,
  });
  return response.data;
};
