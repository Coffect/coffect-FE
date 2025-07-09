/*
author : 강신욱
description : 게시글 상세 페이지의 데이터 로직을 관리하는 커스텀 훅입니다.
              URL에서 게시글 ID를 가져와 올바른 게시글 데이터를 찾고, 
              해당 게시글의 댓글 목록을 불러오는 등 모든 데이터 관련 로직을 처리합니다.
*/
import { useParams } from "react-router-dom";
import { generateDummyPosts } from "../data/communityDummyData";
import { useComments } from "./useComments";

// 날짜를 'X일 전' 형식으로 변환하는 함수
const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "오늘";
  if (diffDays === 1) return "어제";
  return `${diffDays}일 전`;
};

export const usePostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);

  // Find the specific post from the dummy data
  const allPosts = generateDummyPosts({ type: null, topic: null });
  const post = allPosts.find((p) => p.id === postId);

  // Get comments using the existing useComments hook
  const { comments: commentList } = useComments();

  const timeAgo = post ? getTimeAgo(post.postedDate) : "";

  return {
    post,
    postId,
    commentList,
    timeAgo,
  };
};
