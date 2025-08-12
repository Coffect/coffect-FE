/**
 * @author: 강신욱
 * @description: 댓글 관련 API 함수
 * @version: 1.1.0
 * @date: 2025-08-03
 * @remarks
 * - 1.0.0: 더미 댓글 데이터 생성 함수 및 댓글 목록 조회, 추가 API 함수 구현
 * - 1.1.0: getComments 함수에 실제 API 연동 및 더미 데이터 로직 제거
 */
import { axiosInstance } from "../axiosInstance";
import type {
  getCommentRequest,
  getCommentResponse,
  postCommentRequest,
  postCommentResponse,
} from "@/types/community/commentTypes";

/**
 * @function getComment
 * @description 특정 스레드의 댓글 목록을 조회하는 API 함수입니다.
 *              서버에 GET 요청을 보내고, 성공 시 서버의 응답을 그대로 반환합니다.
 * @param {getCommentRequest} params - 댓글 목록 조회를 위한 쿼리 파라미터 객체.
 *        (예: { threadId: '...', page: 1, limit: 10 })
 * @returns {Promise<getCommentResponse>} 서버의 응답 객체를 담은 Promise를 반환합니다.
 *        (예: { resultType: 'success', success: { ... }, error: null })
 * @throws API 요청이 실패할 경우 에러를 발생시킵니다.
 */
export const getComments = async (
  params: getCommentRequest,
): Promise<getCommentResponse> => {
  try {
    const response = await axiosInstance.get<getCommentResponse>(
      "/thread/getComment",
      {
        params: { threadId: params.threadId },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

/**
 * @function addComment
 * @description 새로운 댓글을 추가하는 API 함수입니다.
 *              서버에 POST 요청을 보내고, 성공 시 서버의 응답을 그대로 반환합니다.
 * @param {postCommentRequest} commentData - 댓글 작성을 위한 데이터 객체.
 *        (예: { threadId: '...', commentBody: '...', quote: 0 })
 * @returns {Promise<postCommentResponse>} 서버의 응답 객체를 담은 Promise를 반환합니다.
 *        (예: { resultType: 'success', success: { ... }, error: null })
 * @throws API 요청이 실패할 경우 에러를 발생시킵니다.
 */
export const addComment = async (
  commentData: postCommentRequest,
): Promise<postCommentResponse> => {
  try {
    const response = await axiosInstance.post<postCommentResponse>(
      "/thread/postComment",
      commentData,
    );

    return response.data; // 이 데이터에는 성공 여부(data.resultType), 성공 데이터(data.success) 또는 에러 정보(data.error)가 포함됩니다.
  } catch (error) {
    // 네트워크 오류 등 axios 요청 과정에서 발생한 에러를 처리합니다.
    console.error("Error adding comment:", error);
    // 여기서 잡힌 에러를 다시 throw하여, 이 함수를 호출한 상위 로직(예: react-query의 mutation)에서
    // 에러 상태를 인지하고 UI에 피드백을 주거나 다른 처리를 할 수 있도록 합니다.
    throw error;
  }
};
