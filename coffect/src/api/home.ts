/*
  author      : 썬더
  description : 커피챗 홈 관련 API 모듈입니다.
  - postTodayInterest(todayInterest)         : 오늘의 추천 카테고리 선택 (1: 거리, 2: 관심사, 3: 학번, 4: 글)
  - initOrSkipCard ()                        : 추천 카드 첫 생성 및 삭제 (스킵 처리)
  - getCurrentRecommendedCard()              : 현재 추천 카테고리에 해당하는 카드 정보 가져오기
  - postSuggestCoffeeChat(suggestion, id)    : 커피챗 제안 메시지 전송
  - getCoffeeChatSchedule()                  : 사용자의 커피챗 일정 전체 조회
  - getUserStringId(userId)                  : userId (number)로 사용자 string ID 조회
  - getUserNameById(userId)                  : string ID로 사용자 이름 조회
  - postFollowRequest(oppentUserId)          : 상대방 유저에게 팔로우 요청
  - getIsFollow(oppentUserId: number)        : 현재 상대방을 내가 팔로우 중인지 확인
  */
import { axiosInstance } from "./axiosInstance";

/* 오늘의 커피챗 추천 카테고리 선택(1: 거리, 2: 관심사, 3: 학번, 4: 글) */
export const postTodayInterest = async (todayInterest: number) => {
  const { data } = await axiosInstance.post("/home/postTodayInterest", {
    todayInterest,
  });
  return data;
};

/*커피챗 추천 카드 생성 & 삭제*/
export const initOrSkipCard = async () => {
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
// 상대방을 팔로우 요청하는 API
export const postFollowRequest = async (oppentUserId: number) => {
  const { data } = await axiosInstance.post("/follow/followRequest", {
    oppentUserId,
  });
  return data;
};
// 상대방을 내가 팔로우했는지 확인하는 API
export const getIsFollow = async (oppentUserId: number): Promise<boolean> => {
  const { data } = await axiosInstance.get("/follow/isFollow", {
    params: { oppentUserId },
  });
  return data.success;
};

// id로 전공(dept)만 가져오기
export const getUserDeptById = async (id: string): Promise<string> => {
  const { data } = await axiosInstance.get("/profile/search", {
    params: { id },
  });
  return data.success.userInfo.dept;
};

// 'id' (string 아이디)로 Q&A 정보(specifyProfile.info)만 가져오기
export const getUserQnAById = async (
  id: string,
): Promise<{ question: string; answer: string }[]> => {
  const { data } = await axiosInstance.get("/profile/search", {
    params: { id },
  });

  return data.success.specifyProfile.info;
};
