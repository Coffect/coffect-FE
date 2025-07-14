/*
author : 썬더
description : 회원가입 화면 이동 또는 로그인 수행 선택 컴포넌트
*/

/*
 LoginChoice 컴포넌트가 받을 props 타입을 정의
  onLogin   – 로그인 버튼 클릭 시 호출 -> 로그인 수행
  onSignUp  – 학교 이메일로 가입하기 버튼 클릭 시 호출 -> 회원가입 페이지 이동
*/
import { useState } from "react";

interface LoginChoiceProps {
  onLogin: (email: string, password: string) => void;
  onSignUp: () => void;
}

const LoginChoice: React.FC<LoginChoiceProps> = ({ onSignUp, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex h-full w-full flex-col items-center justify-start bg-[var(--gray-0)] px-[1%] pt-[35%] text-center">
      {/* 추후 로고로 수정 예정 */}
      <h1 className="mb-[2%] text-5xl font-bold text-[var(--gray-90)]">
        coffect
      </h1>
      {/* 설명 문구 */}
      <p className="mb-[25%] text-lg font-medium text-[var(--gray-60)]">
        공강 시간을 더 생산적이게
      </p>
      {/* 아이디/비밀번호 입력창 */}
      <input
        type="text"
        placeholder="학교 이메일 또는 사용자 아이디"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-[3%] w-full max-w-[90%] rounded bg-[var(--gray-5)] px-[4%] py-[3%] text-base text-[var(--gray-90)] placeholder-[var(--gray-30)]"
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-[5%] w-full max-w-[90%] rounded bg-gray-100 px-[4%] py-[3%] text-base text-gray-700"
      />
      {/* 로그인 버튼 */}
      <button
        onClick={() => onLogin(email, password)}
        className="w-full max-w-[90%] rounded-lg bg-[var(--gray-90)] py-[4%] text-white"
      >
        로그인
      </button>
      {/* 구분선 */}
      <div className="mt-[15%] mb-[4%] flex w-full max-w-[90%] items-center">
        <div className="h-px flex-grow bg-[var(--gray-10)]" />
        <span className="px-[2%] text-sm text-[var(--gray-40)]">
          아직 계정이 없으신가요?
        </span>
        <div className="h-px flex-grow bg-[var(--gray-10)]" />
      </div>
      {/* 회원가입 버튼 */}
      <button
        onClick={onSignUp}
        className="w-full max-w-[90%] rounded-lg border border-[var(--gray-30)] py-[4%] text-[var(--gray-60)]"
      >
        학교 이메일로 가입하기
      </button>
    </div>
  );
};

export default LoginChoice;
