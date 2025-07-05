/*
author : 강신욱
description : Header의 필터 버튼 클릭 시 나오는 Modal 컴포넌트입니다.
*/

import { useState } from "react";
import "./FilterModalAnimation.css";

// 공통 스타일 변수 정의
const buttonStyle =
  "w-full rounded bg-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-300 hover:border hover:border-gray-400";
const selectedButtonStyle = "bg-gray-500 text-white";

// 필터 타입 정의
interface Filters {
  type: string | null;
  topic: string | null;
}

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (filters: Filters) => void;
  initialFilters: Filters;
}

const FilterModal = ({
  isVisible,
  onClose,
  onApply,
  initialFilters,
}: FilterModalProps) => {
  /* 
  SelectedType : 글 종류 선택에 대한 상태관리입니다.
  SelectedTopic : 글 주제 선택에 대한 상태관리입니다.
  초기값은 initialFilters에서 받아온 값을 사용합니다. (null, null)
  */
  const [selectedType, setSelectedType] = useState<string | null>(
    initialFilters.type,
  );
  const [selectedTopic, setSelectedTopic] = useState<string | null>(
    initialFilters.topic,
  );

  /***  버튼이 클릭 되었을 때 활성화되고, 재클릭 시 비활성화되는 로직입니다. ***/
  const handleTypeClick = (type: string) => {
    setSelectedType((prev) => (prev === type ? null : type));
  };

  const handleTopicClick = (topic: string) => {
    setSelectedTopic((prev) => (prev === topic ? null : topic));
  };

  /***  필터 적용 버튼 클릭 시 호출되는 함수입니다. ***/
  const handleApplyFilter = () => {
    onApply({ type: selectedType, topic: selectedTopic });
  };

  /***  초기화 버튼 클릭 시 호출되는 함수입니다.  ***/
  const handleReset = () => {
    setSelectedType(null);
    setSelectedTopic(null);
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 backdrop-grayscale-500"
        onClick={onClose}
      ></div>

      <div
        className={`fixed bottom-0 left-0 z-50 h-[60%] w-full rounded-t-lg bg-white shadow-lg ${
          isVisible ? "animate-slide-up" : "hidden"
        }`}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between pb-4">
              <h2 className="text-lg font-bold">글 카테고리 선택하기</h2>
              <button
                className="text-sm text-gray-600 underline underline-offset-2 hover:text-gray-800"
                onClick={handleReset}
              >
                초기화
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-md mb-2 font-semibold">글 종류 선택</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  "아티클",
                  "팀원모집",
                  "질문",
                  "도움 필요",
                  "후기글",
                  "팁 공유",
                ].map((type) => (
                  <button
                    key={type}
                    className={`${buttonStyle} ${selectedType === type ? selectedButtonStyle : ""}`}
                    onClick={() => handleTypeClick(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-md mb-2 font-semibold">글 주제 선택</h3>
              <div className="grid grid-cols-4 gap-2">
                {[
                  "프로덕트",
                  "개발",
                  "디자인",
                  "기획",
                  "인사이트",
                  "취업",
                  "창업",
                  "학교",
                ].map((topic) => (
                  <button
                    key={topic}
                    className={`${buttonStyle} ${selectedTopic === topic ? selectedButtonStyle : ""}`}
                    onClick={() => handleTopicClick(topic)}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center-safe gap-3 p-4">
            <button
              className={`border-4 px-4 py-2 ${
                selectedType || selectedTopic
                  ? "bg-gray-500 text-white"
                  : "cursor-not-allowed"
              }`}
              disabled={!selectedType && !selectedTopic}
              onClick={handleApplyFilter}
            >
              필터 적용하기
            </button>
            <button className="border-4 px-4 py-2" onClick={onClose}>
              취소
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterModal;
