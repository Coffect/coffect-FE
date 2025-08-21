/*
 * author : 앨리스/박은지
 * description : 채팅방 관심사 섹션
 */

import { useNavigate } from "react-router-dom";
import { Calendar, Mail, ChevronUp } from "lucide-react";
import ChatInterestTags from "./ChatInterestTags";

interface Schedule {
  date: string | Date;
  time: string;
  place?: string;
  alert?: string | null;
  opponentId?: number | null; // 상대방 ID
  isMyRequest?: boolean; // 내가 제안한 것인지 여부
}

interface ChatInterestsSectionProps {
  interests: string[];
  schedule: Schedule | null;
  onOpenModal: () => void;
  showInterests: boolean;
  onToggleInterests: () => void;
  chatRoomId?: string;
  isMyRequest: boolean; // 내가 보낸 제안인지 여부
}

const ChatInterestsSection = ({
  interests,
  schedule,
  onOpenModal,
  showInterests,
  onToggleInterests,
  chatRoomId,
  isMyRequest,
}: ChatInterestsSectionProps) => {
  const navigate = useNavigate();

  // isMyRequest 디버깅 로그
  console.log("=== ChatInterestsSection isMyRequest 디버깅 ===");
  console.log("isMyRequest prop:", isMyRequest, "타입:", typeof isMyRequest);
  console.log("schedule:", schedule);
  console.log(
    "schedule?.isMyRequest:",
    schedule?.isMyRequest,
    "타입:",
    typeof schedule?.isMyRequest,
  );

  const formatScheduleDate = (date: string | Date) => {
    let dateObj: Date;

    if (typeof date === "string") {
      // ISO 문자열인 경우 Date 객체로 변환
      if (date.includes("-") || date.includes("T")) {
        dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
          // 유효하지 않은 ISO 문자열인 경우 그대로 반환
          return date.replace(/ /g, "\u00A0");
        }
      } else {
        // "x월 x일" 형식인 경우 그대로 반환
        return date.replace(/ /g, "\u00A0");
      }
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return "";
    }

    // 모든 Date 객체를 일관된 형식으로 변환
    return dateObj
      .toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
      })
      .replace(/ /g, "\u00A0");
  };

  // 시간 형식 개선
  const formatScheduleTime = (time: string) => {
    if (!time) return "";

    // 이미 적절한 형식인 경우 그대로 반환
    if (time.includes(":") && (time.includes("시") || time.includes("분"))) {
      return time;
    }

    // ISO 시간 문자열인 경우 변환
    if (time.includes("T") || time.includes(":")) {
      try {
        const timeObj = new Date(`2000-01-01T${time}`);
        if (!isNaN(timeObj.getTime())) {
          return timeObj.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
        }
      } catch (error) {
        console.log("시간 변환 실패:", error);
      }
    }

    // 변환할 수 없는 경우 그대로 반환
    return time;
  };

  return (
    <>
      {showInterests ? (
        <div className="border-b border-[var(--gray-5)] bg-[var(--white)] px-4 pt-3 pb-3">
          {/* 텍스트 + 토글 아이콘 */}
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[16px] font-semibold text-[var(--gray-70)]">
              이런 주제에 관심 있대요!
            </span>
            <button
              type="button"
              onClick={onToggleInterests}
              aria-label="관심사 섹션 접기"
              aria-expanded={true}
              className="cursor-pointer rounded-full bg-[var(--gray-5)] p-1 text-[var(--gray-50)]"
            >
              <ChevronUp size={24} aria-hidden="true" />
            </button>
          </div>
          <div className="mb-3 flex flex-wrap gap-1">
            <ChatInterestTags interests={interests} />
          </div>
          {/* 일정 정보 표시 및 버튼 영역 */}
          <div className="flex w-full items-center gap-2">
            {schedule && (
              <button
                className="flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md border border-[var(--gray-10)] bg-[var(--white)] py-2 text-[16px] font-medium whitespace-nowrap text-[var(--gray-90)] sm:text-sm"
                onClick={() => {
                  if (chatRoomId) {
                    navigate(`/chat/${chatRoomId}/schedule`, {
                      state: { schedule: schedule },
                    });
                  }
                }}
              >
                <Calendar size={18} className="text-[var(--gray-40)]" />
                <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                  {formatScheduleDate(schedule.date)}{" "}
                  {formatScheduleTime(schedule.time)}
                </span>
              </button>
            )}
            {schedule && (
              <button
                className="flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md border border-[var(--gray-10)] bg-[var(--white)] py-2 text-xs font-medium text-ellipsis whitespace-nowrap text-[var(--gray-70)] sm:text-sm"
                onClick={onOpenModal}
              >
                <Mail size={16} className="text-[var(--gray-40)]" />
                <span className="block overflow-hidden text-[16px] font-medium whitespace-nowrap">
                  {(() => {
                    const buttonText = isMyRequest
                      ? "나의 요청 보기"
                      : "상대 요청 보기";
                    console.log("=== 일정 있을 때 버튼 텍스트 결정 ===");
                    console.log("isMyRequest:", isMyRequest);
                    console.log("버튼 텍스트:", buttonText);
                    return buttonText;
                  })()}
                </span>
              </button>
            )}
          </div>
          {!schedule && (
            <div className="flex gap-2">
              <button
                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[var(--gray-10)] py-2 text-sm font-medium text-[var(--gray-70)]"
                onClick={() => {
                  console.log("chatRoomId:", chatRoomId);
                  if (chatRoomId) {
                    const url = `/chat/${chatRoomId}/schedule`;

                    navigate(url);
                  } else {
                    console.log("chatRoomId가 없습니다!");
                  }
                }}
              >
                <Calendar size={17} />
                <span className="leading-none">커피챗 일정 등록</span>
              </button>
              <button
                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[var(--gray-10)] bg-[var(--white)] py-2 text-sm font-medium text-[var(--gray-70)]"
                onClick={onOpenModal}
              >
                <Mail size={17} />
                <span className="leading-none">
                  {(() => {
                    // 일정이 없을 때는 항상 "나의 요청 보기" (내가 제안할 수 있음)
                    const buttonText = "나의 요청 보기";
                    console.log("=== 일정 없을 때 버튼 텍스트 결정 ===");
                    console.log("isMyRequest:", isMyRequest);
                    console.log("버튼 텍스트:", buttonText);
                    console.log("해석: 일정이 없으므로 내가 제안할 수 있음");
                    return buttonText;
                  })()}
                </span>
              </button>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};

export default ChatInterestsSection;
