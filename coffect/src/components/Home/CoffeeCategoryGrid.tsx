/*
  author      : 이희선
  description : 커피챗 추천 기준 선택 2x2 그리드 컴포넌트입니다.
                - 사용자가 원하는 커피챗 추천 방식을 선택할 수 있는 UI
                - 각 버튼 클릭 시 공통 콜백(onCategoryClick) 호출
*/

interface Props {
  onCategoryClick: () => void; // 선택 시 실행할 콜백 함수
}

const CoffeeCategoryGrid = ({ onCategoryClick }: Props) => {
  // 추천 기준 목록 (줄바꿈 포함 텍스트)
  const categories = [
    "가까운\n거리 순",
    "나와\n관심사가\n비슷한",
    "같은 학번",
    "요즘\n 글을 많이 쓴",
  ];

  return (
    <div className="mt-[20%] w-full">
      {/* 상단 타이틀 */}
      <div className="mb-[5vh] flex flex-col items-center gap-[1vh]">
        {/* 이모지 아이콘 */}☕{/* 타이틀 텍스트 */}
        <h2 className="text-md font-semibold">
          오늘은 어떤 커피챗을 해볼까요?
        </h2>
      </div>

      {/* 2x2 그리드 버튼 */}
      <div className="mt-[10%] grid grid-cols-2 gap-[4vw]">
        {categories.map((label, idx) => (
          <button
            key={idx}
            onClick={onCategoryClick}
            className="flex h-[18vh] w-full items-end justify-start rounded-[2vw] bg-[#F3F3F3] p-[3vw] text-left text-sm font-semibold whitespace-pre-line transition active:scale-[0.98]"
          >
            {/* 줄바꿈 포함 텍스트 */}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CoffeeCategoryGrid;
