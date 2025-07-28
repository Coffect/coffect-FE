/**
 * @author : 흥부/강신욱
 * @description : 커뮤니티 게시글 더미 데이터를 생성하는 함수입니다.
 *               주어진 필터에 따라 게시글의 타입과 주제를 설정하고, 랜덤한 날짜와 사용자 정보를 포함합니다.
 */

// src/types/community/index.ts에서 Post와 Filters 타입을 가져옵니다.
import type { Post, Filters } from "../types/community";

export const generateDummyPosts = (filters: Filters): Post[] => {
  const majors = [
    "컴퓨터공학과",
    "소프트웨어학과",
    "정보통신공학과",
    "전자공학과",
  ];
  const nicknames = [
    "김철수",
    "이영희",
    "박민수",
    "최지영",
    "정대현",
    "한아름",
    "강신욱",
    "신짱구",
    "봉미선",
    "맹구",
  ];

  return Array.from({ length: 10 }, (_, i) => {
    const postType =
      filters.type || (i % 2 === 0 ? "아티클 ✍🏻" : "팀원 모집 👬");
    const postTopic =
      filters.topic ||
      (i % 3 === 0 ? "인사이트" : i % 3 === 1 ? "개발" : "디자인");

    const randomDaysAgo = Math.floor(Math.random() * 30); // 0일 ~ 29일 전
    const postedDate = new Date();
    postedDate.setDate(postedDate.getDate() - randomDaysAgo);

    return {
      id: i + 1,
      user: {
        profileImage: `https://randomuser.me/api/portraits/men/${i}.jpg`,
        nickname: nicknames[i % nicknames.length],
        major: majors[i % majors.length],
        studentId: (20 + i).toString(),
      },
      image: `https://picsum.photos/400/300?random=${i + 1}`,
      title: "안녕하세요! 좋은날씨에요",
      content:
        "창밖에는 맑은 하늘과 부드러운 바람이 어우러져 평온한 풍경을 만든다. \n커피 한 잔을 손에 들고 창가에 앉아 있으면, 시간도 잠시 멈춘 듯 느껴진다. \n바쁜 일상에 잠깐 보내는 꿀같은 시간.\n창밖에는 맑은 하늘과 부드러운 바람이 어우러져 평온한 풍경을 만든다. 커피 한 잔을 손에 들고 창가에 앉아 있으면, 시간도 잠시 멈춘 듯 느껴진다. 바쁜 일상에 잠깐 보내는 꿀같은 시간.창밖에는 맑은 하늘과 부드러운 바람이 어우러져 평온한 풍경을 만든다. 커피 한 잔을 손에 들고 창가에 앉아 있으면, 시간도 잠시 멈춘 듯 느껴진다. 바쁜 일상에 잠깐 보내는 꿀같은 시간.",
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 50),
      type: postType,
      topic: postTopic,
      postedDate: postedDate,
      daysAgo: randomDaysAgo,
    };
  });
};
