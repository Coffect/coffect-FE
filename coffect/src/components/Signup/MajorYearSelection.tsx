/*
author : 썬더
description : 전공/학번 입력 화면
*/

import { useState } from "react";
import type { SignupData } from "../../types/signup";

type Props = {
  /** 이전 단계에서 선택된 학교명 */
  school: string;
  /** 다음 단계로 이동 */
  onNext: () => void;
  /** 이전 단계로 이동 */
  onBack: () => void;
  /** 입력된 전공/학번을 부모에게 전달 */
  onChange: (fields: Partial<SignupData>) => void;
};

const MajorYearSelection = ({ school, onNext, onBack, onChange }: Props) => {
  // 전공/학번 입력값 상태
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("");

  // ‘다음’ 클릭 시 부모에 값 전달 후 다음 단계로 이동하는 함수
  const handleNext = () => {
    onChange({ major, year });
    onNext();
  };

  return (
    <div className="min-h-screen w-full bg-white px-[6%] py-[8%] text-left">
      {/* 인사말 */}
      <h2 className="mb-[8%] text-[4.5vw] leading-snug font-bold">
        송이 환영해요!
        <br />
        전공과 학번을 알려주세요!
      </h2>

      {/* 선택된 학교명 (이전 단계에서 입력되어 읽기 전용) */}
      <div className="mb-[6%]">
        <label className="mb-[1.5%] block text-[3.5vw] text-gray-700">
          학교
        </label>
        <input
          type="text"
          value={school}
          disabled
          className="w-full rounded border border-gray-300 bg-gray-100 px-[4%] py-[3%] text-[3.5vw] text-gray-500"
        />
      </div>

      {/* 전공 입력 */}
      <div className="mb-[6%]">
        <label className="mb-[1.5%] block text-[3.5vw] text-gray-700">
          전공
        </label>
        <input
          type="text"
          placeholder="전공을 검색해주세요"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          className="w-full rounded border border-gray-300 px-[4%] py-[3%] text-[3.5vw]"
        />
      </div>

      {/* 학번 입력 */}
      <div className="mb-[10%]">
        <label className="mb-[1.5%] block text-[3.5vw] text-gray-700">
          학번
        </label>
        <input
          type="text"
          placeholder="학번을 입력해주세요"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full rounded border border-gray-300 px-[4%] py-[3%] text-[3.5vw]"
        />
      </div>

      {/* 이전,다음 버튼 */}
      <div className="mt-auto flex justify-between">
        <button
          onClick={onBack}
          className="w-[45%] rounded bg-gray-200 py-[3.5%] text-[3.5vw] text-gray-700"
        >
          이전
        </button>
        <button
          onClick={handleNext}
          disabled={!major.trim() || !year.trim()}
          className={`w-[45%] rounded py-[3.5%] text-[3.5vw] text-white ${
            major.trim() && year.trim() ? "bg-black" : "bg-gray-300"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default MajorYearSelection;
