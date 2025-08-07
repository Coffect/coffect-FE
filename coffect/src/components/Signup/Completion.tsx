/*
author : 썬더
description : 회원가입 완료 안내 화면 
*/
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignupEndImage from "../../assets/icon/signup/SignupEnd.png";
import SignupPageLayout from "./shared/SignupLayout";

const Completion = () => {
  const navigate = useNavigate();

  const goLogin = () => {
    navigate("/signup", { state: { step: 2 } });
    window.location.reload();
  };

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
          onClick={goLogin}
          className="w-full rounded-xl bg-[var(--gray-90)] py-[4%] text-center text-lg text-[var(--gray-0)]"
        >
          로그인 하러가기
        </button>
      }
    >
      {/* 본문 영역 */}
      <div className="flex min-h-full flex-col items-center justify-center text-center">
        {/* 아이콘 */}
        <img
          src={SignupEndImage}
          alt="회원가입 완료 이미지"
          className="mx-auto mb-5 w-[7rem]"
        />
        {/* 타이틀 */}
        <h2 className="mb-[4%] text-[24px] font-bold">
          회원가입이 완료되었어요!
        </h2>

        {/* 서브 문구 */}
        <p className="mb-8 text-center text-base leading-snug font-normal text-[var(--gray-40)]">
          지금 바로 학교 친구들과 <br />
          인사이트 가득한 대화를 나눠보세요!
        </p>
      </div>
    </SignupPageLayout>
  );
};

export default Completion;
