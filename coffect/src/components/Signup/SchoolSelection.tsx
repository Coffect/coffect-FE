/*
author : 썬더
description : 학교 선택 화면 (타이핑으로 입력 및 검색 + 자동완성 + 드롭다운 키보드 하이라이팅 +학과, 학번 입력 후 다음 활성화)
              - 학교, 전공, 학번 입력 받음
*/

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { isValidStudentId } from "../../utils/validation";

// 학교 타입 정의: 이름과 주소
type School = { name: string; address: string };

// 상위 컴포넌트에서 전달받는 props
type Props = {
  onNext: () => void; // 다음 단계로 이동하는 콜백
  onChange: (school: string, major: string, studentId: string) => void; // 선택한 정보 전달 콜백
};

// 더미 학교 데이터 (자동완성용)
const schools: School[] = [
  { name: "인하대학교", address: "인천광역시 미추홀구 인하로 100" },
  { name: "인천대학교", address: "인천광역시 연수구 아카데미로 119" },
  { name: "인덕대학교", address: "서울시 노원구 초안산로 12" },
  { name: "상명대학교", address: "서울특별시 종로구 홍지문2길 20" },
  { name: "숙명여자대학교", address: "서울특별시 용산구 청파로47길 100" },
  { name: "홍익대학교", address: "서울특별시 마포구 와우산로 94" },
];

const SchoolSelection: React.FC<Props> = ({ onNext, onChange }) => {
  // 사용자가 입력 중인 학교 검색어
  const [query, setQuery] = useState<string>("");

  // 검색어에 따라 필터링된 학교 리스트
  const [filtered, setFiltered] = useState<School[]>([]);

  // 최종 선택된 학교 이름
  const [selected, setSelected] = useState<string>("");

  // 드롭다운에서 현재 하이라이트된 인덱스
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  // 드롭다운 표시 여부
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // 입력한 전공
  const [major, setMajor] = useState<string>("");

  // 입력한 학번
  const [studentId, setStudentId] = useState<string>("");

  //학번 유효성 검사
  const isStudentIdValid = isValidStudentId(studentId);

  //제출버튼 클릭 여부
  const [, setHasTriedSubmit] = useState<boolean>(false);

  // query나 dropdown 상태가 변경되면 자동완성 필터링 실행
  useEffect(() => {
    if (query && showDropdown) {
      setFiltered(schools.filter((s) => s.name.startsWith(query)));
    } else {
      setFiltered([]);
    }
    setHighlightedIndex(-1);
  }, [query, showDropdown]);

  // 학교를 선택했을 때 실행되는 핸들러
  const selectSchool = (school: School) => {
    setSelected(school.name);
    setQuery(school.name);
    setShowDropdown(false);
  };

  // 입력창 값 변경 시 처리
  const handleQueryChange = (value: string) => {
    setQuery(value);
    setShowDropdown(true);
  };

  // 키보드 방향키/엔터로 드롭다운 탐색
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" && highlightedIndex >= 0) {
      selectSchool(filtered[highlightedIndex]);
    }
  };

  // 다음 버튼 활성화 조건: 모든 필수 입력값이 채워져 있고 학번 유효성 검사를 만족할 때
  const isNextEnabled =
    selected !== "" && major.trim() !== "" && isStudentIdValid;

  // 다음 버튼 클릭 핸들러
  const handleNext = () => {
    setHasTriedSubmit(true);

    if (isNextEnabled) {
      onChange(selected, major, studentId);
      onNext();
    }
  };
  useEffect(() => {
    // 진입 시 스크롤 막기
    document.body.style.overflow = "hidden";
    return () => {
      // 컴포넌트 종료 시 스크롤 다시 허용
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="relative flex h-screen w-full flex-col bg-white px-[4%] pt-[2%]">
      <div className="flex-1 overflow-y-auto">
        <div className="pt-[10%] text-[var(--gray-90)]">
          <h2 className="leading text-[22px] font-bold">👋 반가워요!</h2>
          <p className="mt-3 text-[22px] font-bold">
            {selected ? "전공과 학번을 알려주세요!" : "어느 학교 학생이신가요?"}
          </p>
          {/* 학교 검색 입력창 */}
          <div className="relative mt-[10%]">
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="재학 중인 학교를 입력해주세요"
              className="h-[48px] w-full rounded-[8px] border-[1.5px] border-[var(--gray-10)] px-3 py-2 text-base font-medium text-[var(--gray-90)] placeholder-[var(--gray-30)] focus:border-[2px] focus:border-gray-900 focus:ring-0 focus:outline-none"
            />
            <Search className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-[var(--gray-50)]" />
          </div>

          {/* 자동완성 드롭다운 */}
          {showDropdown && filtered.length > 0 && (
            <ul className="mt-1.5 w-full overflow-y-auto">
              {filtered.map((s, idx) => (
                <li
                  key={s.name}
                  onClick={() => selectSchool(s)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`cursor-pointer rounded-xl px-4 py-3 ${
                    idx === highlightedIndex ? "bg-[var(--gray-5)]" : ""
                  }`}
                >
                  <p className="text=[var(--gray-90)] text-base">{s.name}</p>
                  <p className="mt-0.5 text-sm text-[var(--gray-40)]">
                    {s.address}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {/* 전공 & 학번 입력 폼 (학교 선택 시에만 노출) */}
          {selected && (
            <div className="mt-10">
              <h3 className="mb-[0.5rem] text-lg leading-snug font-semibold text-[var(--gray-90)]">
                전공
              </h3>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="전공을 입력해주세요"
                className="mb-[2rem] h-[48px] w-full rounded-[8px] border-[1.5px] border-[var(--gray-10)] px-3 py-2 text-base font-medium text-[var(--gray-90)] placeholder-[var(--gray-30)] focus:border-[2px] focus:border-gray-900 focus:ring-0 focus:outline-none"
              />

              <h3 className="mb-[0.5rem] text-lg leading-snug font-semibold text-[var(--gray-90)]">
                학번
              </h3>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="학번을 입력해주세요"
                className="h-[48px] w-full rounded-[8px] border-[1.5px] border-[var(--gray-10)] px-3 py-2 text-base font-medium text-[var(--gray-90)] placeholder-[var(--gray-30)] focus:border-[2px] focus:border-gray-900 focus:ring-0 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* 다음 버튼 */}
        <div className={`w-full pb-20 ${selected ? "pt-75" : "pt-130"}`}>
          <button
            onClick={handleNext}
            disabled={!isNextEnabled}
            className={`w-full rounded-xl py-[4%] text-center text-lg font-semibold ${
              isNextEnabled
                ? "bg-[var(--gray-80)] text-[var(--gray-0)]"
                : "bg-[var(--gray-10)] text-[var(--gray-50)]"
            } `}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolSelection;
