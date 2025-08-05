import { useMutation } from "@tanstack/react-query";
import { uploadPostImage } from "../../../api/community/writeApi";
import type { PostImageUploadResponse } from "@/types/community/writePostTypes";

/**
 * @function useUploadPostImageMutation
 * @description 게시글 이미지 업로드 API를 호출하는 React Query Mutation 훅입니다.
 *              이미지 파일을 서버에 전송하고, 성공/실패 상태를 관리합니다.
 * @returns {object} useMutation 훅의 반환 값 (mutate 함수, isPending, isError, data, error 등)
 */
export const useUploadPostImageMutation = () => {
  return useMutation<PostImageUploadResponse, Error, File>({
    mutationFn: uploadPostImage,
    onSuccess: (data) => {
      console.log("이미지 업로드 성공:", data);
    },
    onError: (error) => {
      console.error("이미지 업로드 실패:", error);
    },
  });
};