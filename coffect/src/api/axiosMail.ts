/*
  author      : 썬더
  description : 이메일 인증 서버 전용 Axios 인스턴스
*/

import axios from "axios";

export const axiosMail = axios.create({
  baseURL: import.meta.env.VITE_MAIL_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
