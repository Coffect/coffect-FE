/*
author : 썬더
description : 학교, 학과, 전공 선택 화면 
              학교, 학과 : 타이핑으로 입력 및 검색 + 자동완성 + 드롭다운 키보드 하이라이팅 
              학번 입력 
              학교, 학과, 학번 모두 입력 시 다음 버튼 활성화
*/

import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import SignupPageLayout from "./shared/SignupLayout";
import type { StepProps } from "../../types/signup";
import { searchDept, searchUniv } from "../../api/univ";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

//학교 정보 타입
interface Univ {
  id: number;
  name: string;
  location: string;
}
//전공 정보 타입
interface Major {
  dept: string;
  univ: string;
  college: string;
  location: string;
}

const SchoolSelection: React.FC<StepProps> = ({ onNext, onUpdate }) => {
  // 학교 검색어 입력값 (사용자 타이핑 상태)
  const [schoolQuery, setSchoolQuery] = useState("");
  // schoolQuery에 디바운싱 적용 (입력 후 500ms 동안 변경 없을 시 반영)
  const debouncedschoolQuery = useDebounce(schoolQuery, 500);
  // 선택된 학교 객체 (선택 후 schoolQuery와 별도로 유지됨)
  const [selectedSchool, setSelectedSchool] = useState<Univ | null>(null);
  // 학교 드롭다운 내 키보드 하이라이팅 인덱스
  const [highlightedSchoolIndex, setHighlightedSchoolIndex] = useState(-1);
  // 학교 드롭다운 표시 여부
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);

  // 전공 검색어 입력값
  const [majorQuery, setMajorQuery] = useState("");
  // majorQuery에 디바운싱 적용 (입력 후 500ms 동안 변경 없을 시 반영)
  const debouncedMajorQuery = useDebounce(majorQuery, 500);
  // 선택된 전공 문자열
  const [selectedMajor, setSelectedMajor] = useState<string | null>(null);
  // 전공 드롭다운 내 키보드 하이라이팅 인덱스
  const [highlightedMajorIndex, setHighlightedMajorIndex] = useState(-1);
  // 전공 드롭다운 표시 여부
  const [showMajorDropdown, setShowMajorDropdown] = useState(false);

  // 입력한 입학년도 (숫자 문자열 형태)
  const [studentId, setStudentId] = useState<string>("");
  // 입학년도 드롭다운 내 키보드 하이라이팅 인덱스
  const [highlightedYearIndex, setHighlightedYearIndex] = useState(-1);
  // 입학년도 드롭다운 표시 여부
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  //올해
  const currentYear = new Date().getFullYear();
  // 입학년도 리스트 데이터(올해 포함 16년)
  const yearOptions = Array.from({ length: 16 }, (_, i) => currentYear - i);

  // query나 dropdown 상태가 변경되면 학교 자동완성 쿼리
  const { data: schoolList } = useQuery<{ univList: Univ[] }>({
    queryKey: ["searchUniv", debouncedschoolQuery],
    queryFn: () => searchUniv(debouncedschoolQuery),
    enabled: !!debouncedschoolQuery && showSchoolDropdown,
    staleTime: 30000, //30초간 동일 쿼리 재요청시 캐시된 응답 제공
    retry: false,
  });

  // 전공 자동완성 쿼리
  const { data: majorList } = useQuery<{ deptList: Major[] }>({
    queryKey: ["searchDept", debouncedMajorQuery, selectedSchool?.name],
    queryFn: () =>
      searchDept({
        deptSearch: debouncedMajorQuery,
        univName: selectedSchool!.name,
      }),
    enabled: !!debouncedMajorQuery && !!selectedSchool && showMajorDropdown,
    staleTime: 30000,
    retry: false,
  });

  // 학교를 선택했을 때 실행되는 핸들러
  const selectSchool = (school: Univ) => {
    setSelectedSchool(school);
    setSchoolQuery(school.name);
    setShowSchoolDropdown(false);
    setMajorQuery(""); // 학교 바뀌면 전공 초기화
  };
  // 전공 선택했을 때 실행되는 핸들러
  const selectMajor = (major: string) => {
    setSelectedMajor(major);
    setMajorQuery(major);
    setShowMajorDropdown(false);
  };
  // 선택된 연도 클릭 핸들러
  const selectYear = (year: number) => {
    setStudentId(String(year));
    setShowYearDropdown(false);
    setHighlightedYearIndex(-1);
  };

  // 키보드 네비게이션 (학교)
  const handleSchoolKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSchoolDropdown) return;
    //화살표 내리기
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedSchoolIndex((i) =>
        Math.min(i + 1, (schoolList?.univList.length ?? 0) - 1),
      );
      //화살표 올리기
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedSchoolIndex((i) => Math.max(i - 1, 0));
      // 엔터 시 선택
    } else if (e.key === "Enter" && highlightedSchoolIndex >= 0) {
      const selected = schoolList?.univList?.[highlightedSchoolIndex];
      if (selected) selectSchool(selected);
    }
  };

  // 키보드 네비게이션 (전공)
  const handleMajorKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showMajorDropdown || !majorList) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedMajorIndex((i) =>
        Math.min(i + 1, majorList.deptList?.length - 1),
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedMajorIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && highlightedMajorIndex >= 0) {
      const selected = majorList?.deptList?.[highlightedMajorIndex].dept;
      if (selected) selectMajor(selected);
    }
  };
  // 입학년도 키보드 네비게이션
  const handleYearKey = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!showYearDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedYearIndex((i) => Math.min(i + 1, yearOptions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedYearIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && highlightedYearIndex >= 0) {
      const year = yearOptions[highlightedYearIndex];
      setStudentId(String(year));
      setShowYearDropdown(false);
    }
  };

  // 모든 입력의 값이 존재할 때
  const isNextEnabled = selectedSchool && selectedMajor && studentId;

  // 다음 버튼 클릭 핸들러
  const handleNext = () => {
    if (!selectedSchool) return;
    onUpdate?.({
      univId: String(selectedSchool.id),
      dept: selectedMajor!,
      studentId,
      selectedSchoolName: selectedSchool.name,
    });
    onNext();
  };
  useEffect(() => {
    // 진입 시 스크롤 막기
    document.body.style.overflow = "hidden";
    return () => {
      // 컴포넌트 종료 시 스크롤 다시 허용
      document.body.style.overflow = "auto";
    };
  }, []);
  // 각 입력창 위치로 이동(자동스크롤)
  const schoolInputRef = useRef<HTMLInputElement | null>(null);
  const majorInputRef = useRef<HTMLInputElement | null>(null);
  const studentIdInputRefs = useRef<HTMLButtonElement | null>(null);
  //아래 항목 키보드 하이라이팅 이동시 해당 위치로 이동(자동스크롤)
  const schoolRefs = useRef<(HTMLLIElement | null)[]>([]);
  const majorRefs = useRef<(HTMLLIElement | null)[]>([]);
  const studentIdRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (highlightedSchoolIndex >= 0 && showSchoolDropdown) {
      schoolRefs.current[highlightedSchoolIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightedSchoolIndex, showSchoolDropdown]);

  useEffect(() => {
    if (highlightedMajorIndex >= 0 && showMajorDropdown) {
      majorRefs.current[highlightedMajorIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightedMajorIndex, showMajorDropdown]);

  useEffect(() => {
    if (highlightedYearIndex >= 0 && showYearDropdown) {
      studentIdRefs.current[highlightedYearIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightedYearIndex, showYearDropdown]);

  return (
    <SignupPageLayout
      bottomButton={
        <button
          onClick={handleNext}
          disabled={!isNextEnabled}
          className={`w-full rounded-xl py-[4%] text-center text-lg font-semibold ${
            isNextEnabled
              ? "bg-[var(--gray-80)] text-[var(--gray-0)]"
              : "bg-[var(--gray-10)] text-[var(--gray-50)]"
          }`}
        >
          다음
        </button>
      }
    >
      <div className="pt-[10%] text-[var(--gray-90)]">
        <h2 className="leading text-[22px] font-bold">👋 반가워요!</h2>
        <p className="mt-3 text-[22px] font-bold">
          {selectedSchool
            ? "전공과 학번을 알려주세요!"
            : "어느 학교 학생이신가요?"}
        </p>

        {/* 학교 검색 입력창 */}
        <div className="relative mt-[10%]">
          <input
            type="text"
            value={schoolQuery}
            ref={schoolInputRef}
            onFocus={() =>
              setTimeout(() => {
                schoolInputRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }, 10)
            }
            onChange={(e) => {
              setSchoolQuery(e.target.value);
              setSelectedSchool(null);
              setSelectedMajor(null);
              setShowSchoolDropdown(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowSchoolDropdown(false), 100);
            }}
            onKeyDown={handleSchoolKey}
            placeholder="재학 중인 학교를 입력해주세요"
            className="h-[48px] w-full scroll-mb-[100px] rounded-[8px] border-[1.5px] border-[var(--gray-10)] px-3 py-2 text-base font-medium text-[var(--gray-90)] placeholder-[var(--gray-30)] focus:border-[2px] focus:border-gray-900 focus:ring-0 focus:outline-none"
          />
          <Search className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-[var(--gray-50)]" />
        </div>

        {/* 자동완성 드롭다운 */}
        <div className="relative">
          {showSchoolDropdown &&
            Array.isArray(schoolList?.univList) &&
            schoolList.univList.length > 0 && (
              <ul className="absolute z-10 mt-2 w-full bg-white">
                {schoolList.univList.map((s, i) => (
                  <li
                    key={s.id}
                    ref={(el: HTMLLIElement | null) => {
                      schoolRefs.current[i] = el;
                    }}
                    onClick={() => selectSchool(s)}
                    onMouseEnter={() => setHighlightedSchoolIndex(i)}
                    className={`rounded-[14px] px-4 py-3 text-base font-medium text-[var(--gray-90)] ${
                      i === highlightedSchoolIndex ? "bg-[var(--gray-5)]" : ""
                    }`}
                  >
                    <p className="text-base">{s.name}</p>
                    <p className="mt-1 text-sm text-[var(--gray-40)]">
                      {s.location}
                    </p>
                  </li>
                ))}
              </ul>
            )}
        </div>

        {/* 전공/학번 입력 (학교 선택 시) */}
        {selectedSchool && (
          <div className="mt-10">
            {/* 전공 입력 */}
            <h3 className="mb-[0.5rem] text-lg font-semibold text-[var(--gray-90)]">
              전공
            </h3>
            <div className="relative">
              <input
                type="text"
                ref={majorInputRef}
                onFocus={() =>
                  setTimeout(() => {
                    majorInputRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 10)
                }
                value={majorQuery}
                onChange={(e) => {
                  setMajorQuery(e.target.value);
                  setSelectedMajor(null);
                  setShowMajorDropdown(true);
                }}
                onKeyDown={handleMajorKey}
                onBlur={() => {
                  setTimeout(() => setShowMajorDropdown(false), 100);
                }}
                placeholder="전공을 입력해주세요"
                className="h-[48px] w-full scroll-mb-[100px] rounded-[8px] border-[1.5px] border-[var(--gray-10)] px-3 py-2 text-base font-medium text-[var(--gray-90)] placeholder-[var(--gray-30)] focus:border-[2px] focus:border-gray-900 focus:ring-0 focus:outline-none"
              />
              {showMajorDropdown &&
                Array.isArray(majorList?.deptList) &&
                majorList.deptList.length > 0 && (
                  <ul className="absolute z-10 mt-2 w-full bg-white">
                    {majorList.deptList.map((m, i) => (
                      <li
                        ref={(el: HTMLLIElement | null) => {
                          majorRefs.current[i] = el;
                        }}
                        key={m.dept}
                        onClick={() => selectMajor(m.dept)}
                        onMouseEnter={() => setHighlightedMajorIndex(i)}
                        className={`rounded-[14px] px-4 py-3 text-base font-medium text-[var(--gray-90)] ${
                          i === highlightedMajorIndex
                            ? "bg-[var(--gray-5)]"
                            : ""
                        }`}
                      >
                        <p>{m.dept}</p>
                      </li>
                    ))}
                  </ul>
                )}
            </div>
            {/* 입학년도 */}
            <div className="relative mt-10 w-full">
              <h3 className="mb-[0.5rem] text-lg leading-snug font-semibold text-[var(--gray-90)]">
                입학년도
              </h3>

              {/* 버튼: 드롭다운 토글 */}
              <button
                type="button"
                ref={studentIdInputRefs}
                onFocus={() =>
                  setTimeout(() => {
                    studentIdInputRefs.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }, 10)
                }
                onClick={() => setShowYearDropdown((prev) => !prev)}
                onKeyDown={handleYearKey}
                className="flex h-[48px] w-full items-center justify-between rounded-[8px] border-[1.5px] border-[var(--gray-10)] px-3 text-base font-medium text-[var(--gray-90)] focus:border-2 focus:border-gray-900 focus:ring-0"
              >
                {studentId ? `${studentId}년` : "입학년도"}
                {showYearDropdown ? (
                  <ChevronUp className="h-5 w-5 text-[var(--gray-50)]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[var(--gray-50)]" />
                )}{" "}
              </button>

              {/* 드롭다운  */}
              {showYearDropdown && (
                <ul className="absolute z-10 mt-2 w-full">
                  {yearOptions.map((year, i) => (
                    <li
                      key={year}
                      ref={(el: HTMLLIElement | null) => {
                        studentIdRefs.current[i] = el;
                      }}
                      onClick={() => selectYear(year)}
                      onMouseEnter={() => setHighlightedYearIndex(i)}
                      className={`cursor-pointer rounded-[14px] px-4 py-3 text-base font-medium text-[var(--gray-90)] ${
                        i === highlightedYearIndex ? "bg-[var(--gray-5)]" : ""
                      }`}
                    >
                      {year}년
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 스크롤 하단 여백 확보 */}
      <div className="h-[200px]" />
    </SignupPageLayout>
  );
};

export default SchoolSelection;
