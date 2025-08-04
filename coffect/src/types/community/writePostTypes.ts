/**
 * @file writePostTypes.ts
 * @author 흥부/강신욱
 * @description 글 작성 관련 컴포넌트 및 훅에서 사용되는 타입 정의입니다.
 */

/**
 * @interface PostData
 * @description 게시글의 데이터 구조를 정의하여 API 요청 시 사용되는 데이터의 형태를 명확히 합니다.
 *              글 작성 시 필요한 정보(종류, 주제, 제목, 내용)를 포함합니다.
 * @property postType - 게시글의 종류 (예: 아티클, 팀원 모집 등)
 * @property topic - 게시글의 주제 (예: 프로덕트, 개발, 디자인 등)
 * @property title - 게시글의 제목
 * @property content - 게시글의 내용
 */
export interface PostData {
  postType: string;
  topic: string;
  title: string;
  content: string;
}

/**
 * @interface UseWritePostReturn
 * @description  useWritePost 훅이 반환하는 값들의 타입을 정의하며, API 호출 상태(isLoading, error, isSuccess)를 포함합니다.
 *              이 인터페이스는 글 작성 페이지에서 사용되는 상태와 함수들을 포함합니다.
 * @property postType - 현재 선택된 게시글 종류
 * @property topic - 현재 선택된 게시글 주제
 * @property title - 게시글 제목
 * @property content - 게시글 내용
 * @property isFormValid - 폼 유효성 검사 결과 (제목과 내용이 비어있지 않은지 여부)
 * @property handleTopicSelect - 주제 선택 핸들러 함수
 * @property resetPost - 글 작성 상태를 초기화하는 함수
 * @property handleBackClick - 뒤로가기 버튼 클릭 시 호출되는 함수
 * @property handleUpload - 게시글 업로드를 처리하는 비동기 함수
 * @property isLoading - API 호출 중 로딩 상태
 * @property error - API 호출 중 발생한 에러 메시지
 * @property isSuccess - API 호출 성공 여부
 */
export interface UseWritePostReturn {
  postType: string;
  setPostType: (type: string) => void;
  topic: string;
  setTopic: (topic: string) => void;
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>; // 게시글 내용을 업데이트하는 함수
  isFormValid: boolean;
  handleTopicSelect: (selectedTopic: string) => void;
  handlePostTypeSelect: (selectedPostType: string) => void;

  resetPost: () => void;
  handleBackClick: () => void;
  handleUpload: () => Promise<void>; // 비동기 함수이므로 Promise<void> 반환
  isLoading: boolean; // API 호출 로딩 상태
  error: string | null; // API 호출 에러 메시지
  isSuccess: boolean; // API 호출 성공 상태
}

/**
 * @interface PostUploadRequest
 * @description 게시글 업로드 요청 시 필요한 데이터 구조를 정의합니다.
 * @params {number[]} threadSubject - 주제 ID 배열
 * - 1 : "프로덕트" / 2 : "개발" / 3 : "디자인" / 4 : "기획" / 5 : "인사이트" / 6 : "취업" / 7 : "창업" / 8 : "학교" / 9 : "기타"
 * @params {string} threadBody - 게시글 내용
 * @params {string} threadTitle - 게시글 제목
 * @params {string} type - 게시글 종류 (예: 아티클, 팀원 모집 등)
 * @description API 수정 예정: threadId, images 필드 추가 예정
 */
export interface PostUploadRequest {
  threadSubject: number[]; // 주제 ID 배열
  threadBody: string; // 게시글 내용
  threadTitle: string; // 게시글 제목
  type: string; // 게시글 종류 (예: 아티클, 팀원 모집 등)
  // API 수정
  // threadId: string;
  // images?: string[]; // 이미지 URL 배열 (선택 사항)
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
export interface PostUploadResponse {
  resultType: string; // 결과 타입 (예: "SUCCESS", "FAIL")
  error: null | {
    errorCode: string; // 에러 코드
    reason: string; // 에러 메시지
    data?: null; // 추가 데이터 (선택 사항)
  };
  success: null | {
    threadId: string; // 게시글 ID (성공 시) 수정 예정
  }; // 성공 정보 (실패 시 null)
}

/**
 * @interface PostImageUploadRequest
 * @description 게시글에 이미지 업로드 요청 시 필요한 데이터 구조를 정의합니다.
 * @property threadId - 게시글 ID
 * @property images - 이미지 URL 배열
 */
export interface PostImageUploadRequest {
  threadId: string; // 게시글 ID
  images: string[]; // 이미지 URL 배열
}

/**
 * @interface PostImageUploadResponse
 * @description 게시글 이미지 업로드 API의 응답 구조를 정의합니다.
 * @property resultType - 결과 타입 (예: "SUCCESS", "FAIL")
 * @property error - 에러 정보 (실패 시)
 * @property {string} error.errorCode - 에러 코드
 * @property {string} error.reason - 에러 메시지
 * @property {null | {}} error.data - 추가 데이터 (선택 사항)
 * @property success - 성공 정보 (성공 시)
 * @property {string[]} success - 성공 시 이미지 URL 배열 (실패 시 null)
 */
export interface PostImageUploadResponse {
  resultType: string; // 결과 타입 (예: "SUCCESS", "FAIL")
  error: null | {
    errorCode: string; // 에러 코드
    reason: string; // 에러 메시지
    data?: null; // 추가 데이터 (선택 사항)
  };
  success: null | string[]; // 성공 정보 (성공 시 이미지 URL 배열, 실패 시 null)
}
