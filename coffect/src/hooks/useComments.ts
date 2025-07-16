/*
author : 강신욱
description : 댓글 데이터와 관련 로직을 관리하는 커스텀 훅입니다.
*/
import { useState } from "react";
import type { Comment } from "../types/commentTypes";

// 더미 댓글 데이터 생성 함수
const generateDummyComments = (): Comment[] => {
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

  return Array.from({ length: 10 }, (_, i) => {
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
      content: `이것은 ${i + 1}번째 댓글입니다.`, // 더미 댓글 내용
      postedDate: postedDate,
    };
  });
};

/*
comments : 댓글 목록을 관리하는 상태입니다.
newComment : 새로 작성할 댓글 내용을 관리하는 상태입니다.
 */
export const useComments = () => {
  const [comments, setComments] = useState<Comment[]>(generateDummyComments());
  const [newComment, setNewComment] = useState("");

  const handlePostComment = () => {
    if (newComment.trim() === "") return;

    const newCommentData: Comment = {
      id: Date.now(),
      user: {
        name: "현재 사용자", // 임시 값 추가
        avatar: "https://via.placeholder.com/40", // 임시 값 추가
        profileImage: "https://via.placeholder.com/40", // 현재 사용자 프로필 이미지 (임시)
        nickname: "현재 사용자", // 현재 사용자 닉네임 (임시)
        major: "컴퓨터공학과", // 현재 사용자 학과 (임시)
        studentId: "202012345", // 현재 사용자 학번 (임시)
      },
      content: newComment,
      postedDate: new Date(),
    };

    setComments([newCommentData, ...comments]);
    setNewComment("");
  };

  return {
    comments,
    newComment,
    setNewComment,
    handlePostComment,
  };
};

export type { Comment };
