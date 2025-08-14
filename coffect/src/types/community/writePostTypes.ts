/**
 * @file writePostTypes.ts
 * @author 흥부/강신욱
 * @description 글 작성 관련 컴포넌트 및 훅에서 사용되는 타입 정의입니다.
 * @version 1.0.0
 * @date 2023-08-05
 * - 1.0.0 : 초기 작성 ( 임시 API 정의 )
 */
/**
 * @interface PostUploadRequest
 * @description 게시글 업로드 요청 시 필요한 데이터 구조를 정의합니다.
 * @params {string} threadSubject - 주제 ID 배열
 * - 1 : "프로덕트" / 2 : "개발" / 3 : "디자인" / 4 : "기획" / 5 : "인사이트" / 6 : "취업" / 7 : "창업" / 8 : "학교" / 9 : "기타"
 * @params {string} type - 게시글 종류 (예: 아티클, 팀원 모집 등)
 * @params {string} threadBody - 게시글 내용
 * @params {string} threadTitle - 게시글 제목
 * @description API 수정 예정: images 필드 추가 예정
 */
export interface postUploadRequest {
  images?: File[]; // 이미지 URL 배열 (선택 사항, multipart/form-data로 전송됨)
  type: string; // 게시글 종류 (예: 아티클, 팀원 모집 등)
  threadSubject: string; // 주제 ID 배열
  threadTitle: string; // 게시글 제목
  threadBody: string; // 게시글 내용
}

/**
 * @interface PostUploadResponse
 * @description 게시글 업로드 API의 응답 구조를 정의합니다.
 * @property resultType - 결과 타입 (예: "SUCCESS", "FAIL")
 * @property error - 에러 정보 (실패 시)
 * @property {string} error.errorCode - 에러 코드
 * @property {string} error.reason - 에러 메시지
 * @property {null | {}} error.data - 추가 데이터 (선택 사항)
 * @property success - 성공 정보 (성공 시)
 * @property {string} success.threadId - 게시글 ID (성공 시)
 */
export interface postUploadResponse {
  resultType: string; // 결과 타입 (예: "SUCCESS", "FAIL")
  error: null | {
    errorCode: string; // 에러 코드
    reason: string; // 에러 메시지
    data?: null; // 추가 데이터 (선택 사항)
  };
  success: null | string;
}
