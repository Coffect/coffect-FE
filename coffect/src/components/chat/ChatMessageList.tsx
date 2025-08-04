/*
 * author : 앨리스/박은지
 */
// description : 메시지 리스트
// 시간 표시 조건부 추가

import React from "react";
import MessageBubble from "./MessageBubble";
import ImageMessageBubble from "./ImageMessageBubble";
import type { Message } from "../../types/chat";

interface Props {
  messages: Message[];
  getMessageMargin: (idx: number, messages: Message[]) => string;
}

const ChatMessageList: React.FC<Props> = ({ messages, getMessageMargin }) => {
  // 같은 시간대의 메시지 중 마지막 메시지에만 시간 표시
  const shouldShowTime = (idx: number): boolean => {
    const currentMsg = messages[idx];
    const nextMsg = messages[idx + 1];

    // 마지막 메시지, 다음 메시지와 시간이 다를 때, 다른 사람의 메시지일 때 시간 표시
    return (
      !nextMsg ||
      currentMsg.time !== nextMsg.time ||
      currentMsg.mine !== nextMsg.mine
    );
  };

  return (
    <>
      {messages.map((msg, idx) => (
        <div
          key={msg.id}
          className={`w-full ${getMessageMargin(idx, messages)} ${msg.mine ? "justify-end" : "justify-start"} flex`}
        >
          {msg.type === "image" ? (
            <ImageMessageBubble
              mine={msg.mine}
              imageUrl={msg.imageUrl}
              showProfile={
                !msg.mine && (!messages[idx - 1] || messages[idx - 1].mine)
              }
            />
          ) : (
            <MessageBubble
              text={msg.text}
              time={msg.time}
              mine={msg.mine}
              showProfile={
                !msg.mine && (!messages[idx - 1] || messages[idx - 1].mine)
              }
              showTime={shouldShowTime(idx)}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default ChatMessageList;
