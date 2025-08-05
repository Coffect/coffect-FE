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
  Comment,
} from "@/types/community/commentTypes";

/**
 * @function getComments
 * @description 특정 게시글의 댓글 목록을 가져오는 API 함수입니다.
 *              서버에 GET 요청을 보내고, 성공 시 댓글 목록을 반환합니다.
 * @param {getCommentRequest} params - 댓글 조회를 위한 파라미터 객체 (예: { threadId: '...' }).
 * @returns {Promise<Comment[]>} 댓글 객체 배열을 담은 Promise를 반환합니다.
 * @throws API 요청이 실패하거나 응답이 'success'가 아닐 경우 에러를 발생시킵니다.
 */
export const getComments = async (
  params: getCommentRequest,
): Promise<Comment[]> => {
  try {
    // axiosInstance를 사용해 서버에 GET 요청을 보냅니다.
    // 제네릭으로 getCommentResponse 타입을 지정하여 응답 데이터의 타입을 강제합니다.
    const response = await axiosInstance.get<getCommentResponse>(
      "/thread/getComment", // 요청할 엔드포인트
      {
        // 전달받은 params 객체를 그대로 요청 파라미터로 사용합니다.
        // 이렇게 하면 향후 파라미터가 추가되어도 이 함수를 수정할 필요가 없습니다.
        params,
      },
    );

    // 서버 응답의 resultType이 'success'이고, success 객체가 존재하는지 확인합니다. 이 과정을 통해 데이터가 정상적으로 왔는지 보장할 수 있습니다.
    if (response.data.resultType === "success" && response.data.success) {
      return response.data.success.comments; // 성공 시, success 객체 안의 comments 배열을 반환합니다.
    } else {
      // 서버가 에러 응답을 보냈을 경우 (resultType이 'FAIL')
      // 응답에 포함된 에러 메시지를 사용해 커스텀 에러를 생성하고 throw합니다.
      // '||' 연산자로 기본 에러 메시지를 설정해 안정성을 높입니다.
      throw new Error(
        response.data.error?.reason || "댓글 조회 API 통신에 실패했습니다.",
      );
    }
  } catch (error) {
    // 네트워크 오류 등 axios 요청 과정에서 발생한 에러를 처리합니다.
    console.error("Error fetching comments:", error);
    // 여기서 잡힌 에러를 다시 throw하여, 이 함수를 호출한 상위 로직(예: react-query)에서
    // 에러 상태를 인지하고 처리할 수 있도록 합니다.
    throw error;
  }
};

/**
 * @description 새로운 댓글을 추가하는 API 함수 (현재는 더미 로직)
 * @param postId - 댓글을 추가할 게시글의 ID
 * @param content - 댓글 내용
 * @returns 새로 추가된 댓글 Promise
 */
export const addComment = async (
  postId: string,
  content: string,
): Promise<Comment> => {
  console.log(`Adding comment "${content}" to post ${postId}...`);
  // 실제 API 호출 로직으로 대체될 부분입니다.
  // 현재는 타입 정의에 맞는 더미 객체를 생성하여 반환합니다.
  const newComment: Comment = {
    commentId: Date.now(), // 임시 ID
    userId: 1, // 임시 유저 ID
    threadId: postId,
    commentBody: content,
    quote: 0, // 일반 댓글
    createdAtD: new Date().toISOString(), // 현재 시간을 ISO 문자열로
    user: {
      studentId: 202012345, // 임시 학번
      profileImage: "https://via.placeholder.com/40", // 임시 프로필 이미지
      name: "현재 사용자", // 임시 이름
    },
  };
  // 비동기 API 호출을 시뮬레이션하기 위해 Promise와 setTimeout을 사용합니다.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(newComment);
    }, 300);
  });
};
