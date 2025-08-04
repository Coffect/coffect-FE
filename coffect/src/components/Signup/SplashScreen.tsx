/*
  author      : 썬더
  description : 앱 로고 + 소개 문구 + 버튼 클릭 시 다음 단계로 이동 (일러스트가 배경으로 보임)
*/

import LogoImage from "../../assets/icon/home/Logo.png";
import StartImage from "../../assets/icon/signup/Start.png";
import type { StepProps } from "../../types/signup";

const SplashScreen = ({ onNext }: StepProps) => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[var(--gray-0)]">
      {/* 배경 일러스트 이미지 */}
      <img
        src={StartImage}
        alt="커피챗 배경"
        className="absolute bottom-0 left-0 z-0 h-auto max-h-[50vh] w-full object-cover"
      />

      {/* 콘텐츠 영역 (로고 + 슬로건 + 버튼) */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-between px-[4%] pt-[30vh] pb-[6%]">
        {/* 로고 + 슬로건 */}
        <div className="flex flex-col items-center">
          <img src={LogoImage} alt="로고" className="mb-4 w-[257px]" />
          <p className="text-[20px] font-medium text-[var(--gray-60)]">
            우리의 만남은 큰 영향력이 될테니까
          </p>
        </div>

        {/* 버튼 */}
        <button
          onClick={onNext}
          className="w-full rounded-xl bg-[var(--gray-90)] py-[4%] text-center text-lg font-semibold text-[var(--gray-0)]"
        >
          커피챗 시작하기
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;
