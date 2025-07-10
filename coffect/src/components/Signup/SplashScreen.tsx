/*
author : 썬더
description : 앱 로고와 설명 문구를 보여주고, 2초 후 다음 단계로 이동합니다.
*/

import { useEffect } from "react";

type Props = { onNext: () => void };

const SplashScreen = ({ onNext }: Props) => {
  /*2초 동안 보여주고 다음 화면으로 넘어가기*/
  useEffect(() => {
    const timer = setTimeout(onNext, 2000);
    return () => clearTimeout(timer);
  });

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
