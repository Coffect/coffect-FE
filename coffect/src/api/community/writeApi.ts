import { axiosInstance } from "../axiosInstance";
import type {
  PostUploadRequest,
  PostUploadResponse,
  // PostImageUploadRequest,
  PostImageUploadResponse,
} from "@/types/community/writePostTypes";

/**
 * @function uploadPost
 * @description 게시글 본문 내용을 서버에 업로드하는 API 함수입니다.
 *              서버에 POST 요청을 보내고, 성공 시 게시글 업로드 응답을 반환합니다.
 * @param {PostUploadRequest} data - 게시글 업로드에 필요한 데이터 객체.
 * @returns {Promise<PostUploadResponse>} 게시글 업로드 응답을 담은 Promise를 반환합니다.
 * @throws API 요청이 실패하거나 응답이 'success'가 아닐 경우 에러를 발생시킵니다.
 */
export const uploadPost = async (
  data: PostUploadRequest,
): Promise<PostUploadResponse> => {
  try {
    // axiosInstance를 사용해 서버에 POST 요청을 보냅니다.
    // 제네릭으로 PostUploadResponse 타입을 지정하여 응답 데이터의 타입을 강제합니다.
    const response = await axiosInstance.post<PostUploadResponse>(
      "/thread/add", // 요청할 엔드포인트
      data, // 전달받은 data 객체를 직접 요청 본문으로 사용합니다.
    );

    // 서버 응답의 resultType이 'success'인지 확인합니다.
    if (response.data.resultType === "success") {
      return response.data; // PostUploadResponse 전체를 반환합니다.
    } else {
      // 서버가 에러 응답을 보냈을 경우 (resultType이 'FAIL')
      // 응답에 포함된 에러 메시지를 사용해 커스텀 에러를 생성하고 throw합니다.
      throw new Error(
        response.data.error?.reason || "게시글 업로드 API 통신에 실패했습니다.",
      );
    }
  } catch (error) {
    // 네트워크 오류 등 axios 요청 과정에서 발생한 에러를 처리합니다.
    console.error("Error uploading post:", error);
    // 여기서 잡힌 에러를 다시 throw하여, 이 함수를 호출한 상위 로직(예: react-query)에서
    // 에러 상태를 인지하고 처리할 수 있도록 합니다.
    throw error;
  }
};

/**
 * @function uploadPostImage
 * @description 게시글에 첨부할 이미지를 서버에 업로드하는 API 함수입니다.
 *              이미지 파일을 multipart/form-data 형태로 POST 요청을 보냅니다.
 * @param {File} imageFile - 업로드할 이미지 파일 객체.
 * @returns {Promise<PostImageUploadResponse>} 이미지 업로드 응답을 담은 Promise를 반환합니다.
 * @throws API 요청이 실패하거나 응답이 'success'가 아닐 경우 에러를 발생시킵니다.
 */
export const uploadPostImage = async (
  imageFile: File,
): Promise<PostImageUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append("images", imageFile); // 'images'는 백엔드에서 기대하는 필드명입니다.

    const response = await axiosInstance.post<PostImageUploadResponse>(
      "/thread/addImage", // 이미지 업로드 엔드포인트
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // multipart/form-data 헤더 설정
        },
      },
    );

    if (response.data.resultType === "success") {
      return response.data; // PostImageUploadResponse 전체를 반환합니다.
    } else {
      throw new Error(
        response.data.error?.reason || "이미지 업로드 API 통신에 실패했습니다.",
      );
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
