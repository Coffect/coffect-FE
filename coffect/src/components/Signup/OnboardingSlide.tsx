/*
  author      : 썬더
  description : 온보딩 슬라이드 단일 화면 컴포넌트 (로고 + 타이틀 + 설명 + 이미지 표시)
*/

import OnboardingLogo from "../../assets/icon/signup/onboardingLogo.png";

// 슬라이드 개별 콘텐츠 props 타입 정의
interface SlideProps {
  title: string;
  description?: string;
  image: string;
}

// 온보딩 슬라이드 컴포넌트 정의
const OnboardingSlide = ({ title, description, image }: SlideProps) => {
  return (
    <div className="flex w-full max-w-[430px] flex-col items-center justify-center text-center">
      {/* 상단 로고 이미지 */}
      <img
        src={OnboardingLogo}
        alt="온보딩 로고"
        className="mb-1 h-10 w-10 object-contain"
      />

      {/* 타이틀 */}
      <h2 className="mb-3 text-2xl leading-normal font-bold whitespace-pre-line text-[var(--gray-90)]">
        {title}
      </h2>

      {/* 서브 설명 */}
      {description && (
        <p className="mb-6 text-sm leading-normal font-medium whitespace-pre-line text-[var(--gray-40)]">
          {description}
        </p>
      )}

      {/* 슬라이드 이미지 */}
      <img
        src={image}
        alt="온보딩 이미지"
        className="w-full max-w-[430px] object-contain"
      />
    </div>
  );
};

export default OnboardingSlide;
