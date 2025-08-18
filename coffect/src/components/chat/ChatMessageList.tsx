/*
 * author : 앨리스/박은지
 * description : 메시지 리스트
 * 시간 표시 조건부 추가
 */

import React from "react";
import MessageBubble from "./MessageBubble";
import ImageMessageBubble from "./ImageMessageBubble";
import type { Message } from "../../types/chat";

interface Props {
  messages: Message[];
  getMessageMargin: (idx: number, messages: Message[]) => string;
  opponentProfileImage?: string;
}

const ChatMessageList: React.FC<Props> = ({
  messages,
  getMessageMargin,
  opponentProfileImage,
}) => {
  // 같은 시간대의 메시지 중 마지막 메시지에만 시간 표시
  const shouldShowTime = (idx: number): boolean => {
    const currentMsg = messages[idx];
    const nextMsg = messages[idx + 1];

    // 일반 메시지인 경우 mine 속성 비교
    if (currentMsg.type === "text" || currentMsg.type === "image") {
      if (nextMsg && (nextMsg.type === "text" || nextMsg.type === "image")) {
        return (
          currentMsg.time !== nextMsg.time || currentMsg.mine !== nextMsg.mine
        );
      }
      return true; // 다음 메시지가 없는 경우
    }

    return true;
  };

  return (
    <>
      {messages.map((msg, idx) => {
        // 일반 메시지 처리 (text 또는 image)
        if (msg.type === "text" || msg.type === "image") {
          const prevMsg = messages[idx - 1];
          const showProfile = !msg.mine && (!prevMsg || prevMsg.mine);

          return (
            <div
              key={`${msg.id}-${idx}`}
              className={`w-full ${getMessageMargin(idx, messages)} ${msg.mine ? "justify-end" : "justify-start"} flex`}
            >
              {msg.type === "image" ? (
                <ImageMessageBubble
                  mine={msg.mine}
                  imageUrl={msg.imageUrl}
                  showProfile={showProfile}
                  profileImage={opponentProfileImage}
                  time={msg.time}
                  showTime={shouldShowTime(idx)}
                />
              ) : (
                <MessageBubble
                  text={msg.text}
                  time={msg.time}
                  mine={msg.mine}
                  showProfile={showProfile}
                  showTime={shouldShowTime(idx)}
                  profileImage={opponentProfileImage}
                />
              )}
            </div>
          );
        }

        return null;
      })}
    </>
  );
};

export default ChatMessageList;
