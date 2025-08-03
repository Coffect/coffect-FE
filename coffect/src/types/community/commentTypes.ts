/**
 * @author: 강신욱
 * @description: 댓글 관련 타입을 정의하는 파일
 * @version: 1.0.0
 * @date: 2025-08-03
 * @remarks
 * - 1.0.0: 댓글 데이터 타입 정의 및 API 응답 타입 정의
 */

/**
 * @interface Comment
 * @description: 댓글 Response success 데이터 타입 정의
 * @property {number} commentId - 댓글 ID (댓글 구분)
 * @property {number} userId - 작성자 ID
 * @property {string} threadId - 게시글 ID
 * @property {string} commentBody - 댓글 본문
 * @property {number} quote - 인용 댓글 여부 (0: 일반 댓글, 1: 인용 댓글)
 * @property {string} createdAtD - 댓글 생성 날짜 (ISO 8601 형식)
 * @property {object} user - 댓글 작성자 정보
 * @property {number} user.studentId - 학번번
 * @property {string} user.profileImage - 프로필 이미지 URL
 * @property {string} user.name - 사용자 이름
 * @property {string} user.major - 전공 (추가 예정)
 *
 */
export interface Comment {
  commentId: number; // 댓글 ID
  userId: number; // 작성자 ID
  threadId: string; // 게시글 ID
  commentBody: string; // 댓글 본문
  quote: number; // 인용 댓글 여부 (0: 일반 댓글, 1: 인용 댓글)
  createdAtD: string; // 댓글 생성 날짜 (Ex. 2025-08-03T13:10:44.661Z)
  user: {
    studentId: number; // 학생 ID
    profileImage: string; // 프로필 이미지 URL
    name: string; // 사용자 이름
    // 추가 예정
    // major: string; // 전공
  };
}

/**
 * @interface getCommentRequest
 * @description: 댓글 조회 API 요청 타입
 * @property {string} threadId - 게시글 ID (댓글을 조회할 게시글의 ID)
 */
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
  success: null | {
    comments: Comment[]; // 댓글 목록
  };
}
