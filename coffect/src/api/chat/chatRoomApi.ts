/*
 * author : 박은지
 * description : 채팅방 관련 API 함수들
 */

import { axiosInstance } from "../axiosInstance";
import type {
  ChatRoomListResponse,
  ChatMessageListResponse,
  CreateChatRoomResponse,
  MarkAsReadResponse,
  SendPhotoResponse,
  GetCoffectIdResponse,
} from "../../types/chat";
import axios from "axios";
import { socketManager } from "./socketInstance";
import { getCoffeeChatSchedule } from "../home";
import { getProfile } from "../profile";
export const getCoffectId = async (
  chatRoomId: string,
): Promise<GetCoffectIdResponse> => {
  try {
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
    const response = await axiosInstance.get("/chat/rooms", {
      timeout: 10000, // 10초 타임아웃
    });

    // 응답 데이터가 없거나 success 필드가 없을 경우 에러로 처리
    if (!response.data || !response.data.success) {
      return {
        resultType: "FAIL",
        error: { reason: "응답 데이터가 없습니다" },
        success: [],
      };
    }

    // success 배열이 비어있어도 SUCCESS로 반환 (채팅방이 없는 것은 정상적인 상황)
    console.log("getChatRoomList 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("채팅방 목록 조회 실패:", error);

    // 타임아웃 에러 처리
    if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
      return {
        resultType: "FAIL",
        error: { reason: "요청 시간이 초과되었습니다. 다시 시도해주세요." },
        success: [],
      };
    }

    // 네트워크 에러 처리
    if (axios.isAxiosError(error) && !error.response) {
      return {
        resultType: "FAIL",
        error: { reason: "네트워크 연결을 확인해주세요." },
        success: [],
      };
    }

    // 기타 에러 처리
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

// 소켓을 통한 메시지 전송 (API 대신 소켓 이벤트 사용)
export const sendMessage = (chatRoomId: string, message: string): void => {
  socketManager.sendMessage(chatRoomId, message);
};

// 소켓을 통한 메시지 수신 리스너
export const receiveMessage = (
  callback: (...args: unknown[]) => void,
): void => {
  socketManager.onReceiveMessage(callback);
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
  const formData = new FormData();
  formData.append("image", imageFile);

  const url = `/chat/photo?chatRoomId=${encodeURIComponent(chatRoomId)}`;

  try {
    const response = await axiosInstance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      maxContentLength: 2 * 1024 * 1024,
      maxBodyLength: 2 * 1024 * 1024,
      timeout: 60000,
    });

    console.log("sendPhoto API 응답 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("sendPhoto API 호출 실패:", error);
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { status?: number; data?: unknown };
      };
      console.error("HTTP 상태 코드:", axiosError.response?.status);
      console.error("응답 데이터:", axiosError.response?.data);
    }
    throw error;
  }
};

// 채팅방별 일정 조회 (getCoffeeChatSchedule API 활용)
export const getChatRoomSchedule = async (
  chatRoomId: string,
): Promise<{
  resultType: "SUCCESS" | "FAIL";
  success: {
    date: string;
    time: string;
    place: string;
    alert: string | null;
  } | null;
  error: { reason: string } | null;
}> => {
  try {
    // 1. 먼저 채팅방 정보를 가져와서 상대방의 userId를 찾기
    const chatRoomResponse = await getChatRoomList();
    if (chatRoomResponse.resultType !== "SUCCESS") {
      return {
        resultType: "FAIL",
        success: null,
        error: { reason: "채팅방 정보를 가져올 수 없습니다" },
      };
    }

    const currentChatRoom = chatRoomResponse.success.find(
      (room) => room.chatroomId === chatRoomId,
    );

    if (!currentChatRoom) {
      return {
        resultType: "FAIL",
        success: null,
        error: { reason: "해당 채팅방을 찾을 수 없습니다" },
      };
    }

    // 2. 현재 사용자의 userId 가져오기
    const profileResponse = await getProfile();
    if (profileResponse.resultType !== "SUCCESS" || !profileResponse.success) {
      return {
        resultType: "FAIL",
        success: null,
        error: { reason: "사용자 정보를 가져올 수 없습니다" },
      };
    }

    const currentUserId = profileResponse.success.userInfo.userId;

    // 3. 상대방의 userId 찾기 (채팅방의 userId가 현재 사용자가 아닌 경우)
    const opponentUserId =
      currentChatRoom.userId === currentUserId
        ? null // 자기 자신과의 채팅방인 경우 (이상한 상황)
        : currentChatRoom.userId;

    if (!opponentUserId) {
      return {
        resultType: "FAIL",
        success: null,
        error: { reason: "상대방 정보를 찾을 수 없습니다" },
      };
    }

    // 전체 일정 목록 가져오기
    const allSchedules = await getCoffeeChatSchedule();

    // 채팅방 ID로 필터링하여 해당 채팅방의 일정 찾기
    // opponentId가 숫자인지 문자열인지 확인하고 비교
    const chatRoomSchedule = allSchedules.find(
      (schedule: {
        opponentId: string | number;
        coffeeDate: string;
        location: string;
      }) => {
        const opponentIdStr = String(schedule.opponentId);
        const chatRoomOpponentIdStr = String(opponentUserId);
        return opponentIdStr === chatRoomOpponentIdStr;
      },
    );

    if (!chatRoomSchedule) {
      return {
        resultType: "FAIL",
        success: null,
        error: { reason: "해당 채팅방의 일정을 찾을 수 없습니다" },
      };
    }

    // 일정 정보를 Schedule 형식으로 변환
    const coffeeDate = new Date(chatRoomSchedule.coffeeDate);

    const dateStr = coffeeDate.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
    });
    const timeStr = coffeeDate.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24시간제 사용
    });

    return {
      resultType: "SUCCESS",
      success: {
        date: dateStr,
        time: timeStr,
        place: chatRoomSchedule.location,
        alert: "5분 전", // 기본값
      },
      error: null,
    };
  } catch (error) {
    console.error("채팅방 일정 조회 실패:", error);
    return {
      resultType: "FAIL",
      success: null,
      error: { reason: "채팅방 일정 조회에 실패했습니다" },
    };
  }
};
