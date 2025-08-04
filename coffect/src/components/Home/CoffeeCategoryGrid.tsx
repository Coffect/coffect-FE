/*
  author      : 이희선
  description : 커피챗 추천 기준 선택 2x2 그리드 컴포넌트입니다.
                - 사용자가 원하는 커피챗 추천 방식을 선택할 수 있는 UI(클릭할 때 클릭 느낌나게 1.1배 커지는 효과있습니다)
                - 각 버튼 클릭 시 해당 기준에 따라 추천 프로필 카드 보여줄 예정
*/

import { postTodayInterest } from "@/api/home";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import choose1Image from "@/assets/icon/home/choose1.png";
import choose2Image from "@/assets/icon/home/choose2.png";
import choose3Image from "@/assets/icon/home/choose3.png";
import choose4Image from "@/assets/icon/home/choose4.png";

const CoffeeCategoryGrid: React.FC = () => {
  // 카테고리 클릭 시 다음날 오전 9시까지 수정 못하도록 localStorage에 방문기록 저장+ API 호출
  const { mutate: selectCategory } = useMutation({
    mutationFn: async (categoryValue: number) => {
      // 이전 카드 추천 뷰 진입 여부 기록 제거 (카드 API 조건 초기화 목적)
      if (localStorage.getItem("cardViewVisited")) {
        localStorage.removeItem("cardViewVisited");
      }
      // 카드 스킵(페이징) 횟수 초기화 (페이지 진입 시 스킵(페이징) 카운트 리셋 목적)
      if (localStorage.getItem("skippedCardCount")) {
        localStorage.removeItem("skippedCardCount");
      }
      // 선택한 추천 기준 서버에 전송
      postTodayInterest(categoryValue);
      // 로컬스토리지에 추천 기준 선택 여부 저장 (당일 재선택 방지 목적)
      localStorage.setItem("coffeeCategorySelected", "true");
      // 선택 만료 시간 기록 (다음날 오전 9시 재추천 트리거를 위한 기준 시점)
      localStorage.setItem("coffeeCategoryExpire", new Date().toISOString());
    },
    onSuccess: () => {
      navigate("/home/cards");
    },
    onError: () => {
      alert("선택 저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });
  const navigate = useNavigate();
  // 카테고리 label + image + value 세트
  const categories = [
    { label: "가까운\n거리 순", value: 1, image: choose1Image },
    { label: "나와\n관심사가\n비슷한", value: 2, image: choose2Image },
    { label: "나와\n 같은 학번", value: 3, image: choose3Image },
    { label: "요즘\n글을 많이 쓴", value: 4, image: choose4Image },
  ];

  const handleClick = (categoryValue: number) => {
    selectCategory(categoryValue);
  };

  return (
    <div className="mt-[12%] w-full">
      {/* 상단 타이틀 */}
      <div className="flex flex-col items-start px-[2%]">
        {/* 인사 텍스트 */}
        <p className="text-[22px] leading-snug font-bold text-[var(--gray-50)]">
          안녕하세요 인하님
          <br />
          <span className="text-[var(--gray-90)]">
            오늘은 어떤 커피챗을 해볼까요?
          </span>
        </p>
      </div>

      {/* 2x2 그리드 버튼 */}
      <div className="mt-[4%] grid grid-cols-2 gap-[12px] px-[2%]">
        {categories.map(({ label, value, image }, idx) => {
          const imageWidth = ["w-[32%]", "w-[36%]", "w-[50%]", "w-[45%]"][idx];

          return (
            <button
              key={value}
              onClick={() => handleClick(value)}
              className="flex aspect-[17/19] h-full w-full flex-col items-start justify-between rounded-4xl bg-white p-[10%] text-left text-[22px] leading-snug font-bold text-[var(--gray-70)] transition active:scale-[1.1]"
            >
              <img
                src={image}
                alt="카테고리 이미지"
                className={`mx-auto mt-[5%] mb-[10%] h-auto ${imageWidth}`}
              />
              <span className="text-left whitespace-pre-line">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CoffeeCategoryGrid;
