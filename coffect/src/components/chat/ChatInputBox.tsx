// author : 앨리스/박은지
// description : 채팅방 내부 입력창

import React, { useRef, useState } from "react";
import { Plus, Send, X as XIcon } from "lucide-react";

interface ChatInputBoxProps {
  inputValue: string;
  setInputValue: (v: string) => void;
  handleSend: (msg: string) => void;
  onImageSend?: (file: File) => void;
}

const ChatInputBox: React.FC<ChatInputBoxProps> = ({
  inputValue,
  setInputValue,
  handleSend,
  onImageSend,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const trySend = () => {
    if (imageFile) {
      onImageSend?.(imageFile);
      setImagePreview(null);
      setImageFile(null);
      return;
    }
    if (inputValue.trim().length === 0) return; // 공백만 입력된 경우 막기
    handleSend(inputValue); // 공백 포함 원본 그대로 전송
    setInputValue("");
    inputRef.current?.focus(); // 채팅을 전송 후에도 입력창 포커스 유지
  };

  const handlePlusClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="border-t border-gray-100 bg-white px-0 py-3">
      <div className="mx-auto flex w-[95%] flex-col items-center">
        {imagePreview && (
          <div className="relative mb-3 flex w-full items-center justify-start">
            <img
              src={imagePreview}
              alt="미리보기"
              className="ml-2 h-24 w-24 rounded-lg border border-gray-300 object-cover"
            />
            <button
              type="button"
              className="absolute -top-1 left-22 rounded-full bg-white p-1 shadow"
              onClick={handleRemoveImage}
            >
              <XIcon size={18} className="text-gray-500" />
            </button>
          </div>
        )}
        <div className="flex w-full items-center rounded-full bg-[rgba(245,245,245,1)] px-2 py-2">
          <button
            className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(74,74,74,1)] text-white"
            onClick={handlePlusClick}
            type="button"
          >
            <Plus size={22} />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <textarea
            ref={inputRef}
            className="flex-1 resize-none rounded-full px-3 py-2 text-base outline-none placeholder:text-[var(--gray-40)]"
            placeholder="메시지를 입력해주세요"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              // Enter로 전송, Shift+Enter로 줄바꿈
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                trySend();
              }
            }}
            style={{ fontSize: "16px", minHeight: "40px", maxHeight: "120px" }}
            rows={1}
          />
          {inputValue.trim().length > 0 && (
            <button
              className="ml-2 flex h-8 w-12 items-center justify-center rounded-full bg-[var(--orange-500)] text-white"
              onClick={trySend}
              type="button"
            >
              <Send size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInputBox;
