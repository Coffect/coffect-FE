/**
 * @author: 강신욱
 * @description: 게시글 상세 페이지 데이터 로직을 관리하는 커스텀 훅
 *               react-query를 사용하여 게시글 상세 정보를 비동기적으로 가져옵니다.
 * @version: 1.0.0
 * @date: 2025-08-01
 * @remarks
 * - 게시글 ID를 URL 파라미터에서 가져와 API 호출에 사용합니다.
 * - 게시글 상세 정보와 댓글 목록을 가져오며, 작성 시간은 'X일 전' 형식으로 변환합니다.
 * - 에러 처리 및 로딩 상태를 관리합니다.
 */

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPostDetail } from "@/api/community/postApi";
import { getTimeAgo } from "@/utils/dateUtils";
import { useComments } from "./useComments";
import type { Post } from "@/types/community/postTypes";

export const usePostDetail = () => {
  const { id } = useParams<{ id: string }>(); // URL 파라미터에서 게시글 ID를 가져옵니다.
  const postId = id;

  // postId가 유효한지 확인합니다.
  const isPostIdValid = typeof postId === "string" && postId.length > 0;

  // react-query를 사용하여 게시글 상세 정보를 가져옵니다.
  const { data, isLoading, error } = useQuery<Post, Error>({
    queryKey: ["postDetail", postId],
    queryFn: () => getPostDetail({ threadId: postId as string }),
    enabled: isPostIdValid,
  });

  const post = data?.success?.result || null;

  // 댓글 목록을 가져오는 훅을 사용합니다.
  // postId가 유효할 때만 useComments 훅을 호출하도록 조건부 호출합니다.
  const { comments: commentList } = useComments(
    isPostIdValid ? postId : undefined,
  );

  // 게시글 작성 시간을 'X일 전' 형식으로 변환합니다.
  // post가 존재하고 createdAt 필드가 있을 때만 getTimeAgo를 호출합니다.
  const timeAgo = post?.createdAt ? getTimeAgo(post.createdAt) : "";

  return {
    post, // 게시글 상세 데이터
    postId, // 현재 게시글 ID (URL 파라미터에서 가져옴)
    commentList, // 댓글 목록
    timeAgo, // 게시글 작성 시간 (X일 전)
    isLoading, // 데이터 로딩 중 여부
    error, // 에러 객체
  };
};
