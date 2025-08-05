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
 *
 * @returns {object} useMutation이 반환하는 객체. 주요 속성은 다음과 같습니다:
 * - mutate (function): 댓글 추가를 실행하는 함수. postCommentRequest 타입의 객체를 인자로 받습니다.
 * - isPending (boolean): 댓글 추가 요청이 진행 중인지 여부.
 * - isError (boolean): 요청 중 에러 발생 여부.
 * - error (Error | null): 발생한 에러 객체.
 */
export const useAddComment = () => {
  // queryClient는 react-query의 캐시를 관리하고 상호작용하는 핵심 객체입니다.
  const queryClient = useQueryClient();

  return useMutation<
    postCommentResponse, // mutation 함수의 반환 타입 (addComment 함수의 반환 타입)
    Error, // 에러 타입
    postCommentRequest // mutate 함수가 받을 변수의 타입
  >({
    // mutationFn: 실제 데이터 변경(Create, Update, Delete)을 수행하는 비동기 함수입니다.
    // - mutate 함수가 호출될 때 전달받은 변수(여기서는 postCommentRequest 객체)를 인자로 받습니다.
    // - 여기서는 addComment API 함수를 호출하여 서버에 댓글을 추가합니다.
    mutationFn: addComment,

    // onSuccess: mutation이 성공적으로 완료되었을 때 실행되는 콜백 함수입니다.
    // - 이 콜백은 mutationFn이 반환한 데이터(response)와, mutate 함수에 전달된 변수(variables)를 인자로 받습니다.
    // - 여기서 가장 중요한 역할은 서버 데이터 변경 후 클라이언트의 캐시를 동기화하는 것입니다.
    onSuccess: (response, variables) => {
      // API 응답이 성공적인지 확인합니다.
      if (response.resultType === "success") {
        console.log("댓글이 성공적으로 추가되었습니다.", response.success);

        // queryClient.invalidateQueries를 사용하여 특정 쿼리를 "무효화"합니다.
        // - 무효화된 쿼리는 "stale" 상태가 되며, 해당 쿼리를 사용하는 useQuery 훅이 활성화 상태이면
        //   즉시 데이터를 다시 가져옵니다. (refetch)
        // - queryKey를 ['comments', variables.threadId]로 지정하여, 현재 댓글을 추가한
        //   바로 그 게시글의 댓글 목록만 정확히 새로고침하도록 합니다.
        // - 이렇게 하면 사용자는 별도의 새로고침 없이 방금 작성한 댓글을 바로 볼 수 있습니다.
        queryClient.invalidateQueries({
          queryKey: ["comments", variables.threadId],
        });
      } else {
        // API 응답이 실패했을 경우, 에러를 콘솔에 출력합니다.
        // UI 단에서 이 에러를 처리하여 사용자에게 피드백을 줄 수 있습니다.
        console.error(
          "댓글 추가 API는 성공했으나, 서버에서 에러를 반환했습니다:",
          response.error,
        );
      }
    },

    // onError: mutation 과정에서 네트워크 오류 등 에러가 발생했을 때 실행되는 콜백 함수입니다.
    onError: (error) => {
      console.error("댓글 추가 중 에러가 발생했습니다:", error);
      // 여기서 사용자에게 에러 토스트 메시지를 보여주는 등의 처리를 할 수 있습니다.
    },
  });
};
