/*
author : 썬더
description : 이메일 인증 코드 입력 화면 (5자리)
*/

import React, { useState, useRef, useEffect } from "react";
import { isFiveDigitCode } from "../../utils/validation"; // 공통 유틸 함수
import SignupPageLayout from "./shared/SignupLayout";
import type { SignupData, StepProps } from "../../types/signup";
import { sendMailCode, verifyEmailCode } from "@/api/univ";

//학교 이름 입력으로 넣어주기 위해 추가
interface Props extends StepProps {
  form: Partial<SignupData>;
}

const CodeInput: React.FC<Props> = ({ onNext, onBack, form }) => {
  // 입력받은 사용자 이메일
  const email = form.email ?? "";
  // 입력받은 사용자 학교 이름
  const schoolName = form.selectedSchoolName ?? "";
  // 입력된 각 자리 숫자를 배열로 관리
  const [code, setCode] = useState<string[]>(["", "", "", "", ""]);
  // 각 input 요소에 포커스 제어를 위한 ref 배열
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  // 연결했을 때 문자열이 5자리 숫자인지 확인
  const isComplete = isFiveDigitCode(code.join(""));

  useEffect(() => {
    //인증 메일이 이미 발송된 경우 중복 전송 방지
    const hasSent = sessionStorage.getItem("mailSent");
    if (!hasSent) {
      //인증 메일 전송
      const send = async () => {
        try {
          sendMailCode(email, schoolName);
          sessionStorage.setItem("mailSent", "true");
        } catch {
          alert(
            "메일 발송에 실패했습니다. 이메일 주소를 확인하고 다시 시도해주세요.",
          );
        }
      };
      send();
    }
  }, [email, schoolName]);

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
  const handleNext = async () => {
    const joined = code.join("");
    try {
      const res = await verifyEmailCode(email, Number(joined)); // 인증 코드 검증 서버 응답 확인
      if (res?.resultType === "SUCCESS") {
        onNext();
      } else {
        const errorMsg = res?.error?.reason || "인증에 실패했습니다.";
        alert(errorMsg);
      }
    } catch {
      alert("인증 요청 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
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
    <SignupPageLayout
      bottomButton={
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
      }
    >
      <div className="pt-[10%] text-[var(--gray-90)]">
        {/* 안내 문구 */}
        <h2 className="mb-[3%] self-start text-left text-[22px] leading-snug font-bold">
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

        {/* 인증코드 재입력 버튼 */}
        <div className="mb-6 w-full text-center">
          <button
            onClick={onBack}
            className="text-base text-[var(--gray-70)] underline"
          >
            이메일 다시 적기
          </button>
        </div>
      </div>

      {/* 하단 여백 확보 */}
      <div className="h-[100px]" />
    </SignupPageLayout>
  );
};

export default CodeInput;
