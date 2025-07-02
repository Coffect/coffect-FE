/*
author : 썬더
description : 계정 정보 설정 화면 (사용자명(아이디)/비밀번호) => 아직 제대로된 유효성 검사 구현 x 
*/

import { useState } from "react";
import type { SignupData } from "../../types/signup";

/*
  AccountSetup 컴포넌트가 받을 props 타입을 정의
  onNext   – 입력이 완료된 후 다음 단계로 이동
  onBack   – 이전 단계로 이동
  onChange – 입력된 사용자명(아이디) 및 비밀번호를 부모에게 전달
*/
type Props = {
  onNext: () => void;
  onBack: () => void;
  onChange: (fields: Partial<SignupData>) => void;
};

const AccountSetup = ({ onNext, onBack, onChange }: Props) => {
  // 사용자명(아이디), 비밀번호, 비밀번호 재확인 입력 상태 관리
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // 입력 조건 충족 여부 (사용자명(아이디) 존재, 비밀번호 8자 이상, 비밀번호 일치)
  const canProceed = !!username && password.length >= 8 && password === confirm;

  // ‘다음’ 클릭 시 부모에 값 전달 후 단계 이동하는 함수
  const handleNext = () => {
    onChange({ username, password });
    onNext();
  };

  return (
    <div className="min-h-screen w-full bg-white px-[6%] py-[8%]">
      {/* 상단 타이틀 및 설명 */}
      <div className="mb-[8%]">
        <h2 className="mb-[4%] text-[5vw] font-bold">거의 다 왔어요!</h2>
        <p className="text-[3.5vw] font-normal">
          로그인에 사용할 계정 정보를 설정해주세요.
        </p>
      </div>

      {/* 사용자 아이디 입력 필드 */}
      <div className="mb-[5%]">
        <label className="mb-1 block text-[3.5vw] font-bold text-gray-700">
          사용자 아이디
        </label>
        <input
          type="text"
          placeholder="프로필에 노출되며, 언제든지 변경 가능해요!"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded border border-gray-300 p-3 text-[3.5vw]"
        />
      </div>

      {/* 비밀번호 입력 필드 */}
      <div className="mb-[5%]">
        <label className="mb-1 block text-[3.5vw] font-bold text-gray-700">
          비밀번호
        </label>
        <input
          type="password"
          placeholder="영문/숫자/특수기호 조합 8자 이상"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border border-gray-300 p-3 text-[3.5vw]"
        />
      </div>

      {/* 비밀번호 재확인 입력 필드 */}
      <div className="mb-[10%]">
        <label className="mb-1 block text-[3.5vw] font-bold text-gray-700">
          비밀번호 재입력
        </label>
        <input
          type="password"
          placeholder="비밀번호를 다시 입력해주세요."
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded border border-gray-300 p-3 text-[3.5vw]"
        />
      </div>

      {/* 이전, 다음 버튼 */}
      <div className="flex justify-between gap-[4%]">
        <button
          onClick={onBack}
          className="w-1/2 rounded bg-gray-200 py-[4%] text-[4vw] text-black"
        >
          이전
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`w-1/2 rounded py-[4%] text-[4vw] text-white ${
            canProceed ? "bg-black" : "bg-gray-300"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default AccountSetup;
