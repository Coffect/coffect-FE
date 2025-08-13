/*
 * author : 앨리스/박은지
 * description : 채팅방 관심 주제 섹션
 */

import { Calendar, Mail, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChatInterestTags from "./ChatInterestTags";
import { formatAmPmTo24Hour } from "../../utils/dateUtils";
import type { ChatUser } from "./hooks/useChatUser";
import type { Schedule } from "./hooks/useSchedule";
import type { MouseEvent } from "react";

interface ChatInterestSectionProps {
  user: ChatUser;
  schedule: Schedule | null;
  showInterests: boolean;
  handleToggleInterests: (e: MouseEvent<HTMLButtonElement>) => void;
  openModal: () => void;
}

export const ChatInterestSection = ({
  user,
  schedule,
  showInterests,
  handleToggleInterests,
  openModal,
}: ChatInterestSectionProps) => {
  const navigate = useNavigate();

  if (showInterests) {
    return (
      <div className="border-b border-[var(--gray-5)] bg-[var(--white)] px-4 pt-3 pb-3">
        {/* 텍스트 + 토글 아이콘 */}
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[16px] font-semibold text-[var(--gray-70)]">
            이런 주제에 관심 있대요!
          </span>
          <button
            type="button"
            aria-label="관심사 접기"
            onClick={handleToggleInterests}
            className="rounded-full bg-[var(--gray-5)] p-1 text-[var(--gray-50)]"
          >
            <ChevronUp size={24} />
          </button>
        </div>
        <div className="mb-3 flex flex-wrap gap-1">
          <ChatInterestTags interests={user.interests} />
        </div>
        {/* 일정 정보 표시 및 버튼 영역 */}
        <div className="flex w-full items-center gap-2">
          {schedule && (
            <button
              className="flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md border border-[var(--gray-10)] bg-[var(--white)] py-2 text-[16px] font-medium whitespace-nowrap text-[var(--gray-90)] sm:text-sm"
              onClick={() =>
                navigate("/chat/schedule", { state: { schedule } })
              }
            >
              <Calendar size={18} className="text-[var(--gray-40)]" />
              <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                {schedule.date
                  ? typeof schedule.date === "string"
                    ? schedule.date.replace(/ /g, "\u00A0")
                    : schedule.date instanceof Date
                      ? schedule.date
                          .toLocaleDateString("ko-KR", {
                            month: "long",
                            day: "numeric",
                          })
                          .replace(/ /g, "\u00A0")
                      : ""
                  : ""}{" "}
                {formatAmPmTo24Hour(schedule.time)}
              </span>
            </button>
          )}
          {schedule && (
            <button
              className="flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md border border-[var(--gray-10)] bg-[var(--white)] py-2 text-xs font-medium text-ellipsis whitespace-nowrap text-[var(--gray-70)] sm:text-sm"
              onClick={openModal}
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
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[var(--gray-10)] py-4 text-[16px] font-medium text-[var(--gray-70)]"
              onClick={() => navigate("/chat/schedule")}
            >
              <Calendar size={17} />
              <span className="leading-none">커피챗 일정 등록</span>
            </button>
            <button
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[var(--gray-10)] bg-[var(--white)] py-4 text-[16px] font-medium text-[var(--gray-70)]"
              onClick={openModal}
            >
              <Mail size={17} />
              <span className="leading-none">상대 요청 보기</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex justify-end bg-[var(--gray-5)] px-4 py-2">
      {/* 닫힌 상태에서는 빈 공간만 유지 */}
    </div>
  );
};
