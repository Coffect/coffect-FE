/*
author : 썬더
description : 계정 정보 설정 화면 (아이디, 비밀번호 유효성 검사 및 설정)
*/

import React, { useState, useEffect, useRef } from "react";
import type { SignupData } from "../../types/signup";
import { isValidUserId, isValidPassword } from "../../utils/validation";
import { Eye, EyeOff } from "lucide-react";
import SignupPageLayout from "./shared/SignupLayout";
/*
  AccountSetup 컴포넌트가 받을 props 타입 정의
  onNext   – 입력 완료 후 다음 단계로 이동
*/
type Props = {
  onNext: () => void;
  onChange: (fields: Partial<SignupData>) => void;
};

const AccountSetup: React.FC<Props> = ({ onNext, onChange }) => {
  /* 입력값 상태 관리 */
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  /* 에러 상태 관리 */
  const [useridError, setUseridError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  /* 중복체크 상태 관리 */
  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);
  /*비밀번호 보기, 재확인 비밀번호 보기 */
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  /* 아이디, 비밀번호, 비밀번호 확인 유효성 검증 */
  const isUseridValid = isValidUserId(userid);
  const isPasswordValid = isValidPassword(password);
  const isConfirmValid = password === confirm;
  /*중복 확인 에러 메시지 띄우기*/
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "">("");
  const [showToast, setShowToast] = useState(false);
  /* 진행 가능 여부 */
  const canProceed = isUseridValid && isPasswordValid && isConfirmValid;

  /* 아이디 중복체크 핸들러(확인, 에러 메시지까지) */
  const handleCheckDuplicate = () => {
    // 추후 중복체크 API 구현 예정
    setIsDuplicateChecked(true);
    const isDuplicate = userid === "thunder"; // 예시: 중복 아이디
    if (isDuplicate) {
      setToastMessage("이미 존재하는 아이디입니다.");
      setToastType("error");
    } else {
      setToastMessage("아이디 중복 체크 완료");
      setToastType("success");
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  /* 다음 단계 이동 핸들러 */
  const handleNext = () => {
    const newUseridError = !isUseridValid;
    const newPasswordError = !isPasswordValid;
    const newConfirmError = !isConfirmValid;
    setUseridError(newUseridError);
    setPasswordError(newPasswordError);
    setConfirmError(newConfirmError);
    if (newUseridError || newPasswordError || newConfirmError) return;
    onChange({ userid, password });
    onNext();
  };

  /* 입력 변경 시 에러 및 중복체크 해제 */
  const onUseridChange = (value: string) => {
    setUserid(value);
    if (useridError && isValidUserId(value)) setUseridError(false);
    if (isDuplicateChecked) setIsDuplicateChecked(false);
  };
  const onPasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError && isValidPassword(value)) setPasswordError(false);
  };
  const onConfirmChange = (value: string) => {
    setConfirm(value);
    if (confirmError && value === password) setConfirmError(false);
  };
  //각 입력창에 포커스 시 해당 위치로 이동
  const useridRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 진입 시 스크롤 막기
    document.body.style.overflow = "hidden";
    return () => {
      // 컴포넌트 종료 시 스크롤 다시 허용
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <SignupPageLayout
      bottomButton={
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`w-full rounded-xl py-[4%] text-center text-lg font-semibold ${
            canProceed
              ? "bg-[var(--gray-80)] text-[var(--gray-0)]"
              : "bg-[var(--gray-10)] text-[var(--gray-50)]"
          }`}
        >
          다음
        </button>
      }
    >
      <h2 className="mb-[10%] pt-[10%] text-[22px] leading-normal font-bold text-[var(--gray-90)]">
        로그인에 사용할
        <br /> 계정 정보를 설정해주세요
      </h2>

      {/* 아이디 입력 */}
      <div className="mb-[10%]">
        <label className="mb-2 block text-lg font-semibold text-[var(--gray-90)]">
          아이디
        </label>
        <div className="flex items-center gap-[2%]">
          <input
            ref={useridRef}
            type="text"
            placeholder="5글자 이상"
            value={userid}
            onChange={(e) => onUseridChange(e.target.value)}
            onFocus={() =>
              setTimeout(() => {
                useridRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }, 5)
            }
            className="h-[48px] w-full flex-7 rounded-[8px] border-[1.5px] border-[var(--gray-10)] px-3 py-2 text-base font-medium text-[var(--gray-90)] placeholder-[var(--gray-30)] focus:border-[2px] focus:border-gray-900 focus:ring-0 focus:outline-none"
          />
          <button
            onClick={handleCheckDuplicate}
            disabled={userid.length < 1 || isDuplicateChecked}
            className={`h-[48px] flex-3 rounded-lg py-2 text-base font-medium ${
              userid.length >= 1 && !isDuplicateChecked
                ? "bg-[var(--gray-80)] text-[var(--gray-0)]"
                : "bg-[var(--gray-10)] text-[var(--gray-90)]"
            }`}
          >
            중복체크
          </button>
        </div>
        {useridError && (
          <p className="font-normalR mt-1 text-sm text-[var(--noti)]">
            영문/숫자/언더바 조합 5글자 이상
          </p>
        )}
      </div>

      {/* 비밀번호 입력 */}
      <div className="mb-[10%]">
        <label className="mb-2 block text-lg font-semibold text-[var(--gray-90)]">
          비밀번호
        </label>
        <div className="flex h-[48px] w-full items-center rounded-[8px] border-[1.5px] border-[var(--gray-10)] px-3 py-2 text-base text-[var(--gray-90)] focus-within:border-[2px] focus-within:border-gray-900 focus-within:ring-0 focus-within:outline-none">
          <input
            ref={passwordRef}
            type={showPassword ? "text" : "password"}
            placeholder="영문/숫자/특수기호 조합 8자 이상"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            onFocus={() =>
              setTimeout(() => {
                passwordRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }, 5)
            }
            className="flex-1 scroll-mb-[100px] bg-transparent font-medium text-[var(--gray-90)] placeholder-[var(--gray-30)] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-[var(--gray-30)]"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {passwordError && (
          <p className="mt-1 text-sm font-normal text-[var(--noti)]">
            영문/숫자/특수기호 조합 8글자 이상
          </p>
        )}
      </div>

      {/* 비밀번호 재입력 */}
      <div className="mb-auto">
        <label className="mb-2 block text-lg font-semibold text-[var(--gray-90)]">
          비밀번호 재입력
        </label>
        <div className="flex h-[48px] w-full items-center rounded-[8px] border-[1.5px] border-[var(--gray-10)] px-3 py-2 text-sm text-[var(--gray-90)] focus-within:border-[2px] focus-within:border-gray-900 focus-within:ring-0 focus-within:outline-none">
          <input
            ref={confirmRef}
            type={showConfirm ? "text" : "password"}
            placeholder="비밀번호를 다시 입력해주세요."
            value={confirm}
            onChange={(e) => onConfirmChange(e.target.value)}
            onFocus={() =>
              setTimeout(() => {
                confirmRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }, 5)
            }
            className="flex-1 bg-transparent text-base font-medium text-[var(--gray-90)] placeholder-[var(--gray-30)] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((prev) => !prev)}
            className="text-[var(--gray-30)]"
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {confirmError && (
          <p className="mt-1 text-sm font-normal text-[var(--noti)]">
            비밀번호와 일치하지 않습니다
          </p>
        )}
      </div>

      {/* 중복확인 토스트 메시지 */}
      {showToast && (
        <div
          className={`fixed bottom-[6rem] left-1/2 z-50 flex -translate-x-1/2 transform items-center gap-[4px] rounded-[16px] px-[16px] py-[9px] text-[14px] leading-[150%] font-medium whitespace-nowrap shadow-md ${
            toastType === "success"
              ? "bg-[var(--gray-60)] text-white"
              : "bg-[var(--gray-60)] text-white"
          }`}
          style={{ fontFamily: "Pretendard" }}
        >
          <span className="text-sm font-medium">
            {toastType === "success" ? "✅" : "⚠️"}
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </SignupPageLayout>
  );
};

export default AccountSetup;
