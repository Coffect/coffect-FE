/**
 * @file useUploadPostMutation.ts
 * @author 흥부/강신욱
 * @description
 * 게시글 업로드를 위한 React Query Mutation 훅입니다.
 * @version 1.0.0
 * - 1.0.0 : 초기 작성 ( 게시글 업로드 Mutation 훅 정의 )
 * @date 2023-08-05
 */

import { useMutation } from "@tanstack/react-query";
import { uploadPost } from "@/api/community/writeApi";
import type {
  PostUploadRequest,
  PostUploadResponse,
} from "@/types/community/writePostTypes";

/**
 * @function useUploadPostMutation
 * @description 게시글 업로드 API를 호출하는 React Query Mutation 훅입니다.
 *              게시글 본문 내용을 서버에 전송하고, 성공/실패 상태를 관리합니다.
 * @property {PostUploadRequest} data - 게시글 업로드에 필요한 데이터 객체
 * @property {PostUploadResponse} response - 게시글 업로드 API의 응답 구조
 * @property {string} response.resultType - 결과 타입 (예: "SUCCESS", "FAIL")
 * @property {null | { errorCode: string, reason: string, data?: null }} response.error - 에러 정보 (실패 시)
 * @property {null | { threadId: string }} response.success - 성공 정보 (성공 시, 게시글 ID 포함)
 * @property {function} mutateAsync - 게시글 업로드를 수행하는 함수
 * @property {boolean} isPending - 현재 업로드 중인지 여부
 * @property {boolean} isError - 업로드 중 에러가 발생했는지 여부
 * @property {boolean} isSuccess - 업로드가 성공적으로 완료되었는지 여부
 * @property {Error | null} error - 업로드 중 발생한 에러 객체 (isError가 true일 때)
 * @property {PostUploadResponse | null} data - 업로드 성공 시 반환되는 데이터 (isSuccess가 true일 때)
 * @returns {object} useMutation 훅의 반환 값 (mutate 함수, isPending, isError, data, error 등)
 */
export const useUploadPostMutation = () => {
  return useMutation<PostUploadResponse, Error, PostUploadRequest>({
    mutationFn: uploadPost,
    onSuccess: (data) => {
      console.log("게시글 업로드 성공:", data);
    },
    onError: (error) => {
      console.error("게시글 업로드 실패:", error);
    },
  });
};
