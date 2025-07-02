/*
author : 썬더
description : 회원가입 화면 또는 로그인 화면 이동 선택
*/

/*
 LoginChoice 컴포넌트가 받을 props 타입을 정의
  onSignUp  – 학교 이메일로 가입하기 버튼 클릭 시 호출-> 회원가입 페이지 이동
  onLogin   – 이미 계정이 있어요 버튼 클릭 시 호출 -> 로그인 페이지 이동
*/
interface LoginChoiceProps {
  onSignUp: () => void;
  onLogin: () => void;
}

const LoginChoice = ({ onSignUp, onLogin }: LoginChoiceProps) => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-[5%] text-center">
      {/* 로고로 수정예정 */}
      <div className="mb-[6%] text-[8vw]">☕</div>

      {/* 타이틀 */}
      <h2 className="mb-[2%] text-[5vw] font-bold text-gray-900">
        Welcome to coffect!
      </h2>
      <p className="mb-[6%] text-[3.5vw] text-gray-500">
        커펙트에 오신 것을 환영합니다!
      </p>

      {/* 회원가입 버튼 */}
      <button
        onClick={onSignUp}
        className="mb-[4%] w-full max-w-[80%] rounded border border-gray-300 py-[3%] text-gray-800"
      >
        학교 이메일로 가입하기
      </button>

      {/* 구분선 */}
      <div className="mb-[4%] flex w-full max-w-[80%] items-center justify-center">
        <div className="h-px flex-grow bg-gray-300" />
        <span className="px-[2%] text-[3vw] text-gray-400">OR</span>
        <div className="h-px flex-grow bg-gray-300" />
      </div>

      {/* 로그인 버튼 */}
      <button
        onClick={onLogin}
        className="mb-[6%] w-full max-w-[80%] rounded bg-black py-[3%] text-white"
      >
        이미 계정이 있어요
      </button>

      {/* 약관 */}
      <p className="w-full max-w-[80%] text-[2.5vw] leading-relaxed text-gray-400">
        계속 진행하면 coffect의 <span className="underline">서비스 약관</span>과{" "}
        <span className="underline">개인정보 처리방침</span>에 동의하는 것으로
        간주합니다
      </p>
    </div>
  );
};

export default LoginChoice;
