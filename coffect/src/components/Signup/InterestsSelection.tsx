/*
  author      : 썬더
  description : 관심사 선택 화면 (최대 4개 선택, 첫 번째 선택 강조, 조건에 따라 다음 버튼 비활성화)
*/

import { useState } from "react";

// 부모로부터 전달받을 Props 정의
type Props = {
  onNext: () => void; // 다음 단계 이동 함수
  onChange: (list: string[]) => void; // 선택된 관심사 목록 전달 함수
};
// 화면 세로 길이 600이하인지 측정
const isShort = typeof window !== "undefined" && window.innerHeight < 600;

// 선택 가능한 관심사 목록
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

const MAX_SELECTION = 4; // 최대 선택 가능 수

const InterestsSelection = ({ onNext, onChange }: Props) => {
  // 선택된 관심사 상태
  const [selected, setSelected] = useState<string[]>([]);
  // 에러 메시지 상태
  const [error, setError] = useState("");

  // 관심사 버튼 클릭 시 호출되는 함수
  const toggle = (item: string) => {
    setError(""); // 에러 초기화

    setSelected((prev) => {
      // 이미 선택된 항목이면 제거
      if (prev.includes(item)) return prev.filter((i) => i !== item);

      // 선택 수가 최대치에 도달했으면 에러 처리
      if (prev.length >= MAX_SELECTION) {
        setError("관심사는 최대 4개까지 선택할 수 있어요.");
        return prev;
      }

      // 새 항목 추가
      return [...prev, item];
    });
  };

  // 다음 버튼 클릭 시 실행되는 함수
  const handleSubmit = () => {
    // 선택이 1개도 없으면 에러
    if (selected.length === 0) {
      setError("최소 1개의 관심사를 선택해주세요.");
      return;
    }

    // 선택된 항목 부모로 전달하고 다음 단계로 이동
    onChange(selected);
    onNext();
  };

  return (
    <div className="flex h-full w-full flex-col bg-white px-[6%] py-[12%] text-left text-xs">
      {/* 상단 안내문 */}
      <p className="mb-[3%] text-xs font-semibold text-orange-500">최대 4개</p>
      <h2 className="mb-[0.5rem] text-lg leading-snug font-bold">
        관심사를 알려주세요
        <br />
        <span className="text-lg font-bold">비슷한 친구들을 추천해줄게요!</span>
      </h2>
      <p className="mb-[1.5rem] text-sm text-[var(--gray-40)]">
        나중에 언제든지 변경 가능해요
      </p>

      {/* 관심사 선택 버튼 리스트 */}
      <div className="mb-4 flex flex-wrap justify-start gap-2 pr-[20%]">
        {OPTIONS.map((opt) => {
          const isSelected = selected.includes(opt); // 현재 항목이 선택되었는지 여부
          const isFirst = selected[0] === opt; // 첫 번째로 선택된 항목인지 여부

          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className={`inline-block rounded-lg text-sm transition-all ${
                isSelected
                  ? isFirst
                    ? "bg-orange-500 text-[var(--gray-0)]" // 첫 선택 항목은 주황색 강조
                    : "bg-[var(--gray-70)] text-[var(--gray-0)]" // 나머지는 검정
                  : "bg-[var(--gray-5)] text-[var(--gray-70)]" // 미선택 항목은 회색
              } ${isShort ? "px-[4%] py-[2%]" : "px-[8%] py-[4%]"}`} // 세로 길이에 따라 다른 여백 적용
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* 에러 메시지 표시 */}
      {error && <p className="mb-4 text-sm text-[var(--noti)]">{error}</p>}

      {/* 하단 버튼 그룹 */}
      <div className="absolute bottom-[4%] left-1/2 w-full max-w-md -translate-x-1/2 transform px-[6%]">
        <div className="mt-auto flex w-full gap-2">
          {/* 건너뛰기 버튼 */}
          <button
            onClick={onNext}
            className="flex-1 rounded-xl border border-[var(--gray-20)] py-[4%] text-center text-sm text-[var(--gray-50)]"
          >
            건너뛰기
          </button>

          {/* 다음 버튼: 선택된 항목이 없으면 비활성화 색상 */}
          <button
            onClick={handleSubmit}
            className={`flex-2 rounded-xl py-[4%] text-center text-sm ${
              selected.length > 0
                ? "bg-[var(--gray-80)] text-[var(--gray-0)]"
                : "bg-[var(--gray-10)] text-[var(--gray-50)]"
            }`}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterestsSelection;
