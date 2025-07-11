// author : 앨리스/박은지
// description : 채팅방 내부 입력창

import React from "react";
import { Plus, Send } from "lucide-react";

interface ChatInputBoxProps {
  inputValue: string;
  setInputValue: (v: string) => void;
  handleSend: (msg: string) => void;
}

const ChatInputBox: React.FC<ChatInputBoxProps> = ({
  inputValue,
  setInputValue,
  handleSend,
}) => (
  <div className="border-t border-gray-100 bg-white px-0 py-3">
    <div className="mx-auto flex w-[95%] items-center rounded-full bg-[rgba(245,245,245,1)] px-2 py-2">
      <button className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(74,74,74,1)] text-white">
        <Plus size={22} />
      </button>
      <input
        className="flex-1 rounded-full px-1 py-2 text-base outline-none placeholder:text-[rgba(172,172,172,1)]"
        placeholder="메시지를 입력해주세요"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && inputValue.trim()) handleSend(inputValue);
        }}
        style={{ fontSize: "16px" }}
      />
      <button
        className="ml-2 flex h-8 w-12 items-center justify-center rounded-full bg-[rgba(255,129,38,1)] text-white"
        onClick={() => {
          if (inputValue.trim()) handleSend(inputValue);
        }}
      >
        <Send size={20} />
      </button>
    </div>
  </div>
);

export default ChatInputBox;
