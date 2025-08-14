export default function LoadingScreen() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-white">
      {/* 메인 텍스트 */}
      <p className="w-[177px] text-[22px] font-semibold text-[var(--gray-90)]">
        잠시만 기다려주세요
      </p>

      {/* 로딩 스피너: Tailwind 유틸만 사용 (JS 상태/이펙트 없음) */}
      <div className="flex h-[177px] w-[177px] items-center justify-center">
        <div className="relative h-25 w-25">
          {/* 8개 점: 반지름 이동으로 원형 배치 */}
          {/* 각 점은 pulse 애니메이션에 서로 다른 지연 시간을 둬서 하이라이트가 순차적으로 이동하는 효과 */}

          {/* 0deg */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[0deg]">
            <div className="h-4 w-4 translate-y-[-40px] animate-pulse rounded-full bg-gray-800/90 [animation-delay:0ms] [animation-duration:1200ms]"></div>
          </div>

          {/* 45deg */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[45deg]">
            <div className="h-4 w-4 translate-y-[-40px] animate-pulse rounded-full bg-gray-800/80 [animation-delay:150ms] [animation-duration:1200ms]"></div>
          </div>

          {/* 90deg */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[90deg]">
            <div className="h-4 w-4 translate-y-[-40px] animate-pulse rounded-full bg-gray-800/70 [animation-delay:300ms] [animation-duration:1200ms]"></div>
          </div>

          {/* 135deg */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[135deg]">
            <div className="h-4 w-4 translate-y-[-40px] animate-pulse rounded-full bg-gray-800/60 [animation-delay:450ms] [animation-duration:1200ms]"></div>
          </div>

          {/* 180deg */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[180deg]">
            <div className="h-4 w-4 translate-y-[-40px] animate-pulse rounded-full bg-gray-800/50 [animation-delay:600ms] [animation-duration:1200ms]"></div>
          </div>

          {/* 225deg */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[225deg]">
            <div className="h-4 w-4 translate-y-[-40px] animate-pulse rounded-full bg-gray-800/60 [animation-delay:750ms] [animation-duration:1200ms]"></div>
          </div>

          {/* 270deg */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[270deg]">
            <div className="h-4 w-4 translate-y-[-40px] animate-pulse rounded-full bg-gray-800/70 [animation-delay:900ms] [animation-duration:1200ms]"></div>
          </div>

          {/* 315deg */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[315deg]">
            <div className="h-4 w-4 translate-y-[-40px] animate-pulse rounded-full bg-gray-800/80 [animation-delay:1050ms] [animation-duration:1200ms]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
