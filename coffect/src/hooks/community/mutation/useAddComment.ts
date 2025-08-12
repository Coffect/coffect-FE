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
  postCommentRequest,
  postCommentResponse,
} from "@/types/community/commentTypes";

/**
 * @description 새로운 댓글을 서버에 추가하는 useMutation 커스텀 훅입니다.
 *              댓글 추가 성공 시, 관련 댓글 목록 캐시를 무효화하여 데이터를 자동으로 새로고침합니다.
 */

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation<postCommentResponse, Error, postCommentRequest>({
    mutationFn: addComment,

    onSuccess: (response, variables) => {
      if (response.success) {
        console.log("댓글이 성공적으로 추가되었습니다.", response.success);

        queryClient.invalidateQueries({
          queryKey: ["comments", variables.threadId],
        });
      } else {
        console.error(
          "댓글 추가 API는 성공했으나, 서버에서 에러를 반환했습니다:",
          response.error,
        );
      }
    },

    onError: (error) => {
      console.error("댓글 추가 중 에러가 발생했습니다:", error);
    },
  });
};
