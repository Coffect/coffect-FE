/*
author : 썬더
description : 이메일 인증 코드 입력 화면 (5자리)
*/

import React, { useState, useRef, useEffect } from "react";
import { isFiveDigitCode } from "../../utils/validation"; // 공통 유틸 함수

type Props = {
  onNext: () => void; // 5자리 코드 입력 완료 후 다음 단계로 이동
  onBack: () => void; // 이전 단계로 이동
  onChange: (code: string) => void; // 완성된 5자리 코드를 부모에게 전달
};

const CodeInput: React.FC<Props> = ({ onNext, onBack, onChange }) => {
  // 입력된 각 자리 숫자를 배열로 관리
  const [code, setCode] = useState<string[]>(["", "", "", "", ""]);
  // 각 input 요소에 포커스 제어를 위한 ref 배열
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  // 연결했을 때 문자열이 5자리 숫자인지 확인
  const isComplete = isFiveDigitCode(code.join(""));

  // 첫 번째 칸 자동 포커스
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // 자리별 입력 처리
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // 숫자 1자리만 허용
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < code.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Backspace 처리: 빈 칸에서 이전 칸으로 이동
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // 완료 시 부모 콜백 및 다음 단계
  const handleNext = () => {
    const joined = code.join("");
    onChange(joined);
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

  return (
    <div className="relative h-screen w-full bg-white">
      <div className="h-full overflow-y-auto px-[6%] pb-[120px]">
        {" "}
        <div className="pt-[10%] text-[var(--gray-90)]">
          {/* 안내 문구 */}
          <h2 className="mb-[3%] self-start text-left text-2xl leading-snug font-bold">
            이메일로 받은 인증코드를
            <br /> 입력해주세요!
          </h2>
          <p className="mb-16 text-base text-[var(--gray-40)]">
            받지 못했다면 스팸함을 확인해주세요
          </p>
          {/* 5칸 입력 필드 */}
          <div className="mb-6 flex justify-between gap-3">
            {code.map((digit, i) => (
              <input
                key={i}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                placeholder="–"
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                className="aspect-square w-[18%] rounded border border-[var(--gray-30)] text-center text-xl text-[var(--gray-90)] placeholder-[var(--gray-30)] focus:border-[2px] focus:border-gray-900 focus:ring-0 focus:outline-none"
              />
            ))}
          </div>
          {/* 인증코드 재발송 버튼 */}
          <div className="mb-6 w-full text-center">
            <button
              onClick={onBack}
              className="text-base text-[var(--gray-70)] underline"
            >
              인증코드 재발송하기
            </button>
          </div>
        </div>
        {/* 인증 완료 버튼 */}
        <div className="flex w-full pt-92">
          <button
            onClick={handleNext}
            disabled={!isComplete}
            className={`w-full rounded-xl py-[4%] text-center text-lg font-semibold ${
              isComplete
                ? "bg-[var(--gray-80)] text-[var(--gray-0)]"
                : "bg-[var(--gray-10)] text-[var(--gray-50)]"
            } `}
          >
            인증 완료하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeInput;
