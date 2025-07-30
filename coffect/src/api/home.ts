/*
  author      : 썬더
  description : 커피챗 홈 관련 API 모듈입니다.
                - 추천 카테고리 선택(postTodayInterest)
                - 오늘의 카테고리 조회(getTodayInterest)
*/

import { axiosInstance } from "./axiosInstance";

/* 오늘의 커피챗 추천 카테고리 선택(1: 거리, 2: 관심사, 3: 학번, 4: 글) */
export const postTodayInterest = async (todayInterest: number) => {
  const { data } = await axiosInstance.post("/home/postTodayInterest", {
    todayInterest,
  });
  return data;
};

/* 오늘 선택한 커피챗 추천 카테고리 카드 정보 불러오기 (선택한 적 없으면 null) */
export const getCardInfo = async () => {
  const { data } = await axiosInstance.get("/home/getCardClose");
  return data.success;
};
