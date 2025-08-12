/**
 * @author: 강신욱
 * @description: 댓글 관련 API 함수
 * @version: 1.0.0
 */
import type { Comment } from "../types/commentTypes";

// 더미 댓글 데이터 생성 함수
const generateDummyComments = (count: number): Comment[] => {
  const majors = ["컴퓨터공학과", "영문학과", "정보통신공학과", "전자공학과"];
  const nicknames = [
    "김철수",
    "이영희",
    "박민수",
    "최지영",
    "정대현",
    "한아름",
    "신짱구",
    "봉미선",
    "맹구",
  ];

  return Array.from({ length: count }, (_, i) => {
    const randomDaysAgo = Math.floor(Math.random() * 30); // 0일 ~ 29일 전
    const postedDate = new Date();
    postedDate.setDate(postedDate.getDate() - randomDaysAgo);

    return {
      id: i + 1,
      user: {
        profileImage: `https://randomuser.me/api/portraits/women/${i}.jpg`,
        nickname: nicknames[i % nicknames.length],
        major: majors[i % majors.length],
        studentId: `20${10 + i}12345`,
      },
      content: `이것은 ${i + 1}번째 댓글입니다.`,
      postedDate: postedDate,
    };
  });
};

/**
 * @description 특정 게시글의 댓글 목록을 가져오는 API 함수 (현재는 더미 데이터 사용)
 * @param postId - 댓글을 가져올 게시글의 ID
 * @returns 댓글 목록 Promise
 */
export const getComments = async (postId: number): Promise<Comment[]> => {
  console.log(`Fetching comments for post ${postId}...`);
  // 실제 API 호출 로직으로 대체될 부분
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateDummyComments(10));
    }, 500);
  });
};

/**
 * @description 새로운 댓글을 추가하는 API 함수
 * @param postId - 댓글을 추가할 게시글의 ID
 * @param content - 댓글 내용
 * @returns 새로 추가된 댓글 Promise
 */
export const addComment = async (
  postId: number,
  content: string,
): Promise<Comment> => {
  console.log(`Adding comment "${content}" to post ${postId}...`);
  // 실제 API 호출 로직으로 대체될 부분
  const newComment: Comment = {
    id: Date.now(),
    user: {
      profileImage: "https://via.placeholder.com/40",
      nickname: "현재 사용자",
      major: "컴퓨터공학과",
      studentId: "202012345",
    },
    content,
    postedDate: new Date(),
  };
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(newComment);
    }, 300);
  });
};
