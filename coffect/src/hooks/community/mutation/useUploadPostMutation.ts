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
  postUploadRequest,
  postUploadResponse,
} from "@/types/community/writePostTypes";

/**
 * @function useUploadPostMutation
 * @description 게시글 업로드 API를 호출하는 React Query Mutation 훅입니다.
 *              게시글 본문 내용을 서버에 전송하고, 성공/실패 상태를 관리합니다.
 * @returns {object} useMutation 훅의 반환 값 (mutate 함수, isPending, isError, data, error 등)
 */
export const useUploadPostMutation = () => {
  return useMutation<postUploadResponse, Error, postUploadRequest>({
    mutationFn: uploadPost,
    onSuccess: (data) => {
      console.log("게시글 업로드 성공:", data);
    },
    onError: (error) => {
      console.error("게시글 업로드 실패:", error);
    },
  });
};
