/*
author : 썬더
description : 관심사 선택 화면
*/

import { useState } from "react";

/*
  InterestsSelection 컴포넌트가 받을 props 타입을 정의
    onNext   – 선택 완료 후 다음 단계로 이동
    onChange – 선택된 관심사 목록을 부모에게 전달
*/
type Props = {
  onNext: () => void;
  onChange: (list: string[]) => void;
};

// 선택 가능한 관심사 목록 (최대 4개 선택)
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

// 최대 선택 개수 상수
const MAX_SELECTION = 4;

const InterestsSelection = ({ onNext, onChange }: Props) => {
  // 선택된 관심사 상태
  const [selected, setSelected] = useState<string[]>([]);
  // 유효성 검사 및 에러 메시지 상태
  const [error, setError] = useState("");

  /**
   * 관심사 토글 함수
   * - 이미 선택된 항목은 해제
   * - 선택 개수가 MAX_SELECTION 초과 시 에러 발생
   */
  const toggle = (item: string) => {
    setError("");
    setSelected((prev) => {
      if (prev.includes(item)) {
        // 이미 선택된 항목 해제
        return prev.filter((i) => i !== item);
      }
      if (prev.length >= MAX_SELECTION) {
        // 최대 개수 초과 시 에러 메시지 설정
        setError("관심사는 최대 4개까지 선택할 수 있어요.");
        return prev;
      }
      // 새 항목 추가
      return [...prev, item];
    });
  };

  /**
   * 저장 버튼 클릭 시 호출
   * - 최소 1개 이상 선택되지 않으면 에러
   * - 유효 시 부모에게 전달 후 다음 단계로 이동
   */
  const handleSubmit = () => {
    if (selected.length === 0) {
      setError("최소 1개의 관심사를 선택해주세요.");
      return;
    }
    onChange(selected);
    onNext();
  };

  return (
    <div className="min-h-screen bg-white px-[6%] py-[8%]">
      {/* 건너뛰기 버튼 */}
      <div className="mb-2 text-right">
        <button onClick={onNext} className="text-sm text-gray-400 underline">
          건너뛰기
        </button>
      </div>

      {/* 안내 문구 */}
      <h2 className="mb-4 text-[4.5vw] leading-snug font-bold">
        관심사가 맞는 친구들을 추천해줄게요!
        <br />
        <span className="text-[3.5vw] font-normal text-gray-500">
          언제든지 변경 가능해요. (최대 4개 선택)
        </span>
      </h2>

      {/* 관심사 옵션 버튼 */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={`rounded border px-2 py-2 text-[3.8vw] ${
              selected.includes(opt)
                ? "border-black bg-black text-white"
                : "border-gray-300 bg-white text-black"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* 에러 메시지 표시(최대개수초과/선택x) */}
      {error && <div className="mb-4 text-[3.5vw] text-red-500">{error}</div>}

      {/* 저장(완료) 버튼 */}
      <button
        onClick={handleSubmit}
        className="w-full rounded bg-black py-3 text-[4vw] text-white"
      >
        저장하기
      </button>
    </div>
  );
};

export default InterestsSelection;
