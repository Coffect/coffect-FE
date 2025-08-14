/*
  author      : 썬더
  description : 관심사 선택 화면 (최대 4개 선택, 첫 번째 선택 강조, 조건에 따라 다음 버튼 비활성화)
*/

import { useState } from "react";
import { useEffect } from "react";
import SignupPageLayout from "./shared/SignupLayout";
import type { StepProps } from "../../types/signup";

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
// 관심사 목록 숫자와 매핑
const CATEGORY_NAME_TO_ID: Record<string, number> = {
  창업: 1,
  개발: 2,
  디자인: 3,
  기획: 4,
  AI: 5,
  글쓰기: 6,
  독서: 7,
  마케팅: 8,
  여행: 9,
  "데이터 분석": 10,
  하드웨어: 11,
  영화: 12,
  외국어: 13,
  악기: 14,
  네트워킹: 15,
};

const MAX_SELECTION = 4; // 최대 선택 가능 수

const InterestsSelection = ({ onNext }: StepProps) => {
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
        setError("최대 4개까지 선택");
        return prev;
      }

      // 새 항목 추가
      return [...prev, item];
    });
  };
  //선택 초기화
  const handleReset = () => setSelected([]);

  // 다음 버튼 클릭 시 실행되는 함수
  const handleSubmit = () => {
    // 선택이 1개도 없으면 에러
    if (selected.length === 0) {
      setError("최소 1개이상 선택");
      return;
    }

    // 선택된 항목 부모로 전달하고 다음 단계로 이동
    const selectedIds = selected.map((item) => CATEGORY_NAME_TO_ID[item]);
    //interest 상태 업데이트
    onNext({ interest: selectedIds.join(",") });
  };

  useEffect(() => {
    // 진입 시 스크롤 막기
    document.body.style.overflow = "hidden";
    return () => {
      // 컴포넌트 종료 시 스크롤 다시 허용
      document.body.style.overflow = "auto";
    };
  }, []);
  // 에러 메시지  2초 후 자동 제거
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <SignupPageLayout
      bottomButton={
        <div className="mt-auto flex w-full gap-2">
          {/* 건너뛰기 버튼 */}
          <button
            onClick={() => onNext?.({ interest: "" })}
            className="flex-[1.5] rounded-xl border-[1.5px] border-[var(--gray-20)] py-[4%] text-center text-lg font-semibold text-[var(--gray-50)]"
          >
            건너뛰기
          </button>

          {/* 다음 버튼: 선택된 항목이 없으면 비활성화 색상 */}
          <button
            onClick={handleSubmit}
            className={`flex-3 rounded-xl py-[4%] text-center text-lg font-semibold ${
              selected.length > 0
                ? "bg-[var(--gray-80)] text-[var(--gray-0)]"
                : "bg-[var(--gray-10)] text-[var(--gray-50)]"
            }`}
          >
            다음
          </button>
        </div>
      }
    >
      <p className="mb-[2%] pt-[10%] text-base font-semibold text-orange-500">
        최대 4개
      </p>
      <h2 className="mb-[10%] text-[22px] leading-normal font-bold">
        관심사를 알려주세요
        <br />
        비슷한 친구들을 추천해줄게요!
      </h2>

      <button
        onClick={handleReset}
        className="mb-3 text-sm font-medium text-[var(--gray-30)]"
      >
        초기화 <span className="text-[18px]">⟳</span>
      </button>

      {/* 관심사 선택 버튼 리스트 */}
      <div className="mb-4 flex flex-wrap justify-start gap-2 pr-[20%]">
        {OPTIONS.map((opt) => {
          const isSelected = selected.includes(opt); // 현재 항목이 선택되었는지 여부

          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className={`inline-block rounded-lg px-[8%] py-[4%] text-lg font-medium transition-all ${
                isSelected
                  ? "bg-[var(--gray-70)] text-[var(--gray-0)]" // 선택된 항목은 검정 배경
                  : "bg-[var(--gray-5)] text-[var(--gray-70)]" // 미선택 항목은 회색 배경
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* 에러 메시지 표시 */}
      {error && (
        <p className="absolute bottom-[80px] left-1/2 -translate-x-1/2 text-base font-medium text-[var(--noti)]">
          {error}
        </p>
      )}
    </SignupPageLayout>
  );
};

export default InterestsSelection;
