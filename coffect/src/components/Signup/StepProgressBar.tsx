/*
  author      : 썬더
  description : Topbar 아래 회원가입 단계 진행 표시 컴포넌트 (총 5단계)
*/

type Props = {
  totalSteps: number;
  currentStep: number;
};

const StepProgressBar: React.FC<Props> = ({ totalSteps, currentStep }) => {
  return (
    <div className="flex w-full justify-between px-4">
      {Array.from({ length: totalSteps }).map((_, idx) => (
        <div
          key={idx}
          className={`mx-[2px] h-1 flex-1 rounded-full ${
            idx < currentStep ? "bg-black" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

export default StepProgressBar;
