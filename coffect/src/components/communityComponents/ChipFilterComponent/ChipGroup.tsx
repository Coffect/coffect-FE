/**  
@author : 흥부/강신욱                                                                                      
@description : 여러 개의 칩(선택 가능한 버튼)을 그룹으로 표시하고 관리하는 컴포넌트입니다.              
*/

import React from "react";
import type { ChipOption } from "./filterData";

/**                                                                                                                                     
 ChipGroup 컴포넌트의 props 인터페이스입니다.                                                                                      
 @property options - 칩으로 표시될 옵션들의 배열입니다.                                                               
 @property selectedOption - 현재 선택된 옵션의 값입니다.                                                            
 @property onSelect - 옵션 선택 시 호출될 콜백 함수입니다.                                                
*/

interface ChipGroupProps {
  options: ChipOption[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
}

const ChipGroup: React.FC<ChipGroupProps> = ({
  options,
  selectedOption,
  onSelect,
}) => {
  const baseStyle =
    "text-md rounded-md border border-[var(--gray-30)] px-3 py-2";
  const selectedStyle = "bg-[var(--gray-70)] text-[var(--white)]";
  return (
    <div className="mb-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap justify-start gap-1">
          {options.map((option) => (
            <button
              key={option.value}
              className={`${baseStyle} ${
                selectedOption === option.value ? selectedStyle : ""
              }`}
              onClick={() => onSelect(option.value)}
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
