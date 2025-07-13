/*
author : 썬더
description : 앱 로고와 설명 문구를 보여주고, 2초 후 다음 단계로 이동합니다.
*/

import { useEffect } from "react";

type Props = { onNext: () => void };

const SplashScreen = ({ onNext }: Props) => {
  useEffect(() => {
    const hasSeenSplash = localStorage.getItem("hasSeenSplash");

    // 처음 방문이면 2초 후 넘어가고 기록 저장
    if (!hasSeenSplash) {
      const timer = setTimeout(() => {
        localStorage.setItem("hasSeenSplash", "true");
        onNext();
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      // 이미 방문한 적 있으면 바로 넘어감
      onNext();
    }
  }, [onNext]);
  return (
    <div className="flex h-full w-full flex-col items-center justify-start bg-white px-[2%] pt-[50%] text-center">
      {/* 추후 로고로 수정 예정 */}
      <h1 className="mb-[2%] text-5xl font-bold text-gray-900">coffect</h1>
      {/* 설명 문구 */}
      <p className="text-lg font-medium text-[#4A4A4A]">
        공강 시간을 더 생산적이게
      </p>
    </div>
  );
};

export default SplashScreen;
