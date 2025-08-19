/*
author : 썬더
description : 프로필 설정 화면 (프로필 사진 선택 및 사용자 이름 입력)
*/

import React, { useEffect, useState, useRef } from "react";
import profilePencilImage from "../../assets/icon/signup/profilePencil.png";
import defaultAvatarImage from "../../assets/icon/signup/defaultAvatar.png";
import SignupPageLayout from "./shared/SignupLayout";
import type { StepProps } from "../../types/signup";

const ProfileSetup: React.FC<StepProps> = ({ onNext, onUpdate }) => {
  // 상태 선언
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // 미리보기용 DataURL
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // 최종 전송용 이미지 파일
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 프로필 사진 선택
  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file); // 이미지파일 저장
    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(reader.result as string); //미리보기 URL
    reader.readAsDataURL(file);
  };

  // 이름 입력 핸들러
  const handleNameChange = (value: string) => {
    setName(value);
    // 이름이 2자 이상이면 에러 해제
    if (
      value.trim().length >= 2 &&
      value.trim().length <= 7 &&
      /^[가-힣a-zA-Z\s]*$/.test(value.trim()) &&
      nameError
    )
      setNameError(false);
  };

  // 다음 단계
  const handleNext = (): void => {
    const trimmed = name.trim();
    if (
      !(
        trimmed.length >= 2 &&
        trimmed.length <= 7 &&
        /^[가-힣a-zA-Z\s]*$/.test(trimmed) &&
        !/[ㄱ-ㅎㅏ-ㅣ]/.test(trimmed)
      )
    ) {
      setNameError(true);
      return;
    }
    onUpdate?.({ name: trimmed, img: avatarFile || undefined }); // 부모에게 전달한 이름, 이미지 파일
    onNext?.();
  };
  // 버튼 비활성화 조건(이름x 또는 프로필사진 x)
  const isButtonDisabled = name.trim().length < 2 || !avatarUrl || !avatarFile;
  // 이름 2자 이상 입력 안하면 에러 메시지
  useEffect(() => {
    if (name.trim() === "") return;

    const timer = setTimeout(() => {
      setNameError(name.trim().length < 2);
    }, 500); // 500ms 동안 입력 멈추면 검사

    return () => clearTimeout(timer); // 입력 도중에는 이전 검사 취소
  }, [name]);

  useEffect(() => {
    // 진입 시 스크롤 막기
    document.body.style.overflow = "hidden";
    return () => {
      // 컴포넌트 종료 시 스크롤 다시 허용
      document.body.style.overflow = "auto";
    };
  }, []);

  //입력창 포커스 시 이동 위치
  const nameRef = useRef<HTMLInputElement>(null);

  return (
    <SignupPageLayout
      bottomButton={
        <button
          onClick={handleNext}
          disabled={isButtonDisabled}
          className={`w-full rounded-xl py-[4%] text-center text-lg font-semibold ${
            !isButtonDisabled
              ? "bg-[var(--gray-80)] text-[var(--gray-0)]"
              : "bg-[var(--gray-10)] text-[var(--gray-50)]"
          }`}
        >
          다음
        </button>
      }
    >
      <div className="pt-[10%] text-[var(--gray-90)]">
        {/* 제목 */}
        <h2 className="mb-10 self-start text-left text-[22px] font-bold">
          나의 프로필을 설정해주세요!
        </h2>

        {/* 프로필 이미지 업로드 */}
        <div className="mb-10 flex justify-center">
          <div className="relative">
            <div
              className="flex h-[7.5rem] w-[7.5rem] items-center justify-center overflow-hidden rounded-full bg-[var(--gray-10)]"
              onClick={handleAvatarClick}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={defaultAvatarImage}
                  alt="기본 프로필"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <button
              onClick={handleAvatarClick}
              className="absolute right-1 bottom-1 mt-2 h-[2.3rem] w-[2.3rem] rounded-full bg-[var(--gray-70)] pl-[10px] text-[var(--gray-0)]"
            >
              <img
                src={profilePencilImage}
                alt="avatar"
                className="h-[65%] w-[65%] object-cover"
              />
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
        <div>
          <label className="mb-2 block text-lg font-semibold text-[var(--gray-90)]">
            이름
          </label>
          <input
            ref={nameRef}
            type="text"
            placeholder="이름을 입력해주세요(최소 2자)"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            onFocus={() =>
              setTimeout(() => {
                nameRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }, 5)
            }
            className="flex h-[48px] w-full scroll-mb-[100px] items-center rounded-[8px] border-[1.5px] border-[var(--gray-10)] px-3 py-2 text-base font-normal text-[var(--gray-90)] placeholder-[var(--gray-30)] focus-within:border-[2px] focus-within:border-gray-900 focus:ring-0 focus:outline-none"
          />
          {nameError && (
            <p className="mt-1 text-xs text-[var(--noti)]">
              영문/한글/공백 조합 2글자 이상 7자 이하
            </p>
          )}
        </div>
      </div>
    </SignupPageLayout>
  );
};

export default ProfileSetup;
