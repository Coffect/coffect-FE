/*
  author      : 썬더
  description : 온보딩 화면 레이아웃 (상단 건너뛰기, 중앙 콘텐츠, 페이징 도트, 하단 버튼 )
*/

import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode; // 중앙 콘텐츠
  bottomButton?: ReactNode; // 하단 버튼
  showSkip?: boolean; // 우상단 건너뛰기 여부
  currentIndex?: number; // 현재 슬라이드 인덱스 (0부터 시작)
  total?: number; // 전체 슬라이드 수
}

const OnboardingLayout = ({
  children,
  bottomButton,
  showSkip = true,
  currentIndex = 0,
  total = 0,
}: Props) => {
  const navigate = useNavigate();

  const handleSkip = () => {
    localStorage.setItem("seenOnboarding", "true");
    navigate("/signup", { state: { step: 2 } });
  };

  return (
    <div className="relative flex h-screen w-full max-w-[430px] flex-col bg-[var(--gray-5)] text-left">
      {/* 상단 바: 건너뛰기 버튼 */}
      <div className="flex w-full justify-end px-5 pt-4 pb-2">
        {showSkip && (
          <button
            onClick={handleSkip}
            className="text-base font-medium text-[var(--gray-40)]"
          >
            건너뛰기
          </button>
        )}
      </div>

      {/* 중앙 콘텐츠: 스크롤 가능 영역 */}
      <div className="flex-1 overflow-y-auto pt-10 pb-5 text-center">
        {children}
      </div>
      {/* 페이징 도트 */}
      <div className="mb-2 flex justify-center gap-[7px]">
        {Array.from({ length: total }).map((_, idx) => (
          <span
            key={idx}
            className={`h-[8px] rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-[20px] bg-orange-500"
                : "w-[8px] bg-[var(--gray-10)]"
            }`}
          />
        ))}
      </div>
      {/* 하단 버튼 */}
      {bottomButton && (
        <div className="flex w-full px-[4%] py-[10px]">{bottomButton}</div>
      )}
    </div>
  );
};

export default OnboardingLayout;
