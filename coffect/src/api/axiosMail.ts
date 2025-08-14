/*
  author      : 썬더
  description : 이메일 인증 서버 전용 Axios 인스턴스
*/

import axios from "axios";

const getMailBaseURL = () => {
  // 배포 환경에서는 상대 경로(`/api`)로 고정 → vercel.json의 rewrites 사용
  if (import.meta.env.PROD) {
    return "/api";
  }
  // 개발 환경에서는 환경변수 우선, 없으면 프록시 경유(`/api`)
  return import.meta.env.VITE_MAIL_API_URL || "/api";
};

export const axiosMail = axios.create({
  baseURL: getMailBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});
