/*
 * author : 앨리스/박은지
 * description : 채팅방 내부 입력창
 */

import React, { useRef, useState } from "react";
import { Plus, Send, X as XIcon } from "lucide-react";

interface ChatInputBoxProps {
  inputValue: string;
  setInputValue: (v: string) => void;
  handleSend: (msg: string) => void;
  onImageSend?: (file: File) => void;
  disabled?: boolean;
}

const ChatInputBox: React.FC<ChatInputBoxProps> = ({
  inputValue,
  setInputValue,
  handleSend,
  onImageSend,
  disabled = false,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [showImageOptions, setShowImageOptions] = useState(false);

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
    setShowImageOptions(true);
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
    setShowImageOptions(false);
  };
  const handleGalleryClick = () => {
    galleryInputRef.current?.click();
    setShowImageOptions(false);
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
        <div className="flex w-full items-center rounded-full bg-[rgba(245,245,245,1)] px-[14px] py-2">
          <div className="relative">
            <button
              className={`mr-2 flex h-8 w-8 items-center justify-center rounded-full ${
                disabled
                  ? "cursor-not-allowed bg-[rgba(200,200,200,1)]"
                  : "cursor-pointer bg-[rgba(74,74,74,1)]"
              } text-white`}
              onClick={disabled ? undefined : handlePlusClick}
              type="button"
              disabled={disabled}
            >
              <Plus size={22} />
            </button>
            {/* 이미지 업로드 옵션 모달 */}
            {showImageOptions && (
              <div
                className="absolute bottom-11 -left-1 z-50 flex flex-col rounded-xl border border-[var(--gray-5)] bg-white shadow-lg"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setShowImageOptions(false);
                }}
                style={{ minWidth: 180 }}
              >
                <button
                  className="w-full rounded-t-xl px-3 py-2 text-left text-sm hover:bg-[var(--gray-10)]"
                  onClick={handleCameraClick}
                  type="button"
                >
                  카메라로 촬영
                </button>
                <div className="mx-0.5 h-px bg-[var(--gray-5)]" />
                <button
                  className="w-full rounded-b-xl px-3 py-2 text-left text-sm hover:bg-[var(--gray-10)]"
                  onClick={handleGalleryClick}
                  type="button"
                >
                  갤러리에서 선택
                </button>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={cameraInputRef}
            style={{ display: "none" }}
            capture="environment"
            onChange={handleFileChange}
          />
          <input
            type="file"
            accept="image/*"
            ref={galleryInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <textarea
            ref={inputRef}
            className={`flex-1 resize-none rounded-full px-3 py-2 text-[16px] outline-none ${
              disabled ? "cursor-not-allowed bg-gray-100" : ""
            } placeholder:text-[var(--gray-30)]`}
            placeholder={
              disabled ? "채팅방을 로딩 중입니다..." : "메시지를 입력해주세요"
            }
            value={inputValue}
            onChange={
              disabled ? undefined : (e) => setInputValue(e.target.value)
            }
            onKeyDown={
              disabled
                ? undefined
                : (e) => {
                    // Enter로 전송, Shift+Enter로 줄바꿈
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      trySend();
                    }
                  }
            }
            style={{ fontSize: "16px", minHeight: "40px", maxHeight: "120px" }}
            rows={1}
            disabled={disabled}
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
