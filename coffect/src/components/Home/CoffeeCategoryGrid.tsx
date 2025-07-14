/*
  author      : 이희선
  description : 커피챗 추천 기준 선택 2x2 그리드 컴포넌트입니다.
                - 사용자가 원하는 커피챗 추천 방식을 선택할 수 있는 UI(클릭할 때 클릭 느낌나게 1.1배 커지는 효과있습니다)
                - 각 버튼 클릭 시 해당 기준에 따라 추천 프로필 카드 보여줄 예정
*/

import { useNavigate } from "react-router-dom";

const CoffeeCategoryGrid: React.FC = () => {
  const navigate = useNavigate();
  // 추천 기준 목록
  const categories = [
    "가까운\n거리 순",
    "나와\n관심사가\n비슷한",
    "같은 학번",
    "요즘\n 글을 많이 쓴",
  ];
  const handleClick = () => {
    navigate("/home/cards");
  };

  return (
    <div className="mt-[12%] w-full">
      {/* 상단 타이틀 */}
      <div className="flex flex-col items-start px-[2%]">
        {/* 인사 텍스트 */}
        <p className="text-[0.9rem] leading-snug font-bold text-[var(--gray-90)]">
          안녕하세요 <span className="text-orange-500">인하</span>님
          <br />
          오늘은 어떤 커피챗을 해볼까요?
        </p>
      </div>

      {/* 2x2 그리드 버튼 */}
      <div className="mt-[4%] grid grid-cols-2 gap-[12px] px-[2%]">
        {categories.map((label, idx) => (
          <button
            key={idx}
            onClick={handleClick}
            className="flex aspect-[4/3] w-full items-end justify-start rounded-4xl bg-[var(--gray-0)] p-[8%] text-left text-[0.95rem] leading-tight font-bold whitespace-pre-line text-[var(--gray-90)] transition active:scale-[1.1]"
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
