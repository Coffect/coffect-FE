/*
author : 썬더
description : 학교, 학과, 전공 선택 화면 
              학교, 학과 : 타이핑으로 입력 및 검색 + 자동완성 + 드롭다운 키보드 하이라이팅 
              학번 입력 
              학교, 학과, 학번 모두 입력 시 다음 버튼 활성화
*/

import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { isValidStudentId } from "../../utils/validation";
import SignupPageLayout from "./shared/SignupLayout";
import type { StepProps } from "../../types/signup";
import { searchDept, searchUniv } from "../../api/univ";
import { useQuery } from "@tanstack/react-query";

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
  const [schoolQuery, setSchoolQuery] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<Univ | null>(null);
  const [highlightedSchoolIndex, setHighlightedSchoolIndex] = useState(-1);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);

  const [majorQuery, setMajorQuery] = useState("");
  const [highlightedMajorIndex, setHighlightedMajorIndex] = useState(-1);
  const [showMajorDropdown, setShowMajorDropdown] = useState(false);
  // 입력한 학번
  const [studentId, setStudentId] = useState<string>("");

  //학번 유효성 검사
  const isStudentIdValid = isValidStudentId(studentId);

  // query나 dropdown 상태가 변경되면 학교 자동완성 쿼리
  const { data: schoolList } = useQuery<{ univList: Univ[] }>({
    queryKey: ["searchUniv", schoolQuery],
    queryFn: () => searchUniv(schoolQuery),
    enabled: !!schoolQuery && showSchoolDropdown,
    staleTime: 30000, //30초간 동일 쿼리 재요청시 캐시된 응답 제공
    retry: false,
  });

  // 전공 자동완성 쿼리
  const { data: majorList } = useQuery<{ deptList: Major[] }>({
    queryKey: ["searchDept", majorQuery, selectedSchool?.name],
    queryFn: () =>
      searchDept({
        deptSearch: majorQuery,
        univName: selectedSchool!.name,
      }),
    enabled: !!majorQuery && !!selectedSchool && showMajorDropdown,
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
    setMajorQuery(major);
    setShowMajorDropdown(false);
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

  // 다음 버튼 활성화 조건: 모든 필수 입력값이 채워져 있고 학번 유효성 검사를 만족할 때
  const isNextEnabled = selectedSchool && majorQuery.trim() && isStudentIdValid;

  // 다음 버튼 클릭 핸들러
  const handleNext = () => {
    if (!selectedSchool) return;
    onUpdate?.({
      univId: String(selectedSchool.id),
      dept: majorQuery,
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
  //입력창 클릭 시 해당 위치로 이동
  const majorRef = useRef<HTMLInputElement>(null);
  const studentIdRef = useRef<HTMLInputElement>(null);

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
            onChange={(e) => {
              setSchoolQuery(e.target.value);
              setShowSchoolDropdown(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowSchoolDropdown(false), 100);
            }}
            onKeyDown={handleSchoolKey}
            placeholder="재학 중인 학교를 입력해주세요"
            className="h-[48px] w-full rounded-[8px] border-[1.5px] border-[var(--gray-10)] px-3 py-2 text-base font-medium text-[var(--gray-90)] placeholder-[var(--gray-30)] focus:border-[2px] focus:border-gray-900 focus:ring-0 focus:outline-none"
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
                ref={majorRef}
                type="text"
                value={majorQuery}
                onChange={(e) => {
                  setMajorQuery(e.target.value);
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
            <div className="mt-10">
              <h3 className="mb-[0.5rem] text-lg leading-snug font-semibold text-[var(--gray-90)]">
                입학년도
              </h3>
              <input
                ref={studentIdRef}
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                onFocus={() =>
                  setTimeout(() => {
                    studentIdRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }, 5)
                }
                placeholder="2025"
                className="h-[48px] w-1/3 scroll-mb-[100px] rounded-[8px] border-[1.5px] border-[var(--gray-10)] px-3 py-2 text-base font-medium text-[var(--gray-90)] placeholder-[var(--gray-30)] focus:border-[2px] focus:border-gray-900 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* 스크롤 하단 여백 확보 */}
      <div className="h-[100px]" />
    </SignupPageLayout>
  );
};

export default SchoolSelection;
