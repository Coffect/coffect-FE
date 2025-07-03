/* author : 강신욱
description : Header(고정바) 에서 토글 버튼 클릭 시 나오는 모달 컴포넌트 입니다. */

import { useState } from "react";
import "./FilterModalAnimation.css";

// 공통 스타일 변수 정의
const buttonStyle =
  "w-full rounded bg-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-300 hover:border hover:border-gray-400";
const selectedButtonStyle = "bg-gray-500 text-white";

const FilterModal = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  /********** 칩 선택 관련 로직 **********/
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const handleTypeClick = (type: string) => {
    setSelectedType((prev) => (prev === type ? null : type)); // 선택된 칩을 재클릭하면 해제
  };

  const handleTopicClick = (topic: string) => {
    setSelectedTopic((prev) => (prev === topic ? null : topic)); // 선택된 칩을 재클릭하면 해제
  };

  /********** 필터 적용 버튼 클릭 시 로직 **********/
  const handleApplyFilter = () => {
    if (selectedType || selectedTopic) {
      console.log("필터 적용됨:", { selectedType, selectedTopic });
      onClose(); // 모달 닫기
    }
  };

  /********** 초기화 버튼 클릭 시 로직 **********/
  const handleReset = () => {
    setSelectedType(null);
    setSelectedTopic(null);
  };

  /********** isVisible null 이면 Modal 이 안나오도록 함. **********/
  if (!isVisible) return null;

  return (
    <>
      {/***** 모달 외 부분 배경 클릭 시 모달 닫기 *****/}
      <div
        className="fixed inset-0 z-40 backdrop-grayscale-100"
        onClick={onClose}
      ></div>

      {/***** 모달 *****/}
      <div
        className={`fixed bottom-0 left-0 z-50 h-[60%] w-full rounded-t-lg bg-white shadow-lg ${
          isVisible ? "animate-slide-up" : "hidden"
        }`}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="p-6">
            {/* 상단 영역 */}
            <div className="mb-4 flex items-center justify-between pb-4">
              <h2 className="text-lg font-bold">글 카테고리 선택하기</h2>
              <button
                className="text-sm text-gray-600 underline underline-offset-2 hover:text-gray-800"
                onClick={handleReset}
              >
                초기화
              </button>
            </div>

            {/* 글 종류 선택 버튼 */}
            <div className="mb-6">
              <h3 className="text-md mb-2 font-semibold">글 종류 선택</h3>
              <div className="grid grid-cols-3 gap-2">
                {["종류1", "종류2", "종류3", "종류4", "종류5", "종류6"].map(
                  (type) => (
                    <button
                      key={type}
                      className={`${buttonStyle} ${selectedType === type ? selectedButtonStyle : ""}`}
                      onClick={() => handleTypeClick(type)}
                    >
                      {type}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* 글 주제 선택 버튼 */}
            <div>
              <h3 className="text-md mb-2 font-semibold">글 주제 선택</h3>
              <div className="grid grid-cols-3 gap-2">
                {["주제1", "주제2", "주제3", "주제4", "주제5", "주제6"].map(
                  (topic) => (
                    <button
                      key={topic}
                      className={`${buttonStyle} ${selectedTopic === topic ? selectedButtonStyle : ""}`}
                      onClick={() => handleTopicClick(topic)}
                    >
                      {topic}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* 하단 영역: 필터 적용 및 취소 버튼 */}
          <div className="flex items-center justify-center-safe gap-3 border-t p-4">
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
