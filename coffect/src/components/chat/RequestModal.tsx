/*
 * author : 앨리스/박은지
 * description : [상대 요청 보기] 모달 컴포넌트
 * 요청시간은 커피챗 제안 플로우에서 연결 필요, 시간표-임시 텍스트
 */

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../../api/axiosInstance";
import { getCommonFreeTime } from "../../hooks/useTimeTable";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  opponentName?: string; // 상대방 이름
  requestMessage?: string; // 상대방의 요청 메시지
  requestTime?: string; // 요청 시간
  availableTime?: string; // 상대방의 가능한 시간
}

interface MessageShowUpResponse {
  resultType: string;
  success: {
    coffectId: number;
    firstUserId: number;
    firstUserName: string;
    message: string;
    createdAt: string;
  } | null;
  error: { reason?: string } | null;
}

const RequestModal = ({
  isOpen,
  onClose,
  opponentName = "상대방",
  requestMessage = "상대방의 요청 메시지가 없습니다.",
  requestTime = "요청 시간 정보가 없습니다.",
  availableTime = "가능한 시간 정보가 없습니다.",
}: RequestModalProps) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<{
    message: string;
    requestTime: string;
  } | null>(null);

  // 현재 채팅방 ID 가져오기
  const currentChatRoomId = (() => {
    const pathParts = location.pathname.split("/");
    if (
      pathParts.length >= 3 &&
      pathParts[1] === "chat" &&
      pathParts[pathParts.length - 1] !== "schedule"
    ) {
      return pathParts.slice(2).join("/");
    }
    return null;
  })();

  // getCoffectId API 호출
  const getCoffectId = async (chatRoomId: string) => {
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

  // messageShowUp API 호출
  const getMessageShowUp = async (coffectId: number) => {
    try {
      const response = await axiosInstance.get(
        `/home/messageShowUp?coffectId=${coffectId}`,
      );
      console.log("messageShowUp API 응답:", response.data);
      return response.data as MessageShowUpResponse;
    } catch (error: unknown) {
      console.error("메시지 조회 실패:", error);
      return {
        resultType: "FAIL",
        success: null,
        error: { reason: "메시지 조회에 실패했습니다" },
      };
    }
  };

  // 모달이 열릴 때 API 호출
  useEffect(() => {
    const fetchData = async () => {
      if (isOpen && currentChatRoomId) {
        setLoading(true);
        setError(null);
        setSuggestion(null);

        try {
          // 1. getCoffectId API 호출
          const coffectIdResponse = await getCoffectId(currentChatRoomId);

          if (
            coffectIdResponse.resultType !== "SUCCESS" ||
            !coffectIdResponse.success
          ) {
            throw new Error(
              coffectIdResponse.error?.reason ||
                "커피챗 제안 아이디를 찾을 수 없습니다.",
            );
          }

          const coffectId = coffectIdResponse.success;
          console.log("coffectId:", coffectId);

          // 2. messageShowUp API 호출
          const messageResponse = await getMessageShowUp(coffectId);

          if (
            messageResponse.resultType === "SUCCESS" &&
            messageResponse.success
          ) {
            const suggestionData = {
              message: messageResponse.success.message,
              requestTime: new Date(
                messageResponse.success.createdAt,
              ).toLocaleString("ko-KR"),
            };
            setSuggestion(suggestionData);
          } else {
            throw new Error(
              messageResponse.error?.reason ||
                "해당 coffectId에 대한 메시지를 찾을 수 없습니다.",
            );
          }
        } catch (err) {
          console.error("데이터 조회 실패:", err);
          if (err && typeof err === "object" && "response" in err) {
            const axiosError = err as { response?: { status?: number } };
            if (axiosError.response?.status === 500) {
              setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            } else {
              setError(
                err instanceof Error
                  ? err.message
                  : "데이터를 불러올 수 없습니다.",
              );
            }
          } else {
            setError(
              err instanceof Error
                ? err.message
                : "데이터를 불러올 수 없습니다.",
            );
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [isOpen, currentChatRoomId]);

  // 시간표 데이터를 파싱해서 공강시간만 표시하는 함수
  const formatAvailableTime = (timeData: string): string => {
    try {
      // 시간표 데이터가 JSON 문자열인지 확인
      if (timeData && timeData.startsWith("[") && timeData.endsWith("]")) {
        const timeSlots = JSON.parse(timeData) as string[];
        console.log("파싱된 시간대:", timeSlots);

        if (Array.isArray(timeSlots) && timeSlots.length > 0) {
          // getCommonFreeTime 함수를 사용하여 시간대를 포맷팅
          // 단일 시간표를 처리하기 위해 빈 문자열과 비교
          const result = getCommonFreeTime(
            JSON.stringify(timeSlots),
            JSON.stringify(timeSlots),
          );

          return result;
        }
      }

      // 파싱할 수 없거나 빈 데이터인 경우 기본값 반환

      return timeData || "겹치는 공강 시간 없음";
    } catch {
      return timeData || "겹치는 공강 시간 없음";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative mx-auto w-[90%] max-w-[340px] min-w-[200px] rounded-2xl bg-[var(--white)] px-6 py-7 shadow-lg max-[320px]:px-3 max-[320px]:py-4">
        <button
          className="absolute top-4 right-4 max-[340px]:top-2 max-[340px]:right-2"
          onClick={onClose}
        >
          <X size={24} className="max-[340px]:h-4 max-[340px]:w-4" />
        </button>
        <div className="mb-4 text-sm font-medium text-[var(--gray-30)] max-[340px]:text-xs">
          {loading ? "로딩 중..." : suggestion?.requestTime || requestTime}
        </div>
        <div className="flex items-center gap-2 text-base font-semibold max-[340px]:text-xs">
          <span className="text-[20px] max-[340px]:text-[16px]">✉️</span>
          {opponentName}님의 메시지
        </div>
        <div className="mb-4 border-b border-[var(--gray-10)] py-3 text-[14px] font-medium text-[var(--gray-70)] max-[340px]:py-3 max-[340px]:text-xs">
          {loading
            ? "로딩 중..."
            : error
              ? error
              : suggestion?.message || requestMessage}
        </div>
        <div className="mt-4 mb-2 flex items-center gap-2 text-base font-semibold max-[340px]:text-xs">
          <span className="text-[16px] max-[340px]:text-[16px]">⏰</span>
          나와 겹치는 공강시간
        </div>
        <div className="flex justify-center">
          <div className="mt-2 flex min-h-[60px] w-full flex-wrap items-start justify-start rounded-xl bg-[var(--gray-5)] px-4 py-3 text-sm font-medium max-[340px]:min-h-[50px] max-[340px]:px-2 max-[340px]:text-xs">
            {formatAvailableTime(availableTime)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;
