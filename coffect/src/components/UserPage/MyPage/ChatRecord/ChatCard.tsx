/*
author : 재하
description : 커피챗 기록 상세 카드(겹치는 카드 효과 포함)를 출력하는 컴포넌트입니다.
*/

import { useRef, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/*
커피챗 상세 카드를 렌더링하는 함수형 컴포넌트입니다.
*/
const ChatCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gradient = location.state?.gradient || "from-blue-50 to-blue-200";
  // 메인 카드의 높이를 추적하기 위한 ref와 state
  const mainCardRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined);

  /*
  메인 카드의 실제 높이를 측정하여 배경 카드에 적용합니다.
  */
  useLayoutEffect(() => {
    if (mainCardRef.current) {
      setCardHeight(mainCardRef.current.offsetHeight);
    }
  });

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-white">
      {/* 뒤로가기 버튼 */}
      <button
        className="absolute top-4 left-4 z-20 text-3xl"
        onClick={() => navigate("/mypage/chatrecord")}
      >
        &#x25C0;
      </button>
      {/* 카드 겹침 효과를 위한 래퍼 */}
      <div className="relative mt-7 w-[90%] max-w-xs">
        {/* 뒤에 겹치는 카드 (메인 카드와 동일한 높이) */}
        <div
          className={`absolute top-2 left-2 w-full rounded-2xl border-2 border-black bg-gradient-to-b ${gradient} z-0`}
          style={{
            boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
            height: cardHeight ? cardHeight + "px" : undefined,
          }}
        />
        {/* 메인 카드 */}
        <div
          ref={mainCardRef}
          className={`relative w-full rounded-2xl border-2 border-black bg-gradient-to-b ${gradient} z-10 flex h-auto flex-col p-8 shadow-md`}
        >
          {/* 날짜/장소 정보 */}
          <div className="mb-2 text-center text-sm text-gray-700">
            2025. 1. 24. PM 14:00
            <br />
            @프라임관 스타벅스
          </div>
          {/* 커피챗 타이틀 */}
          <div className="mb-6 text-center text-lg leading-snug font-bold text-gray-800">
            박준하님과 재하님의
            <br />첫 번째 커피챗 기록
          </div>
          {/* 참여자 정보 */}
          <div className="mb-2 flex justify-center gap-8">
            <div className="flex flex-col items-center">
              <div className="mb-2 h-16 w-16 rounded-full bg-gray-700" />
              <div className="text-sm font-semibold text-gray-800">박준하</div>
              <div className="text-xs text-gray-600">TESL 전공</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 h-16 w-16 rounded-full bg-gray-700" />
              <div className="text-sm font-semibold text-gray-800">재하</div>
              <div className="text-xs text-gray-600">TESL 전공</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
