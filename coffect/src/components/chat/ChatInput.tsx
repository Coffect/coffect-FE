// author : 앨리스/박은지
// description : 채팅방 내부 입력창
// 메시지 입력 시 엔터키 입력 시 메시지 전송

import React from "react";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
};

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend }) => {
  return (
    <input
      className="w-full bg-transparent outline-none"
      type="text"
      placeholder="메시지를 입력해주세요"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSend();
      }}
    />
  );
};

export default ChatInput;
