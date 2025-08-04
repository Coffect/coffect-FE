import { axiosInstance } from "../axiosInstance";
import type {
  PostUploadRequest,
  PostUploadResponse,
} from "@/types/community/writePostTypes";

/**
 * @function postUpload
 * @description 특정 게시글의 댓글 목록을 가져오는 API 함수입니다.
 *              서버에 GET 요청을 보내고, 성공 시 댓글 목록을 반환합니다.
 * @param {getCommentRequest} params - 댓글 조회를 위한 파라미터 객체 (예: { threadId: '...' }).
 * @returns {Promise<Comment[]>} 댓글 객체 배열을 담은 Promise를 반환합니다.
 * @throws API 요청이 실패하거나 응답이 'success'가 아닐 경우 에러를 발생시킵니다.
 */
export const postUpload = async (
  params: PostUploadRequest,
): Promise<PostUploadResponse> => {
  try {
    // axiosInstance를 사용해 서버에 GET 요청을 보냅니다.
    // 제네릭으로 getCommentResponse 타입을 지정하여 응답 데이터의 타입을 강제합니다.
    const response = await axiosInstance.post<PostUploadResponse>(
      "/thread/add", // 요청할 엔드포인트
      {
        // 전달받은 params 객체를 그대로 요청 파라미터로 사용합니다.
        // 이렇게 하면 향후 파라미터가 추가되어도 이 함수를 수정할 필요가 없습니다.
        params,
      },
    );

    // 서버 응답의 resultType이 'success'이고, success 객체가 존재하는지 확인합니다. 이 과정을 통해 데이터가 정상적으로 왔는지 보장할 수 있습니다.
    if (response.data.resultType === "success" && response.data.success) {
      return response.data.success.threadId;
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
