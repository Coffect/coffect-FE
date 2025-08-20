/**
 * @author: 강신욱
 * @description: 새로운 댓글을 추가하는 react-query 커스텀 훅
 * @version: 1.0.0
 * @date: 2025-08-03
 * @version: 2.0.0
 * @date: 2025-08-05
 * @remarks
 * - 1.0.0: 더미 데이터를 사용한 초기 버전
 * - 2.0.0: 실제 API 연동 및 타입 정의에 따른 리팩토링
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment } from "@/api/community/commentApi";
import type {
  Comment,
  getCommentResponse,
  postCommentRequest,
  postCommentResponse,
} from "@/types/community/commentTypes";
import { QUERY_KEYS } from "@/constants/queryKey";
import type { GetThreadLookUpResponse } from "@/types/community/postTypes";
import type { profileType } from "@/types/mypage/profile";
import defaultImage from "@/assets/icon/community/defaultImage.png";

interface ContextType {
  previousComments?: getCommentResponse;
  previousPostDetail?: GetThreadLookUpResponse;
}

/**
 * @description 새로운 댓글을 서버에 추가하는 useMutation 커스텀 훅입니다.
 *              댓글 추가 성공 시, 관련 댓글 목록 캐시를 무효화하여 데이터를 자동으로 새로고침합니다.
 */

export const useAddCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    postCommentResponse,
    Error,
    postCommentRequest,
    ContextType
  >({
    mutationFn: addComment,

    onMutate: async (newComment) => {
      // 1. 관련 쿼리 취소
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.COMMENT.COMMENTS(newComment.threadId),
      });
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.COMMUNITY.POST_DETAIL(newComment.threadId),
      });

      // 2. 이전 데이터 스냅샷 저장
      const previousComments = queryClient.getQueryData<getCommentResponse>(
        QUERY_KEYS.COMMENT.COMMENTS(newComment.threadId),
      );
      const previousPostDetail =
        queryClient.getQueryData<GetThreadLookUpResponse>(
          QUERY_KEYS.COMMUNITY.POST_DETAIL(newComment.threadId),
        );
      const myProfile = queryClient.getQueryData<profileType>(
        QUERY_KEYS.USER.PROFILE,
      );

      // 3. 댓글 목록 캐시 낙관적 업데이트
      queryClient.setQueryData<getCommentResponse>(
        QUERY_KEYS.COMMENT.COMMENTS(newComment.threadId),
        (old) => {
          if (!old || !old.success) return old;

          // 임시 댓글 데이터 생성
          const tempNewComment: Comment = {
            commentId: 0,
            userId: myProfile?.success?.userInfo.userId,
            threadId: newComment.threadId,
            commentBody: newComment.commentBody,
            user: {
              id: myProfile?.success?.userInfo.id,
              name: myProfile?.success?.userInfo.name || "이스터에그",
              profileImage:
                myProfile?.success?.userInfo.profileImage || defaultImage,
              studentId: myProfile?.success?.userInfo.studentId || 99,
              dept: myProfile?.success?.userInfo.dept || "커펙트 화이팅 !!!",
            },
            createdAtD: new Date().toISOString(),
            quote: newComment.quote,
          };

          return {
            ...old,
            success: [tempNewComment, ...old.success],
          };
        },
      );

      // 4. 게시글 상세 정보 캐시 낙관적 업데이트 (댓글 수 증가)
      queryClient.setQueryData<GetThreadLookUpResponse>(
        QUERY_KEYS.COMMUNITY.POST_DETAIL(newComment.threadId),
        (old) => {
          if (!old || !old.success) return old;
          return {
            ...old,
            success: {
              ...old.success,
              commentCount: old.success.commentCount + 1,
            },
          };
        },
      );

      // 롤백을 위해 이전 데이터 반환
      return { previousComments, previousPostDetail };
    },

    onSuccess: (response, variables) => {
      if (response.success) {
        console.log("댓글이 성공적으로 추가되었습니다.", response.success);

        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.COMMENT.COMMENTS(variables.threadId),
        });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.COMMUNITY.POST_DETAIL(variables.threadId),
        });
      } else {
        console.error(
          "댓글 추가 API는 성공했으나, 서버에서 에러를 반환했습니다:",
          response.error,
        );
      }
    },

    onError: (error, variables, context) => {
      console.error("댓글 추가 중 에러가 발생했습니다:", error);
      if (context?.previousComments) {
        queryClient.setQueryData(
          QUERY_KEYS.COMMENT.COMMENTS(variables.threadId),
          context.previousComments,
        );
      }
      if (context?.previousPostDetail) {
        queryClient.setQueryData(
          QUERY_KEYS.COMMUNITY.POST_DETAIL(variables.threadId),
          context.previousPostDetail,
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COMMENT.COMMENTS(variables.threadId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COMMUNITY.POST_DETAIL(variables.threadId),
      });
    },
  });
};
