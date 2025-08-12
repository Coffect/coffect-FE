import { useQuery } from "@tanstack/react-query";
import { getComments } from "@/api/community/commentApi";
import type { getCommentResponse } from "@/types/community/commentTypes";
import { QUERY_KEYS } from "@/constants/key";
import { useParams } from "react-router-dom";

/**
 * @function useGetComments
 * @description 특정 스레드의 댓글 목록을 조회하는 React Query 훅입니다.
 * @param {getCommentRequest} params - 댓글 목록 조회를 위한 쿼리 파라미터 객체.
 * @returns {object} useQueryResult 객체.
 */
export const useGetComments = () => {
  const { id } = useParams<{ id: string }>();
  const postId = id;
  const isPostIdValid = typeof postId === "string" && postId.length > 0;

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.COMMENTS, postId],
    queryFn: () => getComments({ threadId: postId as string }),
    enabled: isPostIdValid,

    select: (data: getCommentResponse) => {
      const comments = data.success || null;

      if (!comments) {
        return { comments: null };
      }

      return { comments };
    },
  });

  return {
    comments: data?.comments || null,
    postId,
    isLoading,
    error,
  };
};
