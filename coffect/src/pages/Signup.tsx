/*
author : 썬더
description : 회원가입 플로우 전체를 제어하는 페이지입니다.
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SignupData } from "../types/signup";
import SplashScreen from "../components/Signup/SplashScreen";
import LoginChoice from "../components/Signup/LoginChoice";
import TermsAgreement from "../components/Signup/TermsAgreement";
import SchoolSelection from "../components/Signup/SchoolSelection";
import MajorYearSelection from "../components/Signup/MajorYearSelection";
import EmailVerification from "../components/Signup/EmailVerification";
import CodeInput from "../components/Signup/CodeInput";
import AccountSetup from "../components/Signup/AccountSetup";
import InterestsSelection from "../components/Signup/InterestsSelection";
import Completion from "../components/Signup/Completion";

const Signup = () => {
  const navigate = useNavigate();
  // 현재 단계 상태 (1~10)
  const [step, setStep] = useState<number>(1);
  // 회원가입 중 입력된 데이터 누적 저장
  const [form, setForm] = useState<Partial<SignupData>>({});

  // 다음 단계로 이동
  const goNext = () => setStep((prev) => prev + 1);
  // 이전 단계로 이동
  const goBack = () => setStep((prev) => prev - 1);
  // form 상태 업데이트 (부분적 필드 병합)
  const update = (fields: Partial<SignupData>) =>
    setForm((prev) => ({ ...prev, ...fields }));

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {/* 1. 시작 화면 */}
      {step === 1 && <SplashScreen onNext={goNext} />}

      {/* 2. 회원가입/로그인 선택 화면 */}
      {step === 2 && (
        <LoginChoice onSignUp={goNext} onLogin={() => navigate("/login")} />
      )}

      {/* 3. 약관 동의 화면 */}
      {step === 3 && <TermsAgreement onNext={goNext} />}

      {/* 4. 학교 선택 화면 */}
      {step === 4 && (
        <SchoolSelection
          onNext={goNext}
          onChange={(school) => update({ school })}
        />
      )}

      {/* 5. 전공/학번 입력 화면 */}
      {step === 5 && (
        <MajorYearSelection
          school={form.school!}
          onNext={goNext}
          onBack={goBack}
          onChange={(fields) => update(fields)}
        />
      )}

      {/* 6. 이메일 인증 화면 */}
      {step === 6 && (
        <EmailVerification
          onNext={goNext}
          onChange={(email) => update({ email })}
        />
      )}

      {/* 7. 이메일 인증 코드 입력 화면 */}
      {step === 7 && (
        <CodeInput
          onNext={goNext}
          onBack={goBack}
          onChange={(code) => update({ authCode: code })}
        />
      )}

      {/* 8. 계정 정보 설정(아이디/비밀번호) 화면 */}
      {step === 8 && (
        <AccountSetup
          onNext={goNext}
          onBack={goBack}
          onChange={(fields) => update(fields)}
        />
      )}

      {/* 9. 관심사 선택 화면 */}
      {step === 9 && (
        <InterestsSelection
          onNext={goNext}
          onChange={(list) => update({ interests: list })}
        />
      )}

      {/* 10. 가입 완료 화면 */}
      {step === 10 && <Completion />}
    </div>
  );
};

export default Signup;
