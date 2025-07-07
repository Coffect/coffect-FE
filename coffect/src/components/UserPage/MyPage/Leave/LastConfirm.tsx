/*
author : 재하
description : 회원 탈퇴 전 비밀번호를 확인하는 컴포넌트입니다.
*/

import React, { useState } from "react";

interface LastConfirmProps {
  onBack: () => void;
}

/*
비밀번호 입력을 통해 탈퇴를 최종 확인하는 함수형 컴포넌트입니다.
*/
const LastConfirm: React.FC<LastConfirmProps> = ({ onBack }) => {
  // 비밀번호 입력 상태
  const [password, setPassword] = useState("");

  return (
    <div className="h-full w-full overflow-y-auto bg-white px-6 py-5">
      {/* 뒤로가기 버튼 */}
      <button className="mb-6 text-3xl" onClick={onBack}>
        &#x25C0;
      </button>
      {/* 안내 메시지 */}
      <div className="mb-6 text-xl font-bold">
        탈퇴 전, 본인 인증을 위해
        <br />
        현재 비밀번호를 입력해주세요.
      </div>
      {/* 비밀번호 입력란 */}
      <div className="mb-2 font-semibold">비밀번호</div>
      <input
        type="password"
        className="mb-8 w-full border border-gray-300 p-3"
        placeholder="비밀번호를 입력해주세요."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {/* 탈퇴 버튼 */}
      <button
        className="w-full rounded bg-neutral-800 py-3 font-bold text-red-400"
        // 실제 탈퇴 로직은 여기에 연결
      >
        회원 탈퇴하기
      </button>
    </div>
  );
};

export default LastConfirm;
