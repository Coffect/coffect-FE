/**
 * @author: 강신욱
 * @description: 게시글 상세 페이지 데이터 로직을 관리하는 커스텀 훅
 *
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

// 게시글 상세 페이지의 데이터를 가져오는 함수
export const usePostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);

  const allPosts = generateDummyPosts({ type: null, topic: null });
  const post = allPosts.find((p) => p.id === postId);

  // postId를 useComments 훅에 전달합니다.
  const { comments: commentList } = useComments(postId);

  const timeAgo = post ? getTimeAgo(post.postedDate) : "";

  return {
    post,
    postId,
    commentList,
    timeAgo,
  };
};
