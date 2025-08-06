/*
author : 썬더
description : 회원가입 플로우 전체를 제어하는 페이지입니다.
*/

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { SignupData } from "../types/signup";
import SplashScreen from "../components/Signup/SplashScreen";
import LoginChoice from "../components/Signup/LoginChoice";
import TermsAgreement from "../components/Signup/TermsAgreement";
import SchoolSelection from "../components/Signup/SchoolSelection";
import EmailVerification from "../components/Signup/EmailVerification";
import CodeInput from "../components/Signup/CodeInput";
import AccountSetup from "../components/Signup/AccountSetup";
import ProfileSetup from "../components/Signup/ProfileSetup";
import InterestsSelection from "../components/Signup/InterestsSelection";
import Completion from "../components/Signup/Completion";
import TopNavbar from "../components/Signup/TopNavbar";
import { login } from "../api/auth";
import { signUpRequest } from "@/api/univ";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 타 라우팅에서 이 페이지로 올 때 이전 step 단계로 올 수 있도록 저장
  const initialStep = location.state?.step ?? 1;
  // 현재 단계 페이지
  const [step, setStep] = useState<number>(initialStep);
  // 회원가입 중 입력된 데이터 누적 저장
  const [form, setForm] = useState<Partial<SignupData>>({});

  /* 다음 단계로 이동 */
  const goNext = () => setStep((prev) => prev + 1);
  /* 이전 단계로 이동 */
  const goBack = () => setStep((prev) => prev - 1);
  /* 동기화 이후 동작하도록 update 수정 */
  const update = (fields: Partial<SignupData>) => {
    setForm((prev) => ({ ...prev, ...fields }));
  };

  /*TopNavBar에 들어갈 제목 내용*/
  const stepTitles: Record<number, string> = {
    2: "로그인",
    3: "",
    4: "학교 선택",
    5: "이메일 인증",
    6: "이메일 인증코드",
    7: "계정 정보 설정",
    8: "프로필 설정",
    9: "관심사 설정",
  };

  // 첫 방문자일 경우 시작페이지 -> 온보딩으로 이동
  const firstgoNext = () => {
    const seen = localStorage.getItem("seenOnboarding");

    if (!seen) {
      // 온보딩을 보지 않은 사용자면 온보딩부터 시작
      navigate("/onboarding");
    } else {
      // 이미 온보딩을 본 사용자면 다음 단계(로그인)로 이동
      navigate("/signup", { state: { step: 2 } });
      window.location.reload();
    }
  };

  // 회원가입 요청 함수
  const signup = async (data: SignupData) => {
    try {
      const result = await signUpRequest({
        id: data.id!,
        password: data.password!,
        name: data.name!,
        email: data.email!,
        univId: data.univId!,
        dept: data.dept!,
        studentId: data.studentId!,
        interest: data.interest!,
        img: data.img!,
      });
      //회원 가입 성공 시 회원 가입 완료 페이지 이동
      if (result.resultType === "SUCCESS") {
        setStep(10);
      } else {
        alert("회원가입 실패: " + (result.error?.reason || "알 수 없는 오류"));
      }
    } catch {
      alert("서버 오류가 발생했어요.");
    }
  };

  // step -> progress 단계 변환 (Top바 아래부분 진행바 표시)
  const getProgressStep = (step: number): number => {
    if (step === 4) return 1;
    if (step === 5 || step === 6) return 2;
    if (step === 7) return 3;
    if (step === 8) return 4;
    return 5;
  };

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* step 2~10까지는 이전 버튼표시, 4~9에서는 Progress 바도 같이 표시 */}
      {step >= 2 && step <= 10 && (
        <TopNavbar
          title={stepTitles[step]}
          onBack={goBack}
          showProgress={step >= 4 && step <= 9}
          step={getProgressStep(step)}
          totalSteps={5}
        />
      )}
      <div className="flex flex-1 flex-col items-center justify-center">
        {/* 1. 시작 화면 */}
        {step === 1 && <SplashScreen onNext={firstgoNext} />}
        {/* 2. 회원가입/로그인 선택 화면 */}
        {step === 2 && (
          <LoginChoice
            onSignUp={goNext}
            onLogin={async (userId, password) => {
              // login API 호출 → 로그인 성공 여부 반환
              const success = await login({ userId, userPassword: password });
              // 로그인 성공 시 홈 화면으로 이동
              if (success === true) {
                navigate("/home");
              }
              //실패 시 에러 메시지 리턴
              else return success;
            }}
          />
        )}
        {/* 3. 약관 동의 화면 */}
        {step === 3 && <TermsAgreement onNext={goNext} />}
        {/* 4. 학교 선택 + 전공/학번 입력 화면 */}
        {step === 4 && (
          <SchoolSelection
            onNext={goNext}
            onUpdate={(fields) => update(fields)}
          />
        )}
        {/* 5. 이메일 인증 화면 */}
        {step === 5 && (
          <EmailVerification
            onNext={goNext}
            onUpdate={(fields) => update(fields)}
          />
        )}
        {/* 6. 이메일 인증 코드 입력 화면 */}
        {step === 6 && (
          <CodeInput onNext={goNext} onBack={goBack} form={form} />
        )}
        {/* 7. 계정 정보 설정 화면 */}
        {step === 7 && (
          <AccountSetup onNext={goNext} onUpdate={(fields) => update(fields)} />
        )}
        {/* 8. 프로필 설정 화면 */}
        {step === 8 && (
          <ProfileSetup onNext={goNext} onUpdate={(fields) => update(fields)} />
        )}
        {/* 9. 관심사 선택 화면 */}
        {step === 9 && (
          <InterestsSelection
            onNext={(fields) => {
              // form 상태에 interest를 병합 후 회원가입
              const updated = { ...form, ...fields } as SignupData;
              setForm(updated);

              signup(updated);
            }}
          />
        )}
        {/* 10. 가입 완료 화면 */}
        {step === 10 && <Completion />}
      </div>
    </div>
  );
};

export default Signup;
