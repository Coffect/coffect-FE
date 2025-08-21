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
      timeout: 60000,
    });

    console.log("sendPhoto API 응답 성공:", response.data);
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
    console.log("=== currentUserId 확인 ===");
    console.log("profileResponse:", profileResponse);
    console.log("currentUserId:", currentUserId);
    console.log("currentUserId 타입:", typeof currentUserId);

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

    // 4. 상대방의 string ID 가져오기 (getCoffeeChatSchedule의 opponentId와 비교하기 위해)
    let opponentStringId: string | null = null;
    try {
      const { getUserStringId } = await import("../home");
      opponentStringId = await getUserStringId(opponentUserId);
      console.log("상대방 string ID:", opponentStringId);
    } catch (error) {
      console.error("상대방 string ID 조회 실패:", error);
      return {
        resultType: "FAIL",
        success: null,
        error: { reason: "상대방 정보를 가져올 수 없습니다" },
      };
    }

    // 전체 일정 목록 가져오기
    console.log("=== getCoffeeChatSchedule API 호출 시작 ===");
    const allSchedules = await getCoffeeChatSchedule();
    console.log("=== getCoffeeChatSchedule API 호출 완료 ===");

    // 디버깅용 로그
    console.log("=== getChatRoomSchedule 디버깅 ===");
    console.log("chatRoomId:", chatRoomId);
    console.log("currentUserId:", currentUserId);
    console.log("opponentUserId:", opponentUserId);
    console.log("opponentStringId:", opponentStringId);
    console.log("allSchedules:", allSchedules);
    console.log("allSchedules 타입:", typeof allSchedules);
    console.log("allSchedules 길이:", allSchedules?.length);
    console.log("getCoffeeChatSchedule 원본 응답:", allSchedules);

    // 채팅방 ID로 필터링하여 해당 채팅방의 일정 찾기
    // opponentId는 string ID이므로 string ID로 비교
    const chatRoomSchedule = allSchedules.find(
      (schedule: {
        opponentId: string | number;
        coffeeDate: string;
        location: string;
      }) => {
        const scheduleOpponentId = String(schedule.opponentId);
        console.log("비교:", scheduleOpponentId, "===", opponentStringId);
        return scheduleOpponentId === opponentStringId;
      },
    );

    console.log("찾은 일정:", chatRoomSchedule);

    // 일정이 없어도 제안 정보는 가져와보기
    if (!chatRoomSchedule) {
      // 제안 정보만이라도 가져와보기
      let isMyRequest = false;
      let requestTime: string | undefined;
      let requestMessage: string | undefined;

      try {
        // 채팅방 ID로 coffectId 조회
        const coffectIdResponse = await getCoffectId(chatRoomId);
        console.log("getCoffectId 응답 (일정 없음):", coffectIdResponse);

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

              // getMessageShowUp의 firstUserId로 isMyRequest 판단
              if (messageResponse.success.firstUserId) {
                isMyRequest =
                  String(messageResponse.success.firstUserId) !==
                  String(currentUserId);
              }
            }
          } catch (apiError) {
            console.error("getMessageShowUp API 실패 (일정 없음):", apiError);
          }
        }
      } catch (error) {
        console.error("getCoffectId 실패 (일정 없음):", error);
      }

      // 일정은 없지만 제안 정보가 있으면 SUCCESS 반환
      if (requestMessage) {
        return {
          resultType: "SUCCESS",
          success: {
            date: "",
            time: "",
            place: "",
            alert: null,
            opponentId: null,
            isMyRequest: isMyRequest,
            requestTime: requestTime,
            requestMessage: requestMessage,
          },
          error: null,
        };
      }

      // 제안 정보도 없으면 FAIL 반환
      return {
        resultType: "FAIL",
        success: null,
        error: { reason: "해당 채팅방의 일정과 제안 정보를 찾을 수 없습니다" },
      };
    }

    // getCoffeeChatSchedule 데이터로 isMyRequest 판단
    let isMyRequest = false;
    let requestTime: string | undefined;
    let requestMessage: string | undefined;

    // 제안 메시지 정보는 coffectId로 조회 (isMyRequest 판단 포함)
    console.log("=== getCoffectId API 호출 시작 ===");
    console.log("chatRoomId:", chatRoomId);
    console.log("이 부분이 실행되는지 확인");

    try {
      // 채팅방 ID로 coffectId 조회
      const coffectIdResponse = await getCoffectId(chatRoomId);
      console.log("getCoffectId 응답:", coffectIdResponse);

      if (
        coffectIdResponse.resultType === "SUCCESS" &&
        coffectIdResponse.success
      ) {
        const coffectId = coffectIdResponse.success;

        // getMessageShowUp API 호출
        try {
          console.log("=== getMessageShowUp API 호출 ===");
          console.log("coffectId:", coffectId);

          const messageResponse = await getMessageShowUp(coffectId);
          console.log("getMessageShowUp 응답:", messageResponse);

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

            // getMessageShowUp의 firstUserId로 isMyRequest 판단 (제안 보낸 상대의 숫자 ID)
            if (messageResponse.success.firstUserId) {
              // firstUserId가 현재 사용자와 같으면 상대가 제안한 것 (내가 받은 것)
              // firstUserId가 현재 사용자와 다르면 내가 제안한 것
              isMyRequest =
                String(messageResponse.success.firstUserId) !==
                String(currentUserId);
            }
          }
        } catch (apiError) {
          console.error("getMessageShowUp API 실패:", apiError);
          // API 실패 시에도 기본값 설정
          requestTime = "제안 시간 정보를 불러올 수 없습니다.";
          requestMessage = "제안 메시지를 불러올 수 없습니다.";
        }
      }
    } catch (error) {
      // 실패 시 기본값 설정
      requestTime = "제안 시간 정보를 불러올 수 없습니다.";
      requestMessage = "제안 메시지를 불러올 수 없습니다.";
    }

    // 서버 응답을 그대로 사용 (변환하지 않음)
    let dateStr = chatRoomSchedule.coffeeDate;
    let timeStr = "";

    // 만약 서버에서 날짜와 시간을 분리해서 보내주지 않는다면 변환
    if (typeof chatRoomSchedule.coffeeDate === "string") {
      try {
        const coffeeDate = new Date(chatRoomSchedule.coffeeDate);

        if (!isNaN(coffeeDate.getTime())) {
          dateStr = coffeeDate.toLocaleDateString("ko-KR", {
            month: "long",
            day: "numeric",
          });

          timeStr = coffeeDate.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, // 24시간제 사용
          });
        }
      } catch (error) {
        // 날짜 변환 실패 시 서버 응답 그대로 사용
      }
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
        isMyRequest: isMyRequest,
        // 제안 보낸 시간과 메시지 추가 (getMessageShowUp에서 가져온 createdAt과 message 사용)
        requestTime: requestTime,
        requestMessage: requestMessage,
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
  } finally {
    // 실행 상태 해제
    runningRequests.delete(chatRoomId);
  }
};
