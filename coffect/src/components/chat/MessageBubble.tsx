// author : 앨리스/박은지
// description : 채팅방 메세지 버블
// 메세지 버블 형태 및 시간 표시 컴포넌트

import React from "react";

interface MessageBubbleProps {
  text: string;
  time: string;
  mine: boolean;
  showProfile: boolean;
}

const bubbleBase =
  "max-w-[75%] rounded-lg px-3 py-2 text-xs leading-relaxed whitespace-pre-line";
const myBubble = `${bubbleBase} bg-[rgba(58,58,58,1)] text-white px-4`;
const otherBubble = `${bubbleBase} bg-white text-[rgba(45,45,45,1)]`;
const timeText =
  "mb-1 text-[11px] text-[rgba(132,132,132,1)] whitespace-nowrap";

const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  time,
  mine,
  showProfile,
}) => {
  if (mine) {
    return (
      <div className="flex items-end justify-end gap-2">
        <span className={`mr-1 ${timeText}`}>{time}</span>
        <div className={myBubble}>{text}</div>
      </div>
    );
  }
  return (
    <div className="flex flex-row items-start gap-2">
      {showProfile ? (
        <div className="h-7 w-7 flex-shrink-0 rounded-full border border-gray-200 bg-gray-300" />
      ) : (
        <div className="h-7 w-7 flex-shrink-0" />
      )}
      <div className="flex flex-row items-end">
        <div className={otherBubble}>{text}</div>
        <span className={`ml-1 self-end ${timeText}`}>{time}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
