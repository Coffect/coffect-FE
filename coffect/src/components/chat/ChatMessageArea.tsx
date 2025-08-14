/*
 * author : 앨리스/박은지
 * description : 채팅방 메시지 영역
 */

import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import ChatMessageList from "./ChatMessageList";
import { ChatSystemMessage } from "./ChatSystemMessage";
import useAutoScroll from "./hooks/useAutoScroll";
import { getMessageMargin } from "./utils/chatUtils";
import type { Message } from "../../types/chat";

interface ChatMessageAreaProps {
  messages: Message[];
  username?: string;
  opponentProfileImage?: string;
  showInterests?: boolean;
  onToggleInterests?: () => void;
}

const ChatMessageArea = ({
  messages,
  username,
  opponentProfileImage,
  showInterests,
  onToggleInterests,
}: ChatMessageAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useAutoScroll(messagesEndRef, messages);

  return (
    <div className="relative flex-1 overflow-y-auto bg-[var(--gray-5)] px-4 py-2">
      {/* 플로팅 버튼 - 관심사가 닫혀있을 때만 표시 */}
      {!showInterests && onToggleInterests && (
        <div className="sticky top-1 z-50 -mr-2 mb-0 flex justify-end">
          <button
            type="button"
            onClick={onToggleInterests}
            aria-label="관심사 섹션 펼치기"
            aria-expanded={false}
            className="cursor-pointer rounded-full bg-[var(--white)] p-1 text-[var(--gray-50)] shadow-[0_4px_12px_0_rgba(0,0,0,0.15)] transition-shadow duration-200 hover:shadow-[0_6px_16px_0_rgba(0,0,0,0.2)]"
          >
            <ChevronDown size={24} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* 시스템 메시지 */}
      <div className={showInterests ? "mt-2" : "-mt-6"}>
        <ChatSystemMessage username={username || "상대방"} />
      </div>

      <ChatMessageList
        messages={messages}
        getMessageMargin={getMessageMargin}
        opponentProfileImage={opponentProfileImage}
      />

      {/* 스크롤 타겟 */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageArea;
