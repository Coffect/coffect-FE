/*
author : 썬더
description : 회원가입 완료 안내 화면 
*/

import { useNavigate } from "react-router-dom";
import SignupEndImage from "../../assets/icon/Signup/SignupEnd.png";

const Completion = () => {
  const navigate = useNavigate();

  const goLogin = () => navigate("/");

  return (
    <div className="flex h-full w-full flex-col items-center bg-white px-[6%] pt-[40%] text-[var(--gray-90)]">
      {/* 타이틀 */}
      <h2 className="mb-[4%] text-xl font-bold">회원가입이 완료되었어요!</h2>

      {/* 서브 문구 */}
      <p className="mb-8 text-center text-sm leading-snug text-[var(--gray-40)]">
        지금 바로 학교 친구들과 <br />
        인사이트 가득한 대화를 나눠보세요!
      </p>

      {/* 아이콘 */}
      <img
        src={SignupEndImage}
        alt="회원가입 완료 이미지"
        className="mb-10 w-[50%] max-w-[200px]"
      />

      {/* 하단 고정 버튼 */}
      <div className="absolute bottom-[4%] left-1/2 w-full max-w-md -translate-x-1/2 transform px-[6%]">
        <button
          onClick={goLogin}
          className="w-full rounded-xl bg-[var(--gray-90)] py-[4%] text-center text-sm text-[var(--gray-0)]"
        >
          로그인 하러가기
        </button>
      </div>
    </div>
  );
};

export default Completion;
