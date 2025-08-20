/*
 * author : 앨리스/박은지
 * description : [상대 요청 보기] 모달 컴포넌트
 * 요청시간은 커피챗 제안 플로우에서 연결 필요, 시간표-임시 텍스트
 */

import { X } from "lucide-react";
import { getCommonFreeTime } from "../../hooks/useTimeTable";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  opponentName?: string; // 상대방 이름
  requestMessage?: string; // 상대방의 요청 메시지
  requestTime?: string; // 요청 시간
  availableTime?: string; // 상대방의 가능한 시간
  isMyRequest?: boolean; // 내가 보낸 제안인지 여부
}

const RequestModal = ({
  isOpen,
  onClose,
  opponentName = "상대방",
  requestMessage = "상대방의 요청 메시지가 없습니다.",
  requestTime = "요청 시간 정보가 없습니다.",
  availableTime = "가능한 시간 정보가 없습니다.",
  isMyRequest = false,
}: RequestModalProps) => {
  if (!isOpen) return null;

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
          {requestTime}
        </div>
        <div className="flex items-center gap-2 text-base font-semibold max-[340px]:text-xs">
          <span className="text-[20px] max-[340px]:text-[16px]">✉️</span>
          {isMyRequest ? `${opponentName}님의 메시지` : "나의 메시지"}
        </div>
        <div className="mb-4 border-b border-[var(--gray-10)] py-3 text-[14px] font-medium text-[var(--gray-70)] max-[340px]:py-3 max-[340px]:text-xs">
          {requestMessage}
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
