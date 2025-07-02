/*
author : 썬더
description : 이메일 인증 코드 발송 화면
*/

import { useState } from "react";
import { isValidEmail } from "../../utils/validation";

/*
 EmailVerification 컴포넌트가 받을 props 타입을 정의
    onNext   – 다음 단계로 이동
    onChange – 입력한 이메일을 부모에게 전달
*/
type Props = {
  onNext: () => void;
  onChange: (email: string) => void;
};

const EmailVerification = ({ onNext, onChange }: Props) => {
  // 이메일 입력 상태 관리
  const [email, setEmail] = useState("");

  // 인증 코드 발송 및 다음 단계로 이동
  const handleSend = () => {
    onChange(email);
    // sendCode(email) // 서버 api 연결 후 사용 예정
    onNext();
  };

  return (
    <div className="min-h-screen w-full bg-white px-[6%] py-[8%] text-left">
      {/* 타이틀 */}
      <h2 className="mb-[10%] text-[4.5vw] leading-snug font-bold">
        정확한 확인을 위해,
        <br />
        학교 이메일 인증을 할게요!
      </h2>

      {/* 이메일 입력 필드 */}
      <div className="mb-[8%]">
        <label className="mb-[2%] block text-[3.5vw] text-gray-700">
          학교 이메일
        </label>
        <input
          type="email"
          placeholder="ex. abc1203@sookmyung.ac.kr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border border-gray-300 px-[4%] py-[3%] text-[3.5vw]"
        />
      </div>

      {/* 인증코드 발송 버튼 */}
      <button
        onClick={handleSend}
        disabled={!isValidEmail(email)}
        className={`w-full rounded py-[4%] text-[4vw] text-white ${
          isValidEmail(email) ? "bg-black" : "bg-gray-300"
        }`}
      >
        인증코드 발송하기
      </button>
    </div>
  );
};

export default EmailVerification;
