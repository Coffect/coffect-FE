/**
 * @author: 강신욱
 * @description: 댓글 관련 타입을 정의하는 파일
 * @version: 1.0.0
 * @version: 1.1.0
 * @date: 2025-08-05
 * @remarks
 * - 1.0.0: 댓글 조회 API 타입 정의
 * - 1.1.0: 댓글 작성 API 타입 정의
 */

export interface Comment {
  commentId: number; // 댓글 ID
  userId: number; // 작성자 ID
  threadId: string; // 게시글 ID
  commentBody: string; // 댓글 본문
  quote: number; // 인용 댓글 여부 (0: 일반 댓글, 1: 인용 댓글)
  createdAtD: string; // 댓글 생성 날짜 (ISO 8601 형식)
  user: {
    studentId: number; // 학생 ID
    profileImage: string; // 프로필 이미지 URL
    name: string; // 작성자 이름
    dept: string; // 학과
    id: string; // 작성자 페이지로 가기 위함.
  };
}

export interface getCommentRequest {
  threadId: string; // 게시글 ID
}

export interface getCommentResponse {
  resultType: string; // 결과 타입 (예: "success", "FAIL")
  error: null | {
    errorCode: string; // 에러 코드
    reason: string; // 에러 사유
    data: null; // 에러 데이터 (없을 경우 null)
  };
  success: null | Comment[];
}

/********************************* 댓글 작성 API Type  *************************************/

/**
 * @interface postCommentRequest
 * @description: 댓글 작성 API 요청 타입
 * @property {number} quote - 인용 댓글 여부 (0: 일반 댓글, 1: 인용 댓글)
 * @property {string} commentBody - 댓글 본문
 * @property {string} threadId - 게시글 ID (댓글을 작성할 게시글의 ID)
 */
export interface postCommentRequest {
  quote: number;
  commentBody: string;
  threadId: string;
}

/**
 * @interface postCommentResponse
 * @description: 댓글 작성 API 응답 타입
 * @property {string} resultType - 결과 타입 (예: "success", "FAIL")
 * @property {null | { errorCode: string, reason: string, data: null }} error - 에러 정보 (에러가 없을 경우 null)
 * @property {null | { threadId: string, userId: number, commentBody: string, quote: number, createdAtD: string, commentId: number }} success - 성공 시 댓글 정보
 * @property {string} success.threadId - 게시글 ID (댓글이 작성된 게시글의 ID)
 * @property {number} success.userId - 작성자 ID
 * @property {string} success.commentBody - 댓글 본문
 * @property {number} success.quote - 인용 댓글 여부 (0: 일반 댓글, 1: 인용 댓글)
 * @property {string} success.createdAtD - 댓글 생성 날짜 (ISO 8601 형식)
 * @property {number} success.commentId - 작성된 댓글의 ID
 */
export interface postCommentResponse {
  resultType: string; // 결과 타입 (예: "success", "FAIL")
  error: null | {
    errorCode: string; // 에러 코드
    reason: string; // 에러 사유
    data: null; // 에러 데이터 (없을 경우 null)
  };
  success: null | {
    threadId: string; // 게시글 ID (댓글이 작성된 게시글의 ID)
    userId: number; // 작성자 ID
    commentBody: string; // 댓글 본문
    quote: number; // 인용 댓글 여부 (0: 일반 댓글, 1: 인용 댓글)
    createdAtD: string; // 댓글 생성 날짜 (ISO 8601 형식)
    commentId: number; // 작성된 댓글의 ID
  };
}
