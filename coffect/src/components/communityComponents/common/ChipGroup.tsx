/*
author : 강신욱
description : 게시글의 '종류'나 '주제'와 같은 카테고리를 선택할 때 사용하는 UI 컴포넌트입니다.
              FilterModal.tsx, wirteCompoent 에서 이 컴포넌트를 사용하여 
              사용자가 원하는 글의 종류(예: '아티클', '팀원 모집')나 주제(예: '개발', '디자인')를 선택할 수 있도록 버튼 형태의 칩을 그룹으로 보여줍니다.
 */

import React from "react";
/*
title : 칩 그룹의 제목 ( 종류 / 주제 입력 )
options : 칩으로 표시할 옵션 목록 (ex: ["아티클", "팀원 모집", "질문"]) : 배열에 직접 입력입니다. (지금은 더미데이터처럼 사용합니다.)
selectedOption : 현재 선택된 옵션 (ex: "아티클") : 뿌려진 UI에서 선택된 옵션을 표시하기 위해 사용합니다.
onSelect : 옵션 선택 시 호출되는 함수 (ex: (option) => console.log(option))
 */
interface ChipGroupProps {
  title: string;
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
}

const ChipGroup: React.FC<ChipGroupProps> = ({
  title,
  options,
  selectedOption,
  onSelect,
}) => {
  const sliceEnd = title === "글 주제 선택" ? 4 : 3;
  return (
    <div className="mb-4">
      <h2 className="mb-2 h-[27px] w-[318px] text-left font-bold">{title}</h2>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap justify-start gap-2">
          {options.slice(0, sliceEnd).map((option) => (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`rounded-md border border-gray-300 px-3 py-1.5 text-sm ${
                selectedOption === option ? "bg-[#3a3a3a] text-white" : ""
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap justify-start gap-2">
          {options.slice(sliceEnd).map((option) => (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`rounded-md border border-gray-300 px-3 py-1.5 text-sm ${
                selectedOption === option ? "bg-[#3a3a3a] text-white" : ""
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChipGroup;
