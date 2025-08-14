/*
 * author : 앨리스/박은지
 * description : 채팅방 메시지 영역
 */

import { useRef } from "react";
import ChatMessageList from "./ChatMessageList";
import { ChatSystemMessage } from "./ChatSystemMessage";
import useAutoScroll from "./hooks/useAutoScroll";
import { getMessageMargin } from "./utils/chatUtils";
import type { Message } from "../../types/chat";

interface ChatMessageAreaProps {
  messages: Message[];
  username?: string;
  opponentProfileImage?: string;
}

const ChatMessageArea = ({
  messages,
  username,
  opponentProfileImage,
}: ChatMessageAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useAutoScroll(messagesEndRef, messages);

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--gray-5)] px-4 py-2">
      {/* 시스템 메시지 */}
      <ChatSystemMessage username={username || "상대방"} />

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
