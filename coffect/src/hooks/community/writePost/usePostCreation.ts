/**
 * @file usePostCreation.ts
 * @author 흥부/강신욱
 * @description
 * 게시글 생성(이미지 업로드 포함) 로직을 오케스트레이션하는 커스텀 훅입니다.
 * 이 훅은 이미지 업로드 후 게시글 본문 업로드를 순차적으로 처리하며,
 * React Query의 mutation 훅들을 사용하여 API 호출 상태를 관리합니다.
 * @version 1.0.0
 * - 1.0.0 : 초기 작성 ( 게시글 생성 로직 훅 정의 )
 * @date 2023-08-05
 */

import { useCallback } from "react";
import { useUploadPostMutation } from "@/hooks/community/mutation/useUploadPostMutation";
import { useUploadPostImageMutation } from "@/hooks/community/mutation/useUploadPostImageMutation";
import type { PostUploadRequest } from "@/types/community/writePostTypes";

/**
 * @interface UsePostCreationReturn
 * @description usePostCreation 훅이 반환하는 값들의 타입을 정의합니다.
 *              게시글 생성(이미지 업로드 포함) 관련 API 호출 상태와 트리거 함수를 포함합니다.
 * @property handleUpload - 게시글 업로드를 트리거하는 함수
 * @param {Omit<PostUploadRequest, "images">} postData - 이미지 필드를 제외한 게시글 데이터
 * @param {File[]} selectedImageFiles - 사용자가 선택한 이미지 파일 배열
 * @property isLoading - 현재 API 호출이 진행 중인지 여부
 * @property error - API 호출 중 발생한 에러 정보
 * @property isSuccess - 게시글 업로드가 성공적으로 완료되었는지 여부
 */
export interface UsePostCreationReturn {
  handleUpload: (
    postData: Omit<PostUploadRequest, "images">,
    selectedImageFiles: File[],
  ) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
}

/**
 * @function usePostCreation
 * @description 게시글 생성(이미지 업로드 포함) 로직을 오케스트레이션하는 커스텀 훅입니다.
 *              이미지 업로드 후 게시글 본문 업로드를 순차적으로 처리하며,
 *              React Query의 mutation 훅들을 사용하여 API 호출 상태를 관리합니다.
 * @returns {UsePostCreationReturn} 게시글 생성 관련 상태와 함수를 담은 객체
 */
export const usePostCreation = (): UsePostCreationReturn => {
  const {
    mutateAsync: uploadPostMutate,
    isPending: isPostPending,
    error: postUploadError,
    isSuccess: isPostUploadSuccess,
  } = useUploadPostMutation();

  const {
    mutateAsync: uploadImageMutate,
    isPending: isImagePending,
    error: imageUploadError,
  } = useUploadPostImageMutation();

  // 전체 로딩 상태는 두 mutation 훅의 로딩 상태를 합쳐서 관리
  const isLoading = isPostPending || isImagePending;
  // 전체 에러 상태는 두 mutation 훅의 에러 상태를 합쳐서 관리
  const error = postUploadError || imageUploadError;
  // 최종 성공 상태는 게시글 본문 업로드 성공을 기준으로 합니다.
  const isSuccess = isPostUploadSuccess;

  /**
   * @description 게시글 업로드 프로세스를 시작하는 함수입니다.
   *              이미지 업로드 후 게시글 본문 업로드를 순차적으로 처리합니다.
   * @param {Omit<PostUploadRequest, "images">} postData - 이미지 필드를 제외한 게시글 데이터
   * @param {File[]} selectedImageFiles - 사용자가 선택한 이미지 파일 배열
   */
  const handleUpload = useCallback(
    async (
      postData: Omit<PostUploadRequest, "images">,
      selectedImageFiles: File[],
    ) => {
      try {
        const imageUrls: string[] = [];
        // 1. 선택된 이미지 파일들을 먼저 서버에 업로드합니다.
        for (const imageFile of selectedImageFiles) {
          const imageUploadResponse = await uploadImageMutate(imageFile);
          // 이미지 업로드 성공 시, 반환된 이미지 URL들을 수집합니다.
          if (
            imageUploadResponse.resultType === "success" &&
            imageUploadResponse.success
          ) {
            imageUrls.push(...imageUploadResponse.success);
          } else {
            // 이미지 업로드 실패 시 에러를 throw하여 catch 블록으로 이동
            throw new Error(
              imageUploadResponse.error?.reason || "이미지 업로드 실패",
            );
          }
        }

        // 2. 게시글 본문과 함께 업로드된 이미지 URL들을 전송합니다.
        const finalPostData: PostUploadRequest = {
          ...postData,
          images: imageUrls,
        };

        // 게시글 본문 업로드 API 호출
        await uploadPostMutate(finalPostData);
      } catch (err) {
        console.error("게시글 작성 실패:", err);
        throw err;
      }
    },
    [uploadImageMutate, uploadPostMutate],
  );

  return {
    handleUpload,
    isLoading,
    error,
    isSuccess,
  };
};
