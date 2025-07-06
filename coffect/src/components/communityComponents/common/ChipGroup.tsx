/*
author : 강신욱
description : 종류/주제 선택 칩을 보여주는 컴포넌트입니다. 
 */

import React from "react";

/*
title : 칩 그룹의 제목 ( 종류 / 주제 입력 )
options : 칩으로 표시할 옵션 목록 (ex: ["아티클", "팀원 모집", "질문"])
selectedOption : 현재 선택된 옵션 (ex: "아티클")
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
  return (
    <div className="mb-4">
      <h2 className="mb-2 font-bold">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`border px-4 py-2 text-sm ${
              selectedOption === option ? "bg-gray-700 text-white" : ""
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChipGroup;
