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
import { getCoffeeChatSchedule, getMessageShowUp } from "../home";
import { getProfile } from "../profile";
export const getCoffectId = async (
  chatRoomId: string,
): Promise<GetCoffectIdResponse> => {
  try {
    const response = await axiosInstance.get(
      `/chat/getCoffectId?chatRoomId=${encodeURIComponent(chatRoomId)}`,
    );

    return response.data;
  } catch (error) {
    console.error("getCoffectId API 실패:", error);
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
    `/chat/read`,
    { chatRoomId }, // body에 chatRoomId 전달
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
      timeout: 60000,
    });

    return response.data;
  } catch (error) {
    console.error("sendPhoto API 호출 실패:", error);
    throw error;
  }
};

// 중복 실행 방지를 위한 Map (chatRoomId별로 실행 상태 추적)
const runningRequests = new Map<string, boolean>();

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
    opponentId: number | null;
    isMyRequest: boolean;
    requestTime?: string;
    requestMessage?: string;
  } | null;
  error: { reason: string } | null;
}> => {
  // 중복 실행 방지: 같은 채팅방에 대해 이미 실행 중인 요청이 있으면 대기
  if (runningRequests.get(chatRoomId)) {
    return {
      resultType: "FAIL",
      success: null,
      error: { reason: "이미 실행 중인 요청이 있습니다" },
    };
  }

  runningRequests.set(chatRoomId, true);

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
    // opponentId는 숫자 ID이므로 숫자 ID로 비교
    const chatRoomSchedule = allSchedules.find(
      (schedule: {
        opponentId: string | number;
        coffeeDate: string;
        location: string;
      }) => {
        const scheduleOpponentId = Number(schedule.opponentId);

        return scheduleOpponentId === opponentUserId;
      },
    );

    // 일정이 없으면 FAIL 반환
    if (!chatRoomSchedule) {
      return {
        resultType: "FAIL",
        success: null,
        error: { reason: "해당 채팅방의 일정을 찾을 수 없습니다" },
      };
    }

    // getMessageShowUp으로 isMyRequest 판단
    let isMyRequest = false; // 기본값을 false로 설정
    let requestTime: string | undefined;
    let requestMessage: string | undefined;

    try {
      // 채팅방 ID로 coffectId 조회
      const coffectIdResponse = await getCoffectId(chatRoomId);

      if (
        coffectIdResponse.resultType === "SUCCESS" &&
        coffectIdResponse.success
      ) {
        const coffectId = coffectIdResponse.success;

        // getMessageShowUp API 호출
        try {
          const messageResponse = await getMessageShowUp(coffectId);

          if (
            messageResponse.resultType === "SUCCESS" &&
            messageResponse.success
          ) {
            // 제안 메시지를 받은 시간을 requestTime에 설정
            if (messageResponse.success.createdAt) {
              requestTime = new Date(
                messageResponse.success.createdAt,
              ).toLocaleString();
            }

            // 제안 메시지 설정
            requestMessage = messageResponse.success.message;

            // getMessageShowUp의 firstUserId로 isMyRequest 판단 (firstUserId는 제안을 받은 사람)
            if (messageResponse.success.firstUserId) {
              // firstUserId가 현재 사용자와 같으면 → 상대가 제안한 것 (내가 받은 것) → isMyRequest = false
              // firstUserId가 현재 사용자와 다르면 → 내가 제안한 것 → isMyRequest = true
              const firstUserId = String(messageResponse.success.firstUserId);
              const currentUserIdStr = String(currentUserId);

              // firstUserId가 현재 사용자와 같으면 → 내가 제안한 것 → isMyRequest = true
              // firstUserId가 현재 사용자와 다르면 → 상대가 제안한 것 (내가 받은 것) → isMyRequest = false
              isMyRequest = firstUserId === currentUserIdStr;
            }
          }
        } catch {
          // API 실패 시에도 기본값 설정
          requestTime = "제안 시간 정보를 불러올 수 없습니다.";
          requestMessage = "제안 메시지를 불러올 수 없습니다.";
          // isMyRequest는 기본값 false 유지
        }
      }
    } catch {
      // 실패 시 기본값 설정
      requestTime = "제안 시간 정보를 불러올 수 없습니다.";
      requestMessage = "제안 메시지를 불러올 수 없습니다.";
      // isMyRequest는 기본값 false 유지
    }

    // 서버에서 오는 coffeeDate를 날짜와 시간으로 분리
    let dateStr = "";
    let timeStr = "";

    if (
      typeof chatRoomSchedule.coffeeDate === "string" &&
      chatRoomSchedule.coffeeDate.includes("T")
    ) {
      try {
        // ISO 문자열을 직접 파싱해서 "2025-08-23 08:04" 형태로 변환
        const formatted = chatRoomSchedule.coffeeDate
          .replace("T", " ")
          .slice(0, 16);
        const [datePart, timePart] = formatted.split(" ");

        // 날짜를 "8월 23일" 형태로 변환
        const [year, month, day] = datePart.split("-");
        dateStr = `${Number(month)}월 ${Number(day)}일`;

        // 시간은 그대로 사용
        timeStr = timePart;
      } catch {
        // 변환 실패 시 원본 사용
        dateStr = chatRoomSchedule.coffeeDate;
        timeStr = "";
      }
    } else {
      // ISO 문자열이 아닌 경우 원본 사용
      dateStr = chatRoomSchedule.coffeeDate;
      timeStr = "";
    }

    return {
      resultType: "SUCCESS",
      success: {
        date: dateStr,
        time: timeStr,
        place: chatRoomSchedule.location,
        alert: "5분 전", // 기본값
        // opponentId 정보 추가
        opponentId: chatRoomSchedule.opponentId || null, // 상대방 ID
        // coffectId와 getMessageShowUp API로 정확하게 계산된 값
        isMyRequest: isMyRequest ?? false,
        // 제안 보낸 시간과 메시지 추가 (getMessageShowUp에서 가져온 createdAt과 message 사용)
        requestTime: requestTime,
        requestMessage: requestMessage,
      },
      error: null,
    };
  } catch {
    return {
      resultType: "FAIL",
      success: null,
      error: { reason: "채팅방 일정 조회에 실패했습니다" },
    };
  } finally {
    // 실행 상태 해제
    runningRequests.delete(chatRoomId);
  }
};
