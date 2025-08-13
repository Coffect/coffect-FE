/*
 * author : 박은지
 * description : 채팅방 관련 API 함수들
 */

import { axiosInstance } from "../axiosInstance";
import type {
  ChatRoomListResponse,
  ChatMessageListResponse,
  SendMessageResponse,
  CreateChatRoomResponse,
  MarkAsReadResponse,
  SendPhotoResponse,
} from "../../types/chat";

// 채팅방 생성 API
export const createChatRoom = async (
  userId: number,
): Promise<CreateChatRoomResponse> => {
  const response = await axiosInstance.post("/chat/start", {
    userId,
  });
  return response.data;
};

// 채팅방 목록 조회 API
export const getChatRoomList = async (): Promise<ChatRoomListResponse> => {
  try {
    const response = await axiosInstance.get("/chat/rooms");

    // 응답 데이터가 없거나 success 필드가 없을 경우 에러로 처리
    if (!response.data || !response.data.success) {
      console.error("채팅방 목록 조회 실패: 응답 데이터가 없습니다");
      return {
        resultType: "FAIL",
        error: { reason: "응답 데이터가 없습니다" },
        success: [],
      };
    }

    // success 배열이 비어있어도 SUCCESS로 반환 (채팅방이 없는 것은 정상적인 상황)
    return response.data;
  } catch (error) {
    console.error("채팅방 목록 조회 실패:", error);
    // 에러 발생 시 FAIL로 반환
    return {
      resultType: "FAIL",
      error: { reason: "채팅방 목록 조회에 실패했습니다" },
      success: [],
    };
  }
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
  const response = await axiosInstance.post(
    `/chat/message?chatRoomId=${chatRoomId}`,
    {
      message,
    },
  );
  return response.data;
};

// 채팅방 메시지 읽음 처리 API
export const markChatAsRead = async (
  chatRoomId: string,
): Promise<MarkAsReadResponse> => {
  const response = await axiosInstance.patch(
    `/chat/read?chatRoomId=${chatRoomId}`,
  );
  return response.data;
};

// 메시지 사진 전송 API
export const sendPhoto = async (
  chatRoomId: string,
  imageFile: File,
): Promise<SendPhotoResponse> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await axiosInstance.post(
    `/chat/photo?chatRoomId=${chatRoomId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};
