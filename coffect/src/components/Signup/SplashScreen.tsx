/*
author : 썬더
description : 앱 로고와 소개 텍스트를 보여주고, 2초 후 다음 단계로 이동합니다.
*/

import { useEffect } from "react";

type Props = { onNext: () => void };

const SplashScreen = ({ onNext }: Props) => {
  /*2초 동안 보여주고 다음 화면으로 넘어가기*/
  useEffect(() => {
    const timer = setTimeout(onNext, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-[5%] text-center">
      {/* 로고로 수정 예정 */}
      <div className="mb-[4%] text-[8vw]">☕</div>
      {/* 앱 이름 */}
      <h1 className="mb-[8%] text-[8vw] font-bold text-gray-900">coffect</h1>
      {/* 설명 문구 */}
      <p className="text-[3.5vw] leading-relaxed text-gray-500">
        공강 시간을 더 생산적이게,
        <br />
        믿을 수 있는 학교 사람들과의
        <br />
        커피챗을 이어주는 플랫폼
      </p>
    </div>
  );
};

export default SplashScreen;
