/*
author      : 썬더
description : 로그인 및 로그아웃 처리
              - login: 로그인 요청 → 토큰 저장
              - logout: 토큰 제거 후 로그인(/)으로 이동
*/

import { axiosInstance } from "./axiosInstance"; // 설정된 Axios 인스턴스 import
import { LOCAL_STORAGE_KEY } from "../constants/key"; // 토큰 저장용 localStorage 키 상수 import
import type { AxiosError } from "axios"; // Axios 에러 타입 import

// 로그인 요청 시 필요한 파라미터 타입 정의
type LoginRequest = {
  userId: string; // 사용자 ID
  userPassword: string; // 사용자 비밀번호
};

// 로그인 요청 함수 정의
export const login = async (payload: LoginRequest) => {
  try {
    // POST 요청으로 로그인 API 호출
    const res = await axiosInstance.post("/user/login", payload);

    // 응답에서 accessToken(aToken)과 refreshToken(rToken) 추출
    const { aToken, rToken } = res.data.success;

    // 로컬스토리지에 각각 저장
    localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, aToken);
    localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, rToken);

    // 로그인 성공을 의미하는 true 반환
    return true;
  } catch (err: unknown) {
    // 에러가 발생한 경우 AxiosError로 타입 단언
    const axiosError = err as AxiosError;

    // 서버로부터 받은 에러 메시지
    const errorData = axiosError.response?.data as {
      error?: { reason?: string };
    };

    // 에러 메시지 결정 (우선순위 순)
    const reason =
      errorData?.error?.reason ?? "로그인 중 알 수 없는 오류가 발생했습니다."; // 서버에서 내려준 에러 사유 // fallback 기본 메시지

    // 에러 메시지 리턴
    return reason;
  }
};
// 로그아웃 함수: 토큰 삭제 후 로그인 페이지로 이동
export const logout = () => {
  // 토큰 모두 제거
  localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
  localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);

  // 로그인 페이지로 이동
  window.location.href = "/";
};

// 아이디 중복 체크 요청 함수
export const checkDuplicateId = async (id: string): Promise<boolean> => {
  try {
    await axiosInstance.post("/user/idcheck", { id });
    // 200: 중복 아님
    return false;
  } catch (err: unknown) {
    const axiosError = err as AxiosError;

    if (axiosError.response?.status === 409) {
      // 409: 중복임
      return true;
    }

    // 그 외 서버 오류 메시지 확인
    const reason = "아이디 중복 확인 중 알 수 없는 오류가 발생했습니다.";
    alert(reason);
    throw new Error(reason);
  }
};
