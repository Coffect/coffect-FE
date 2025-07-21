// author : 앨리스/박은지
// description : 채팅방 메세지 버블
// 메세지 버블 형태 및 시간 표시 컴포넌트

import React from "react";

interface MessageBubbleProps {
  text: string;
  time: string;
  mine: boolean;
  showProfile: boolean;
  showTime?: boolean;
}

const bubbleBase =
  "max-w-[75%] rounded-lg px-3 py-2 text-xs leading-relaxed whitespace-pre-line";
const myBubble = `${bubbleBase} bg-[var(--gray-80)] text-[var(--white)] px-4`;
const otherBubble = `${bubbleBase} bg-[var(--white)] text-[var(--gray-80)]`;
const timeText = "mb-1 text-[11px] text-[var(--gray-40)] whitespace-nowrap";

const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  time,
  mine,
  showProfile,
  showTime = true,
}) => {
  if (mine) {
    return (
      <div className="flex items-end justify-end gap-2">
        <span className={`mr-1 ${timeText} ${!showTime ? "invisible" : ""}`}>
          {showTime ? time : "\u00A0"}
        </span>
        <div className={myBubble}>{text}</div>
      </div>
    );
  }
  return (
    <div className="flex flex-row items-start gap-2">
      {showProfile ? (
        <div className="h-8 w-8 flex-shrink-0 rounded-full border border-[var(--gray-10)] bg-[var(--gray-20)]" />
      ) : (
        <div className="h-8 w-8 flex-shrink-0" />
      )}
      <div className="flex min-w-0 flex-row items-end">
        <div className={otherBubble}>{text}</div>
        <span
          className={`ml-1 flex-shrink-0 self-end ${timeText} ${!showTime ? "invisible" : ""}`}
        >
          {showTime ? time : "\u00A0"}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
