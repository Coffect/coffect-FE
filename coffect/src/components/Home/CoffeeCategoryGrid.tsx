/*
  author      : 이희선
  description : 커피챗 추천 기준 선택 2x2 그리드 컴포넌트입니다.
                - 사용자가 원하는 커피챗 추천 방식을 선택할 수 있는 UI(클릭할 때 클릭 느낌나게 1.1배 커지는 효과있습니다)
                - 각 버튼 클릭 시 해당 기준에 따라 추천 카드 제공
*/

import { postTodayInterest } from "@/api/home";
import { getProfile } from "@/api/profile";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import choose1Image from "@/assets/icon/home/choose1.png";
import choose2Image from "@/assets/icon/home/choose2.png";
import choose3Image from "@/assets/icon/home/choose3.png";
import choose4Image from "@/assets/icon/home/choose4.png";

const CoffeeCategoryGrid: React.FC = () => {
  const navigate = useNavigate();

  // [추가] 내 프로필 이름 불러오기
  const { data: myName = "" } = useQuery<string>({
    queryKey: ["myProfileName"],
    queryFn: async () => {
      const me = await getProfile();
      return me.success?.userInfo.name ?? "";
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // 카테고리 클릭 시 다음날 오전 9시까지 수정 못하도록 localStorage에 방문기록 저장+ API 호출
  const { mutate: selectCategory } = useMutation({
    mutationFn: async (categoryValue: number) => {
      if (localStorage.getItem("cardViewVisited")) {
        localStorage.removeItem("cardViewVisited");
      }
      if (localStorage.getItem("skippedCardCount")) {
        localStorage.removeItem("skippedCardCount");
      }
      await postTodayInterest(categoryValue);
      localStorage.setItem("coffeeCategorySelected", "true");
      localStorage.setItem("coffeeCategoryExpire", new Date().toISOString());
    },
    onSuccess: () => {
      navigate("/home/cards");
    },
    onError: () => {
      alert("선택 저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });

  const categories = [
    { label: "나와 관심사가\n비슷한", value: 1, image: choose1Image },
    { label: "승락률이\n높은", value: 2, image: choose2Image },
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
        <p className="text-[22px] leading-snug font-bold text-[var(--gray-50)]">
          안녕하세요 {myName || "사용자"}님
          <br />
          <span className="text-[var(--gray-90)]">
            오늘은 어떤 커피챗을 해볼까요?
          </span>
        </p>
      </div>

      {/* 2x2 그리드 버튼 */}
      <div className="mt-[4%] grid grid-cols-2 gap-[12px] px-[3%]">
        {categories.map(({ label, value, image }, idx) => {
          const imageWidth = ["w-[32%]", "w-[40%]", "w-[55%]", "w-[50%]"][idx];
          const imageMt = ["mt-[12%]", "mt-[12%]", "mt-[15%]", "mt-[8%]"][idx];
          return (
            <button
              key={value}
              onClick={() => handleClick(value)}
              className="flex aspect-[17/19] h-full w-full flex-col items-start justify-between rounded-4xl bg-white p-[10%] text-left text-[22px] leading-snug font-bold text-[var(--gray-70)] transition active:scale-[1.1]"
            >
              <img
                src={image}
                alt="카테고리 이미지"
                className={`mx-auto ${imageMt} h-auto ${imageWidth}`}
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
