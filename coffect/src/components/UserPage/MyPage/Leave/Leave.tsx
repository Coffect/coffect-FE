/*
author : 재하
description : 회원 탈퇴 프로세스(이유 선택, 비밀번호 확인)를 관리하는 컴포넌트입니다.
*/

import { useState } from "react";
import CheckReason from "./CheckReason";
import LastConfirm from "./LastConfirm";

/*
탈퇴 사유 선택 및 최종 확인 단계를 관리하는 함수형 컴포넌트입니다.
*/
const Leave = () => {
  // 현재 단계 상태 관리: reason(이유 선택) | confirm(비밀번호 확인)
  const [step, setStep] = useState<"reason" | "confirm">("reason");

  return (
    <>
      {/* 탈퇴 사유 선택 단계 */}
      {step === "reason" && <CheckReason onNext={() => setStep("confirm")} />}
      {/* 비밀번호 확인 단계 */}
      {step === "confirm" && <LastConfirm onBack={() => setStep("reason")} />}
    </>
  );
};

export default Leave;
