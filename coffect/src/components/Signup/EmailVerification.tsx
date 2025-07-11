/*
author : 썬더
description : 이메일 인증 코드 발송 화면
*/

import { useState } from "react";
import { isValidEmail } from "../../utils/validation";

type Props = {
  onNext: () => void; // 다음 단계로 이동
  onChange: (email: string) => void; // 입력한 이메일을 부모로 전달
};

const EmailVerification: React.FC<Props> = ({ onNext, onChange }) => {
  // 이메일 입력값 상태 관리
  const [email, setEmail] = useState<string>("");

  // 입력된 이메일이 유효한지 여부 판단
  const valid = isValidEmail(email);

  // 인증 코드 발송 및 다음 단계로 이동하는 핸들러
  const handleSend = (): void => {
    onChange(email); // 부모 컴포넌트에 이메일 전달
    // sendCode(email) // 서버 API 연결 후 사용 예정
    onNext(); // 다음 화면으로 이동
  };

  return (
    <div className="flex h-full w-full flex-col bg-white px-[6%] py-[2%]">
      <div className="pt-[10%]">
        {/* 타이틀 */}
        <h2 className="mb-6 self-start text-left text-lg leading-snug font-bold">
          <span className="text-xl">📬</span>정확한 확인을 위해
          <br />
          학교 이메일 인증을 할게요!
        </h2>
        {/* 이메일 입력 필드 */}
        <div className="mt-[10%]">
          <label className="mb-2 block text-[1rem] font-semibold text-gray-700">
            학교 이메일
          </label>
          <input
            type="email"
            placeholder="abc1203@sookmyung.ac.kr"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // 이메일 업데이트
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[2px] focus:border-gray-900 focus:ring-0 focus:outline-none"
          />
        </div>
        {/* 인증코드 발송 버튼 */}
        <div className="absolute bottom-[4%] left-0 w-full px-[6%]">
          <button
            onClick={handleSend}
            disabled={!valid}
            className={`w-full rounded-xl py-[4%] text-center text-sm text-gray-700 ${
              valid ? "bg-black text-white" : "bg-[#E4E4E4] text-black"
            }`}
          >
            인증코드 발송하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
