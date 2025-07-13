/*
author : 썬더
description : 계정 정보 설정 화면 (아이디, 비밀번호 유효성 검사 및 설정)
*/

import React, { useState } from "react";
import type { SignupData } from "../../types/signup";
import { isValidUserId, isValidPassword } from "../../utils/validation";
import { Eye, EyeOff } from "lucide-react"; //
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

  /* 진행 가능 여부 */
  const canProceed = isUseridValid && isPasswordValid && isConfirmValid;

  /* 아이디 중복체크 핸들러 */
  const handleCheckDuplicate = () => {
    // 추후 중복체크 API 구현 예정
    setIsDuplicateChecked(true);
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
    onChange({ userid, password }); // 여기서도 username → userid로 변경
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

  return (
    <div className="flex h-full w-full flex-col bg-white px-[6%] py-[8%] text-left text-xs">
      <h2 className="mb-[10%] text-lg font-bold">
        로그인에 사용할
        <br /> 계정 정보를 설정해주세요
      </h2>

      {/* 아이디 입력 및 중복체크 버튼 */}
      <div className="mb-[10%]">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          아이디
        </label>
        <div className="flex items-center gap-[2%]">
          <input
            type="text"
            placeholder="5글자 이상"
            value={userid}
            onChange={(e) => onUseridChange(e.target.value)}
            className="w-full flex-7 rounded border border-gray-300 px-3 py-2 text-sm focus:border-[2px] focus:border-gray-900 focus:ring-0 focus:outline-none"
          />
          <button
            onClick={handleCheckDuplicate}
            className={`flex-3 rounded-lg py-2 text-sm ${
              isDuplicateChecked
                ? "bg-gray-700 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            중복체크
          </button>
        </div>
        {useridError && (
          <p className="mt-1 text-xs text-red-500">
            영문/숫자/언더바 조합 5글자 이상
          </p>
        )}
      </div>

      {/* 비밀번호 입력 */}
      <div className="mb-[10%]">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          비밀번호
        </label>
        <div className="flex w-full items-center rounded border border-gray-300 px-3 py-2 text-sm focus-within:border-[2px] focus-within:border-gray-900 focus-within:ring-0 focus-within:outline-none">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="영문/숫자/특수기호 조합 8자 이상"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="flex-1 bg-transparent placeholder-gray-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-gray-400"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {passwordError && (
          <p className="mt-1 text-xs text-red-500">
            영문/숫자/특수기호 조합 8글자 이상
          </p>
        )}
      </div>

      {/* 비밀번호 재입력 */}
      <div className="mb-auto">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          비밀번호 재입력
        </label>
        <div className="flex w-full items-center rounded border border-gray-300 px-3 py-2 text-sm focus-within:border-[2px] focus-within:border-gray-900 focus-within:ring-0 focus-within:outline-none">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="비밀번호를 다시 입력해주세요."
            value={confirm}
            onChange={(e) => onConfirmChange(e.target.value)}
            className="flex-1 bg-transparent placeholder-gray-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((prev) => !prev)}
            className="text-gray-400"
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {confirmError && (
          <p className="mt-1 text-xs text-red-500">
            비밀번호와 일치하지 않습니다
          </p>
        )}
      </div>

      {/* 다음 버튼 */}
      <div className="absolute bottom-[4%] left-1/2 w-full max-w-md -translate-x-1/2 transform px-[6%]">
        <button
          onClick={handleNext}
          className={`w-full rounded-xl py-[4%] text-center text-sm text-gray-700 ${
            canProceed ? "bg-black text-white" : "bg-[#E4E4E4] text-gray-500"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default AccountSetup;
