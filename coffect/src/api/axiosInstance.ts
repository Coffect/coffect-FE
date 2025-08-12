/*
author      : 썬더
description : Axios 인스턴스를 정의하고, 인증 토큰 처리 및 자동 갱신(Refresh Token) 로직을 설정한 파일입니다.
              - 요청 시 accessToken 자동 추가
              - 응답 시 401 에러에 대한 Refresh 토큰 재발급 처리

동작 흐름:

1. 요청 시 accessToken이 존재하면 Authorization 헤더에 자동 추가됨
2. 서버에서 응답이 401(Unauthorized)인 경우 다음 두 가지 분기 발생:
    2-1. accessToken이 만료된 경우
        - localStorage에 저장된 refreshToken을 사용해 /user/refresh API 호출
        - 새로운 accessToken, refreshToken을 받아 다시 저장
        - 실패 시: localStorage 정리 후 로그인 페이지로 이동
    2-2. 서버에서 401이지만 refreshToken 없거나 재시도한 경우: 바로 실패 처리
3. 위 과정을 통해 사용자는 만료된 accessToken을 자동으로 갱신받으며,
   페이지 새로고침 없이 seamless하게 API 요청이 이어짐
*/

import axios from "axios";
import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

// 환경에 따른 baseURL 설정
const getBaseURL = () => {
  // 개발 환경에서는 직접 API 서버 환경변수로 등록해서 사용
  if (import.meta.env.VITE_SERVER_API_URL) {
    return import.meta.env.VITE_SERVER_API_URL;
  }

  // vercel에서 mixed content 방지를 위해 빈 문자열 반환
  // vercel.json을 통해 path 설정
  return "/api";
};

// Axios 인스턴스 생성
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
});

// 요청 시 accessToken이 있다면 Authorization 헤더에 추가
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
  if (token) {
    config.headers = config.headers || {};
<<<<<<< HEAD
=======
    // config.headers.Authorization = `Bearer ${token}`;
>>>>>>> 552b968a2bb03d7cc903cac53139a56fd74252fb
    config.headers.Authorization = `${token}`;
  }
  return config;
});

// 중복 refresh 요청 방지를 위한 전역 Promise
let refreshPromise: Promise<string> | null = null;

// 401 에러일 경우 토큰 재발급 처리
axiosInstance.interceptors.response.use(
  (response) => response, // 정상 응답은 그대로 반환

  async (error: AxiosError) => {
    // 요청 시도한거 저장(무한 요청 방지)
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);

    /*
        다음의 조건에서 토큰 재발급 시도
        - 서버 응답이 401 (Unauthorized)
        - 아직 재시도하지 않음 
        - refreshToken이 localStorage에 존재함
    */
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      refreshToken
    ) {
      originalRequest._retry = true;

      // 이미 다른 요청이 refresh 중이라면 기존 Promise 재사용(토큰 만료로 동시에 여러 api가 refresh 토큰을 요청할 때 꼬임 방지)
      if (!refreshPromise) {
        //동시에 여러 요청일 때 한번만 발급되고 나머진 이걸 재사용
        refreshPromise = axiosInstance
          .get("/user/refresh", {
            headers: {
              Authorization: `${refreshToken}`,
            },
          })
          .then((res) => {
            const newAccessToken = res.data.accessToken;
            const newRefreshToken = res.data.refreshToken;

            // 새 토큰 저장
            localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, newAccessToken);
            localStorage.setItem(
              LOCAL_STORAGE_KEY.refreshToken,
              newRefreshToken,
            );

            return newAccessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      // 새로 받은 토큰으로 원래 api 요청 재실행
      try {
        const newToken = await refreshPromise;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `${newToken}`;
        return axiosInstance(originalRequest); // 재요청
      } catch (refreshError) {
        // 토큰 재발급 실패 시 → 로컬스토리지 정리 후 홈으로 이동
        localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
        localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    // 그 외 에러는 그대로 throw
    return Promise.reject(error);
  },
);
