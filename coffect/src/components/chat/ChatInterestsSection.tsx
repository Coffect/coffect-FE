/*
 * author : 앨리스/박은지
 * description : 채팅방 관심사 섹션
 */

import { useNavigate } from "react-router-dom";
import { Calendar, Mail, ChevronUp, ChevronDown } from "lucide-react";
import ChatInterestTags from "./ChatInterestTags";

interface Schedule {
  date: string | Date;
  time: string;
  place?: string;
  alert?: string | null;
}

interface ChatInterestsSectionProps {
  interests: string[];
  schedule: Schedule | null;
  onOpenModal: () => void;
  showInterests: boolean;
  onToggleInterests: () => void;
  chatRoomId?: string;
}

const ChatInterestsSection = ({
  interests,
  schedule,
  onOpenModal,
  showInterests,
  onToggleInterests,
  chatRoomId,
}: ChatInterestsSectionProps) => {
  const navigate = useNavigate();

  const formatScheduleDate = (date: string | Date) => {
    if (typeof date === "string") {
      return date.replace(/ /g, "\u00A0");
    }
    if (date instanceof Date) {
      return date
        .toLocaleDateString("ko-KR", {
          month: "long",
          day: "numeric",
        })
        .replace(/ /g, "\u00A0");
    }
    return "";
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
              onClick={onToggleInterests}
              className="cursor-pointer rounded-full bg-[var(--gray-5)] p-1 text-[var(--gray-50)]"
            >
              <ChevronUp size={24} />
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
                onClick={() =>
                  navigate(`/chat/${chatRoomId}/schedule`, {
                    state: { schedule },
                  })
                }
              >
                <Calendar size={18} className="text-[var(--gray-40)]" />
                <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                  {formatScheduleDate(schedule.date)} {schedule.time}
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
                  상대 요청 보기
                </span>
              </button>
            )}
          </div>
          {!schedule && (
            <div className="flex gap-2">
              <button
                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[var(--gray-10)] py-2 text-sm font-medium text-[var(--gray-70)]"
                onClick={() =>
                  navigate(`/chat/${chatRoomId}/schedule`)
                }
              >
                <Calendar size={17} />
                <span className="leading-none">커피챗 일정 등록</span>
              </button>
              <button
                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[var(--gray-10)] bg-[var(--white)] py-2 text-sm font-medium text-[var(--gray-70)]"
                onClick={onOpenModal}
              >
                <Mail size={17} />
                <span className="leading-none">상대 요청 보기</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-end bg-[var(--gray-5)] px-4 py-3">
          <button
            onClick={onToggleInterests}
            className="cursor-pointer rounded-full bg-[var(--white)] p-1 text-[var(--gray-50)] shadow-[0_0_12px_0_rgba(0,0,0,0.15)]"
          >
            <ChevronDown size={24} />
          </button>
        </div>
      )}
    </>
  );
};

export default ChatInterestsSection;
