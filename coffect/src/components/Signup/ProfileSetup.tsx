/*
author : 썬더
description : 프로필 설정 화면 (프로필 사진 선택 및 사용자 이름 입력)
*/

import React, { useState, useRef } from "react";
import type { SignupData } from "../../types/signup";
import { Pencil } from "lucide-react";

type Props = {
  onNext: () => void; // 다음 단계로 이동
  onChange: (fields: Partial<SignupData>) => void; // 입력된 프로필 데이터를 부모에게 전달
};

const ProfileSetup: React.FC<Props> = ({ onNext, onChange }) => {
  // 상태 선언
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 프로필 사진 선택
  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  // 이름 입력 핸들러
  const handleNameChange = (value: string) => {
    setName(value);
    if (nameError && value.trim()) setNameError(false);
  };

  // 다음 단계
  const handleNext = (): void => {
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError(true);
      return;
    }
    onChange({ username: trimmed, avatar: avatarUrl || undefined });
    onNext();
  };

  return (
    <div className="flex h-full w-full flex-col bg-white px-[6%] py-[2%]">
      <div className="pt-[10%]">
        {/* 제목 */}
        <h2 className="mb-10 self-start text-left text-lg leading-snug font-bold">
          나의 프로필을 설정해주세요!
        </h2>
        {/* 프로필 이미지 업로드 */}
        <div className="mb-10 flex justify-center">
          <div className="relative">
            <div
              className="flex h-[7rem] w-[7rem] items-center justify-center overflow-hidden rounded-full bg-gray-200"
              onClick={handleAvatarClick}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-gray-400">👤</div>
              )}
            </div>
            <button
              onClick={handleAvatarClick}
              className="absolute right-0 bottom-0 mt-2 h-[2rem] w-[2rem] rounded-full bg-black pl-[6px] text-white"
            >
              <Pencil size={20} />
            </button>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            multiple={false}
            onChange={handleFileChange}
          />
        </div>
        {/* 이름 입력 */}
        <div className="mb-auto">
          <label className="mb-[3%] block text-[1rem] font-bold text-gray-700">
            이름
          </label>
          <input
            type="text"
            placeholder="이름을 입력해주세요"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)} // 이름 업데이트
            className="w-full flex-7 rounded border border-gray-300 px-3 py-2 text-sm focus:border-[2px] focus:border-gray-900 focus:ring-0 focus:outline-none"
          />
          {nameError && (
            <p className="mt-1 text-xs text-red-500">이름을 입력해주세요.</p>
          )}
        </div>
      </div>

      {/* 다음 버튼 */}
      <div className="absolute bottom-[4%] left-0 w-full px-[6%]">
        <button
          onClick={handleNext}
          className={`mt-auto w-full rounded-xl px-3 py-3 text-center text-lg ${
            name.trim() ? "bg-black text-white" : "bg-[#E4E4E4] text-gray-500"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default ProfileSetup;
