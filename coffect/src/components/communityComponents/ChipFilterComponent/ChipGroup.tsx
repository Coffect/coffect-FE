/**  
@author : 흥부/강신욱                                                                                      
@description : 여러 개의 칩(선택 가능한 버튼)을 그룹으로 표시하고 관리하는 컴포넌트입니다.              
*/

import React from "react";
import type { ChipOption } from "./filterData";

/**                                                                                                                                     
 ChipGroup 컴포넌트의 props 인터페이스입니다.                                                                                      
 @property options - 칩으로 표시될 옵션들의 배열입니다.                                                               
 @property selectedOption - 현재 선택된 옵션의 값입니다. (string 또는 number 배열)                                                            
 @property onSelect - 옵션 선택 시 호출될 콜백 함수입니다.                                                
*/

interface ChipGroupProps {
  options: ChipOption[];
  selectedOption: string | number[] | null;
  onSelect: (option: ChipOption) => void;
  disabled?: boolean;
}

const ChipGroup: React.FC<ChipGroupProps> = ({
  options,
  selectedOption,
  onSelect,
  disabled = false,
}) => {
  const isSelected = (option: ChipOption) => {
    // selectedOption이 배열일 경우(글 주제 선택), id만 비교합니다.
    if (Array.isArray(selectedOption)) {
      return selectedOption.includes(option.id);
    }
    // selectedOption이 문자열일 경우(글 종류 선택), id 또는 value를 비교합니다.
    return selectedOption === option.value;
  };

  const baseStyle =
    "text-md rounded-md border border-[var(--gray-10)] px-3 py-2 text-[var(--gray-70)]";
  const selectedStyle =
    "bg-[var(--gray-70)] text-[var(--white)] border-[var(--gray-70)]";

  return (
    <div className="mb-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap justify-start gap-1">
          {options.map((option) => (
            <button
              key={option.id}
              className={`${baseStyle} ${isSelected(option) ? selectedStyle : ""}`}
              onClick={() => onSelect(option)}
              disabled={disabled}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChipGroup;
