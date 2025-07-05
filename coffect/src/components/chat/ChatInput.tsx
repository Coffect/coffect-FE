// author : 앨리스/박은지
// description : 채팅방 내부 입력창
// 메시지 입력 시 엔터키 입력 시 메시지 전송

import React from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSend: (msg: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      onSend(value);
    }
  };
  return (
    <div className="mx-auto flex w-full max-w-screen-sm items-center border-t border-gray-500 px-4 py-2">
      <button className="mr-2 flex h-8 w-8 items-center justify-center text-2xl">
        +
      </button>
      <input
        className="mr-2 flex-1 rounded-full border border-gray-500 px-4 py-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메시지 입력..."
      />
      <button className="flex h-8 w-8 items-center justify-center text-2xl">
        <Send />
      </button>
    </div>
  );
};

export default ChatInput;
