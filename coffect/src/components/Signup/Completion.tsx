/*
author : [작성자]
description : 회원가입 완료 안내 화면
*/

import { useNavigate } from "react-router-dom";

const Completion = () => {
  const navigate = useNavigate();
  // 로그인 페이지로 이동하는 함수
  const goLogin = () => navigate("/login");

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-[6%] py-[8%] text-center">
      {/* 아이콘 */}
      <div className="mb-[6%] text-[8vw]">☕</div>

      {/* 안내 문구 */}
      <h2 className="mb-[2%] text-[4.5vw] leading-snug font-bold">
        가입이 완료되었어요!
      </h2>
      <p className="mb-[10%] text-[3.5vw] leading-snug text-gray-700">
        지금 바로 학교 친구들과 <br />
        인사이트 가득한 대화를 나눠보세요!
      </p>

      {/* 로그인 버튼 */}
      <button
        onClick={goLogin}
        className="w-full rounded bg-black py-[4%] text-[4vw] text-white"
      >
        로그인 하러가기
      </button>
    </div>
  );
};

export default Completion;
