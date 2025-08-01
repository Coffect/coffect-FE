/*
  author      : 썬더
  description : 커피챗 홈 관련 API 모듈입니다.
                - 추천 카테고리 선택(postTodayInterest)
                - 오늘의 카테고리 조회(getTodayInterest)
                - 현재 추천 카드 가져오기(getCurrentRecommendedCard)

*/

import { axiosInstance } from "./axiosInstance";

/* 오늘의 커피챗 추천 카테고리 선택(1: 거리, 2: 관심사, 3: 학번, 4: 글) */
export const postTodayInterest = async (todayInterest: number) => {
  const { data } = await axiosInstance.post("/home/postTodayInterest", {
    todayInterest,
  });
  return data;
};

/*커피챗 추천 카드 삭제*/
export const DeleteCard = async () => {
  const { data } = await axiosInstance.get("/home/getCardClose");
  return data.success;
};

/* 현재 추천 카테고리 기준의 추천 카드 정보 가져오기 */
export const getCurrentRecommendedCard = async () => {
  const { data } = await axiosInstance.get("/home/currentCardRecommend");
  return data.success;
};
// 커피쳇 제안 보내기
export const postSuggestCoffeeChat = async (
  suggestion: string,
  otherUserid: number,
) => {
  const { data } = await axiosInstance.post("/home/postSuggestCoffeeChat", {
    suggestion,
    otherUserid,
  });
  return data;
};

// 커피챗 일정 가져오기
export const getCoffeeChatSchedule = async () => {
  const { data } = await axiosInstance.get("/home/getCoffeeChatSchedule");
  return data.success;
};
// userid로 id 찾기
export const getUserStringId = async (userId: number) => {
  const res = await axiosInstance.post("/profile/id", { userId });
  return res.data.success.id;
};

// id로 이름찾기
export const getUserNameById = async (userId: string): Promise<string> => {
  const { data } = await axiosInstance.get("/profile/search", {
    params: { id: userId },
  });
  return data.success.userInfo.name;
};
