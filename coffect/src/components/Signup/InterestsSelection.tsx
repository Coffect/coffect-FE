/*
author : 썬더
description : 관심사 선택 화면 
*/

import { useState } from "react";

type Props = {
  onNext: () => void;
  onChange: (list: string[]) => void;
};

const OPTIONS = [
  "창업",
  "개발",
  "디자인",
  "기획",
  "AI",
  "글쓰기",
  "독서",
  "마케팅",
  "여행",
  "데이터 분석",
  "하드웨어",
  "영화",
  "외국어",
  "악기",
  "네트워킹",
];

const MAX_SELECTION = 4;

const InterestsSelection = ({ onNext, onChange }: Props) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState("");

  const toggle = (item: string) => {
    setError("");
    setSelected((prev) => {
      if (prev.includes(item)) return prev.filter((i) => i !== item);
      if (prev.length >= MAX_SELECTION) {
        setError("관심사는 최대 4개까지 선택할 수 있어요.");
        return prev;
      }
      return [...prev, item];
    });
  };

  const handleSubmit = () => {
    if (selected.length === 0) {
      setError("최소 1개의 관심사를 선택해주세요.");
      return;
    }
    onChange(selected);
    onNext();
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white px-6 py-8 text-left">
      {/* 상단 안내 */}
      <p className="mb-[5%] text-xs font-semibold text-orange-500">최대 4개</p>
      <h2 className="mb-[0.5rem] text-lg leading-snug font-bold">
        관심사를 알려주세요
        <br />
        <span className="text-lg font-bold">비슷한 친구들을 추천해줄게요!</span>
      </h2>
      <p className="mb-[2rem] text-sm text-[#848484]">
        나중에 언제든지 변경 가능해요
      </p>

      {/* 관심사 태그 리스트 */}
      <div className="mb-4 flex flex-wrap justify-start gap-2 pr-[20%]">
        {OPTIONS.map((opt) => {
          const isSelected = selected.includes(opt);
          const isFirst = selected[0] === opt;

          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className={`inline-block rounded-lg px-[9%] py-[4%] text-sm transition-all ${
                isSelected
                  ? isFirst
                    ? "bg-orange-500 text-white" // 첫 선택 강조
                    : "bg-black text-white"
                  : "bg-[#F5F5F5] text-black"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* 에러 메시지 */}
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {/* 저장 버튼 */}
      {/* 하단 버튼 그룹 */}
      <div className="mt-auto flex w-full gap-2">
        {/* 건너뛰기 버튼 */}
        <button
          onClick={onNext}
          className="flex-1 rounded-xl border border-[#D9D9D9] bg-white py-3 text-center text-base text-gray-500"
        >
          건너뛰기
        </button>

        {/* 다음 버튼 */}
        <button
          onClick={handleSubmit}
          className={`flex-2 rounded-xl py-3 text-center text-base font-medium ${
            selected.length > 0
              ? "bg-black text-white"
              : "bg-[#E4E4E4] text-gray-500"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default InterestsSelection;
