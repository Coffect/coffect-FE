/*
author : 썬더
description : 회원가입 완료 안내 화면 
*/
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignupEndImage from "../../assets/icon/Signup/SignupEnd.png";

const Completion = () => {
  const navigate = useNavigate();

  const goLogin = () => navigate("/");

  useEffect(() => {
    // 진입 시 스크롤 막기
    document.body.style.overflow = "hidden";
    return () => {
      // 컴포넌트 종료 시 스크롤 다시 허용
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="relative flex h-[90vh] w-full flex-col justify-between bg-white">
      <div className="h-full flex-1 overflow-y-auto px-[6%] pt-[50%] text-center">
        {/* 타이틀 */}
        <h2 className="mb-[4%] text-3xl font-bold">회원가입이 완료되었어요!</h2>

        {/* 서브 문구 */}
        <p className="mb-8 text-center text-base leading-snug font-medium text-[var(--gray-40)]">
          지금 바로 학교 친구들과 <br />
          인사이트 가득한 대화를 나눠보세요!
        </p>

        {/* 아이콘 */}
        <img
          src={SignupEndImage}
          alt="회원가입 완료 이미지"
          className="mx-auto mb-10 w-[50%]"
        />
      </div>

      {/* 하단 고정 버튼 */}
      <div className="flex w-full px-[6%]">
        <button
          onClick={goLogin}
          className="w-full rounded-xl bg-[var(--gray-90)] py-[4%] text-center text-lg text-[var(--gray-0)]"
        >
          로그인 하러가기
        </button>
      </div>
    </div>
  );
};

export default Completion;
