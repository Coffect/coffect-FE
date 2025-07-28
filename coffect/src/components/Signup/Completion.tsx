/*
author : 썬더
description : 회원가입 완료 안내 화면 
*/
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignupEndImage from "../../assets/icon/Signup/SignupEnd.png";

const Completion = () => {
  const navigate = useNavigate();

  const goLogin = () => navigate("/signup", { state: { step: 2 } });

  useEffect(() => {
    // 진입 시 스크롤 막기
    document.body.style.overflow = "hidden";
    return () => {
      // 컴포넌트 종료 시 스크롤 다시 허용
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="relative flex h-screen w-full flex-col bg-white px-[4%]">
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto pb-[8rem] text-center">
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

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 w-full bg-white px-[4%] py-4">
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
