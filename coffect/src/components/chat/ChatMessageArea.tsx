/*
 * author : 앨리스/박은지
 * description : 채팅방 메시지 영역
 */

import { useRef } from "react";
import ChatMessageList from "./ChatMessageList";
import useAutoScroll from "./hooks/useAutoScroll";
import type { Message } from "../../types/chat";

interface ChatMessageAreaProps {
  messages: Message[];
}

function getMessageMargin(idx: number, messages: Array<{ mine: boolean }>) {
  if (idx === 0) return "mt-4";
  const prev = messages[idx - 1];
  return prev && prev.mine !== messages[idx].mine ? "mt-6" : "mt-2";
}

const ChatMessageArea = ({ messages }: ChatMessageAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useAutoScroll(messagesEndRef, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--gray-5)] px-4 py-2">
      {/* 시스템 메시지 */}
      <div className="my-4 flex justify-center">
        <span className="mb-3 rounded-full px-3 text-xs font-medium text-[var(--gray-40)]">
          인하님이 제안을 수락했어요!
        </span>
      </div>

      <ChatMessageList
        messages={messages}
        getMessageMargin={getMessageMargin}
      />

      {/* 스크롤 타겟 */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageArea;
