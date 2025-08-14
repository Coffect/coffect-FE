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
  GetCoffectIdResponse,
} from "../../types/chat";

// 커피챗 제안 아이디 조회 API
export const getCoffectId = async (
  chatRoomId: string,
): Promise<GetCoffectIdResponse> => {
  try {
    console.log("getCoffectId API 호출 - chatRoomId:", chatRoomId);

    const response = await axiosInstance.get(
      `/chat/getCoffectId?chatRoomId=${encodeURIComponent(chatRoomId)}`,
    );
    console.log("getCoffectId API 응답:", response.data);
    return response.data;
  } catch {
    return {
      resultType: "FAIL",
      error: { reason: "커피챗 제안 아이디 조회에 실패했습니다" },
      success: null,
    };
  }
};

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
  try {
    const response = await axiosInstance.get(
      `/chat?chatRoomId=${encodeURIComponent(chatRoomId)}`,
    );

    return response.data;
  } catch (error) {
    console.error("메시지 조회 실패:", error);
    return {
      resultType: "FAIL",
      error: null,
      success: [],
    };
  }
};

// 메시지 전송 API
export const sendMessage = async (
  chatRoomId: string,
  message: string,
): Promise<SendMessageResponse> => {
  const url = `/chat/message?chatRoomId=${encodeURIComponent(chatRoomId)}`;

  const response = await axiosInstance.post(url, {
    message,
  });
  return response.data;
};

// 채팅방 메시지 읽음 처리 API
export const markChatAsRead = async (
  chatRoomId: string,
): Promise<MarkAsReadResponse> => {
  const response = await axiosInstance.patch(
    `/chat/read?chatRoomId=${encodeURIComponent(chatRoomId)}`,
  );
  return response.data;
};

// 메시지 사진 전송 API
export const sendPhoto = async (
  chatRoomId: string,
  imageFile: File,
): Promise<SendPhotoResponse> => {
  console.log("sendPhoto API 호출 시작");
  console.log("chatRoomId:", chatRoomId);
  console.log("imageFile:", imageFile);
  console.log("imageFile.name:", imageFile.name);
  console.log("imageFile.type:", imageFile.type);
  console.log("imageFile.size:", imageFile.size);

  const formData = new FormData();
  formData.append("image", imageFile);

  const url = `/chat/photo?chatRoomId=${encodeURIComponent(chatRoomId)}`;
  console.log("sendPhoto API 호출 URL:", url);

  try {
    const response = await axiosInstance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    console.log("sendPhoto API 응답 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("sendPhoto API 호출 실패:", error);
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      console.error("HTTP 상태 코드:", axiosError.response?.status);
      console.error("응답 데이터:", axiosError.response?.data);
    }
    throw error;
  }
};
