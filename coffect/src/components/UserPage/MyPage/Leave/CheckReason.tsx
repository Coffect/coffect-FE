/*
author : 재하
description : 회원 탈퇴 사유를 선택받는 컴포넌트입니다.
*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CheckReasonProps {
  onNext: () => void;
}

// 탈퇴 사유 목록
const REASONS = [
  "앱 사용 빈도가 낮아져서",
  "이상한 사람들이 많아서",
  "개인정보 노출이 걱정돼서",
  "더 이상 앱의 유용성을 못 느끼겠어서",
  "사용이 불편해서",
];

/*
탈퇴 사유를 체크박스로 선택받는 함수형 컴포넌트입니다.
*/
const CheckReason: React.FC<CheckReasonProps> = ({ onNext }) => {
  const navigate = useNavigate();
  // 체크박스 상태 관리
  const [checked, setChecked] = useState<boolean[]>(
    Array(REASONS.length).fill(false),
  );
  // 기타 의견 상태
  const [feedback, setFeedback] = useState("");

  // 체크박스 클릭 시 상태 토글
  const handleCheck = (idx: number) => {
    setChecked((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-white px-6 py-5">
      {/* 뒤로가기 버튼 */}
      <button className="mb-6 text-3xl" onClick={() => navigate("/mypage")}>
        &#x25C0;
      </button>
      {/* 타이틀 */}
      <div className="mb-6 text-xl font-bold">
        탈퇴하시는 이유를 알려주세요!
      </div>
      {/* 사유 체크박스 목록 */}
      <div className="mb-4 flex flex-col gap-3">
        {REASONS.map((reason, idx) => (
          <label key={reason} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={checked[idx]}
              onChange={() => handleCheck(idx)}
              className="h-5 w-5 border-gray-300"
            />
            <span className="text-base">{reason}</span>
          </label>
        ))}
      </div>
      {/* 기타 의견 입력란 */}
      <div className="mb-2 text-sm">기타 의견을 자유롭게 남겨주세요.</div>
      <textarea
        className="mb-8 h-28 w-full resize-none border border-gray-300 p-2"
        placeholder=""
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      {/* 다음 단계로 이동 버튼 */}
      <button
        className="w-full rounded bg-neutral-800 py-3 font-bold text-white"
        onClick={onNext}
      >
        진짜 탈퇴하기
      </button>
    </div>
  );
};

export default CheckReason;
