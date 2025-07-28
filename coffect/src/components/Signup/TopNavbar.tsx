/*
  author      : 썬더
  description : 회원가입용 상단 네비게이션 바 (단계 바 포함)
*/

import { ChevronLeft } from "lucide-react";
import StepProgressBar from "./StepProgressBar";

type Props = {
  title: string;
  onBack?: () => void;
  showProgress?: boolean;
  step?: number;
  totalSteps?: number;
};

const TopNavbar: React.FC<Props> = ({
  title,
  onBack,
  showProgress = false,
  step = 1,
  totalSteps = 5,
}) => {
  return (
    <div className="flex h-[56px] w-full flex-col bg-[var(--gray-0)]">
      {/* 상단 타이틀 영역 */}
      <div className="flex items-center px-[5%] py-[4%]">
        {onBack && (
          <button onClick={onBack}>
            <ChevronLeft className="h-6 w-6 text-[var(--gray-90)]" />
          </button>
        )}
        <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold text-[var(--gray-90)]">
          {title}
        </h1>
      </div>

      {/* 단계 진행 바 */}
      {showProgress && (
        <StepProgressBar totalSteps={totalSteps} currentStep={step} />
      )}
    </div>
  );
};

export default TopNavbar;
