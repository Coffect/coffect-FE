/*
 * author : 앨리스/박은지
 * description : 채팅방 메시지 영역
 */

import { useRef } from "react";
import ChatMessageList from "./ChatMessageList";
import { ChatSystemMessage } from "./ChatSystemMessage";
import useAutoScroll from "./hooks/useAutoScroll";
import type { Message } from "../../types/chat";

interface ChatMessageAreaProps {
  messages: Message[];
  username?: string;
}

function getMessageMargin(idx: number, messages: Message[]) {
  if (idx === 0) return "mt-4";
  const prev = messages[idx - 1];
  const current = messages[idx];

  // 연속된 메시지의 발신자가 다른 경우 더 큰 여백 적용
  return prev.mine !== current.mine ? "mt-6" : "mt-2";
}

const ChatMessageArea = ({ messages, username }: ChatMessageAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useAutoScroll(messagesEndRef, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--gray-5)] px-4 py-2">
      {/* 시스템 메시지 */}
      <ChatSystemMessage username={username || "상대방"} />

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
