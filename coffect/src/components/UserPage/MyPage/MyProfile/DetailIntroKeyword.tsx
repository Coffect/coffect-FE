/*
author : 재하
description : 마이페이지 상세 소개 - 관심 키워드 선택/수정 컴포넌트입니다.
*/
import { useState } from "react";
import editIcon from "../../../../assets/icon/mypage/editGray.png";
import checkIcon from "../../../../assets/icon/mypage/check.png";

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

// 키워드별 색상 매핑
const KEYWORD_COLORS: Record<string, string> = {
  창업: "bg-[var(--startup-bg)] text-[var(--startup-text)]",
  개발: "bg-[var(--development-bg)] text-[var(--development-text)]",
  디자인: "bg-[var(--design-bg)] text-[var(--design-text)]",
  기획: "bg-[var(--plan-bg)] text-[var(--plan-text)]",
  AI: "bg-[var(--ai-bg)] text-[var(--ai-text)]",
  글쓰기: "bg-[var(--write-bg)] text-[var(--write-text)]",
  독서: "bg-[var(--read-bg)] text-[var(--read-text)]",
  마케팅: "bg-[var(--marketing-bg)] text-[var(--marketing-text)]",
  여행: "bg-[var(--trip-bg)] text-[var(--trip-text)]",
  "데이터 분석": "bg-[var(--data-bg)] text-[var(--data-text)]",
  하드웨어: "bg-[var(--hw-bg)] text-[var(--hw-text)]",
  영화: "bg-[var(--movie-bg)] text-[var(--movie-text)]",
  외국어: "bg-[var(--language-bg)] text-[var(--language-text)]",
  악기: "bg-[var(--music-bg)] text-[var(--music-text)]",
  네트워킹: "bg-[var(--networking-bg)] text-[var(--networking-text)]",
};

const DetailIntroKeyword = () => {
  // 선택된 키워드 상태 (최대 4개)
  const [selected, setSelected] = useState<string[]>([
    "디자인",
    "개발",
    "창업",
    "글쓰기",
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
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-end justify-start">
          <span className="text-lg font-semibold text-[var(--gray-90)]">
            💡 관심 키워드
          </span>
          {editMode && (
            <span className="ml-3 text-sm text-[var(--gray-40)]">
              최대 4개 선택
            </span>
          )}
        </div>
        <button
          onClick={() => (editMode ? handleEditDone() : setEditMode(true))}
        >
          {editMode ? (
            <img src={checkIcon} className="mx-1.5 h-6 w-6" />
          ) : (
            <img src={editIcon} className="mx-1.5 h-6 w-6" />
          )}
        </button>
      </div>

      {/* 키워드 목록: 뷰 모드/수정 모드 분기 */}
      {!editMode ? (
        <div className="flex flex-wrap gap-1">
          {/* 선택된 키워드만 노출, 선택 순서대로, 각 키워드별 색상 */}
          {selected.length === 0 ? (
            <span className="text-md text-[var(--gray-40)]">
              아직 관심 키워드가 등록되지 않았어요.
            </span>
          ) : (
            selected.map((keyword) => (
              <span
                key={keyword}
                className={`rounded-lg px-2.5 py-1 text-sm ${KEYWORD_COLORS[keyword] || "bg-white text-gray-800"}`}
              >
                {keyword}
              </span>
            ))
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1">
          {/* 전체 키워드 중 선택/비선택/비활성화 분기 */}
          {ALL_KEYWORDS.map((keyword) => {
            const isSelected = selected.includes(keyword);
            const disabled = !isSelected && selected.length >= 4;
            return (
              <button
                key={keyword}
                type="button"
                className={`rounded-lg px-2.5 py-1 text-sm focus:outline-none ${
                  isSelected
                    ? KEYWORD_COLORS[keyword] || "bg-white text-gray-800"
                    : "bg-[var(--gray-5)] text-[var(--gray-60)]"
                } ${disabled ? "cursor-not-allowed" : ""}`}
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
