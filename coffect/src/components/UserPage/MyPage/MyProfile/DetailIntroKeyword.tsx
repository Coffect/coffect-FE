/*
author : 재하
description : 마이페이지 상세 소개 - 관심 키워드 선택/수정 컴포넌트입니다.
*/
import { useState } from "react";
import { Pencil, Check } from "lucide-react";

const ALL_KEYWORDS = [
  "창업",
  "개발",
  "디자인",
  "독서",
  "마케팅",
  "기획",
  "AI",
  "글쓰기",
  "여행",
  "악기",
  "데이터 분석",
  "하드웨어",
  "영화",
  "외국어",
];

const DetailIntroKeyword = () => {
  // 선택된 키워드 상태 (최대 4개)
  const [selected, setSelected] = useState<string[]>([
    "창업",
    "개발",
    "디자인",
    "독서",
  ]);
  // 수정 모드 상태
  const [editMode, setEditMode] = useState(false);

  // 키워드 선택/해제 핸들러
  // 이미 선택된 키워드는 해제, 4개 미만일 때만 추가 선택 가능
  const handleKeywordClick = (keyword: string) => {
    if (selected.includes(keyword)) {
      setSelected(selected.filter((k) => k !== keyword));
    } else if (selected.length < 4) {
      setSelected([...selected, keyword]);
    }
  };

  // 수정 완료 핸들러 (수정 모드 종료)
  const handleEditDone = () => {
    setEditMode(false);
  };

  return (
    <div className="mb-8">
      {/* 헤더: 관심 키워드 + 수정/완료 버튼 */}
      <div className="mb-2 flex items-center justify-between gap-2 text-base">
        <span className="font-semibold">
          💡 관심 키워드
          {editMode && <span className="ml-1 text-xs">(최대 4개)</span>}
        </span>
        <button
          className="ml-1 rounded p-1"
          onClick={() => (editMode ? handleEditDone() : setEditMode(true))}
        >
          {editMode ? (
            <Check className="h-[1em] w-[1em]" />
          ) : (
            <Pencil className="h-[1em] w-[1em]" />
          )}
        </button>
      </div>

      {/* 키워드 목록: 뷰 모드/수정 모드 분기 */}
      {!editMode ? (
        <div className="flex flex-wrap gap-2">
          {/* 선택된 키워드만 노출 */}
          {selected.map((keyword, idx) => (
            <span
              key={keyword}
              className={`rounded border px-3 py-1 text-sm font-medium ${
                idx === 0
                  ? "border-yellow-300 bg-yellow-300 text-black" // 첫 번째 선택: 노란색
                  : "border-gray-300 bg-white text-gray-800"
              }`}
            >
              {keyword}
            </span>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {/* 전체 키워드 중 선택/비선택/비활성화 분기 */}
          {ALL_KEYWORDS.map((keyword) => {
            const isSelected = selected.includes(keyword);
            const selectedIdx = selected.indexOf(keyword);
            const disabled = !isSelected && selected.length >= 4;
            return (
              <button
                key={keyword}
                type="button"
                className={`rounded border px-3 py-1 text-sm font-medium transition-colors duration-100 focus:outline-none ${
                  isSelected
                    ? selectedIdx === 0
                      ? "border-yellow-300 bg-yellow-300 text-black"
                      : "border-gray-800 bg-gray-800 text-white"
                    : "border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
                } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
                onClick={() => handleKeywordClick(keyword)}
                disabled={disabled}
              >
                {keyword}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DetailIntroKeyword;
