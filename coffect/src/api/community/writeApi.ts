/**
 * @file writeApi.ts
 * @author 흥부/강신욱
 * @description
 * 게시글 작성 관련 API 함수들을 정의합니다.
 * 이 파일은 게시글 본문과 이미지를 서버에 업로드하는 기능을 포함합니다.
 * @version 1.0.0
 * - 1.0.0 : 초기 작성 ( 게시글 본문 업로드 API 정의 )
 * @date 2023-08-05
 */

import { axiosInstance } from "@/api/axiosInstance"; // axios 인스턴스를 가져옵니다.
import type {
  postUploadRequest,
  postUploadResponse,
} from "@/types/community/writePostTypes";

/**
 * @function uploadPost
 * @description 게시글 본문 내용을 서버에 업로드하는 API 함수입니다.
 *              서버에 POST 요청을 보내고, 성공 시 게시글 업로드 응답을 반환합니다.
 * @param {postUploadRequest} data - 게시글 업로드에 필요한 데이터 객체.
 * @returns {Promise<postUploadResponse>} 게시글 업로드 응답을 담은 Promise를 반환합니다.
 * @throws API 요청이 실패하거나 응답이 'success'가 아닐 경우 에러를 발생시킵니다.
 */
export const uploadPost = async (
  data: postUploadRequest,
): Promise<postUploadResponse> => {
  try {
    const response = await axiosInstance.post<postUploadResponse>(
      "/thread/add",
      data,
    );
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(
        response.data.error?.reason || "게시글 업로드 API 통신에 실패했습니다.",
      );
    }
  } catch (error) {
    console.error("Error uploading post:", error);
    throw error;
  }
};
