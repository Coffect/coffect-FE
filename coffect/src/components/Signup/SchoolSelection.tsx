/*
author : 썬더
description : 학교 선택 화면 (드롭다운 선택 시 바로 다음 단계로 이동)
*/

import React, { useState } from "react";

/*
  SchoolSelection 컴포넌트가 받을 props 타입을 정의합니다.
    onNext   – 다음 단계로 이동
    onChange – 선택한 학교명을 부모에게 전달
*/
type Props = {
  onNext: () => void;
  onChange: (school: string) => void;
};

const SchoolSelection = ({ onNext, onChange }: Props) => {
  // 드롭다운 위한 학교 예시 목록 -> 실제 데이터로 교체 예정
  const schools = ["인하대학교", "홍익대학교", "상명대학교", "숙명여자대학교"];

  // 현재 드롭다운 선택값
  const [selected, setSelected] = useState("");

  // 드롭다운에서 학교 선택 시 호출:
  // 1) 선택값 상태 업데이트
  // 2) 부모에게 onChange로 전달
  // 3) 즉시 다음 단계로 이동
  const handleChange = (value: string) => {
    setSelected(value);
    onChange(value);
    onNext();
  };

  return (
    <div className="min-h-screen w-full bg-white px-[6%] py-[8%] text-left">
      {/* 인삿말 */}
      <h2 className="mb-[6%] text-[4.5vw] leading-snug font-bold">
        반가워요!
        <br />
        어느 학교 학생이신가요?
      </h2>

      {/* 드롭다운 (학교 선택) */}
      <select
        value={selected}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-[4%] py-[3%] text-[3.5vw]"
      >
        <option value="" disabled>
          학교를 선택해주세요
        </option>
        {schools.map((school) => (
          <option key={school} value={school}>
            {school}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SchoolSelection;
