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
import LogoImage from "../../assets/icon/home/Logo.png";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LoginChoiceProps {
  onLogin: (email: string, password: string) => void;
  onSignUp: () => void;
}

const LoginChoice: React.FC<LoginChoiceProps> = ({ onSignUp, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-start overflow-x-hidden bg-white text-center">
      {/* 상단 네비게이션 바 (고정) */}
      <div className="fixed top-0 left-1/2 z-50 w-[100vw] max-w-[430px] -translate-x-1/2 bg-[var(--gray-0)]">
        <div className="relative flex items-center px-4 py-4">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft className="h-6 w-6 text-[var(--gray-90)]" />
          </button>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold text-[var(--gray-90)]">
            로그인
          </h1>
        </div>
      </div>

      {/* 실제 콘텐츠 영역 */}
      <div className="mt-[30%] flex w-full flex-col items-center px-[3%]">
        <img src={LogoImage} alt="로고" className="mb-[20%] w-[192px]" />

        <input
          type="text"
          placeholder="학교 이메일 또는 사용자 아이디"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 h-[56px] w-full rounded-[12px] bg-[var(--gray-5)] px-4 py-3 text-base font-medium text-[var(--gray-90)] placeholder:text-[var(--gray-30)]"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-5 h-[56px] w-full rounded-[12px] bg-[var(--gray-5)] px-4 py-3 text-base font-medium text-[var(--gray-90)] placeholder:text-[var(--gray-30)]"
        />

        <button
          onClick={() => onLogin(email, password)}
          className="h-[56px] w-full rounded-[12px] bg-[var(--gray-80)] py-3 text-lg font-semibold text-white"
        >
          로그인
        </button>

        {/* 구분선 */}
        <div className="mt-10 mb-5 flex w-full items-center">
          <div className="h-px flex-grow bg-[var(--gray-10)]" />
          <span className="px-3 text-sm font-medium text-[var(--gray-40)]">
            아직 계정이 없으신가요?
          </span>
          <div className="h-px flex-grow bg-[var(--gray-30)]" />
        </div>

        <button
          onClick={onSignUp}
          className="mb-3 h-[56px] w-full rounded-[12px] border border-[var(--gray-30)] py-3 text-lg text-[var(--gray-50)]"
        >
          학교 이메일로 가입하기
        </button>
      </div>
    </div>
  );
};

export default LoginChoice;
