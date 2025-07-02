/*
author : 썬더
description : 이메일 인증 코드 입력 화면 (5자리)
*/

import React, { useState, useRef, useEffect } from "react";
import { isFiveDigitCode } from "../../utils/validation"; // 공통 유틸 함수

/*
 * CodeInput 컴포넌트가 받을 props 타입을 정의합니다.
 * onNext   – 5자리 코드 입력 완료 후 다음 단계로 이동
 * onBack   – 이전 단계로 이동
 * onChange – 완성된 5자리 코드를 부모에게 전달할 콜백
 * ******위에 이 인증번호는 이 단계에서 api에서 보내준 정보랑 일치 여부 확인가능한지 확인해보고 수정예정****
 */
type Props = {
  onNext: () => void;
  onBack: () => void;
  onChange: (code: string) => void;
};

const CodeInput = ({ onNext, onChange }: Props) => {
  // 입력된 각 자리 숫자를 배열로 관리
  const [code, setCode] = useState<string[]>(["", "", "", "", ""]);
  // 각 <input> 요소에 포커스 제어를 위한 ref 배열
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // 코드가 완성되었는지 확인하는 유틸 활용
  // code.join("") 으로 연결된 형태의 숫자문자열 만들고, isFiveDigitCode 로 검사
  const isComplete = isFiveDigitCode(code.join(""));

  // 화면 로드 시 첫 번째 칸에 자동 포커스
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  /*
   * 각 자리 입력 변경 핸들러
   *  index – 변경된 input 인덱스
   *  value – 새로 입력된 값 (숫자 1자리)
   */
  const handleChange = (index: number, value: string) => {
    // 숫자 한 자리만 허용
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // 입력이 완료되면 다음 칸으로 포커스 이동
    if (value && index < code.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Backspace 키 처리: 빈 칸에서 지우기 시 이전 칸으로 포커스 이동
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  /************이 부분도 위의 부분에서 이전 단계 api 요청 번호를 여기로 불러올 수 있는거 확인되면 수정예정****/
  //인증 코드 완료 시 code 배열을 한 문자열로 합쳐 부모에게 전달 후 다음 단계 호출
  const handleNext = () => {
    const joined = code.join("");
    onChange(joined);
    onNext();
  };

  return (
    <div className="min-h-screen bg-white px-[6%] py-[8%] text-left">
      {/* 안내 문구 */}
      <h2 className="mb-[4%] text-[4.5vw] leading-snug font-bold">
        이메일로 받은 인증코드를 입력해주세요!
      </h2>
      <p className="mb-[8%] text-[3.5vw] text-gray-500">
        혹시 받지 못했다면 스팸함을 확인해주세요.
      </p>

      {/* 5칸짜리 인증번호 입력 필드 */}
      <div className="mb-[4%] flex justify-between gap-[3%]">
        {code.map((digit, i) => (
          <input
            key={i}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            placeholder="-"
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            className="aspect-square w-[20%] rounded border border-gray-300 text-center text-[5vw]"
          />
        ))}
      </div>

      {/* 재발송 버튼 (이 부분은 api 구현 시 연결) */}
      <div className="mb-[10%] w-full text-right">
        <button className="text-[3.5vw] text-gray-500 underline">
          인증코드 재발송
        </button>
      </div>

      {/* 인증 완료 버튼 */}
      <button
        onClick={handleNext}
        disabled={!isComplete}
        className={`w-full rounded py-[4%] text-[4vw] text-white ${
          isComplete ? "bg-black" : "bg-gray-300"
        }`}
      >
        인증 완료하기
      </button>
    </div>
  );
};

export default CodeInput;
