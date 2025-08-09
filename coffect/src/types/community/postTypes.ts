/**
 * @file postTypes.ts
 * @description 커뮤니티 게시글(Post)과 관련된 모든 API의 요청(Request) 및 응답(Response) 타입을 정의합니다.
 *              - 파일 하나에서 게시글 관련 타입을 모두 관리하여 응집도를 높이고 유지보수성을 향상시킵니다.
 *              - 타입 이름은 '기능 + 목적' (예: GetPostsRequest) 또는 '데이터 모델' (예: Post)으로 명명합니다.
 */

/**
 * @interface Post
 * @description 단일 게시글의 상세 정보를 나타내는 기본 데이터 모델입니다.
 *              API 응답 등 다양한 곳에서 재사용됩니다.
 */
export interface Post {
  resultType: string; // 결과 타입 (예: "success", "error")
  error: null | {
    errorCode: string; // 에러 코드 (예: "THR-04")
    reason: string; // 에러 사유 (예: "게시글 ID가 없습니다.")
    data: null; // 추가 데이터 (없을 경우 null)
  };
  success: null | {
    result: {
      threadId: string; // 게시글 고유 ID
      threadTitle: string; // 게시글 제목
      threadBody: string; // 게시글 본문 내용
      threadShare: number; // 공유 수 (예: 0)
      createdAt: string; // 게시글 작성일 (ISO 8601 형식)
      type: string; // 게시글 종류 (예: "아티클", "질문")
      user: {
        profileImage: string; // 작성자 프로필 이미지 URL
        name: string; // 작성자 이름
        userId: number; // 작성자 고유 ID
      };
      subjectMatch: Array<{
        threadSubject: {
          subjectName: string; // 게시글 주제 이름
          subjectId: number; // 게시글 주제 고유 ID
        };
      }>;
    };
    likes: number; // 좋아요 수
  };
}

// --- API별 요청/응답 타입 ---

/**
 * @interface GetPostsRequest
 * @description 게시글 목록을 조회하는 API (GET /posts)의 요청 파라미터 타입을 정의합니다.
 *              주로 URL 쿼리 스트링으로 전달됩니다.
 * @param {string} [dateCursor] - ISO 8601 형식의 날짜 문자열 (예: "2025-08-04T10:11:11.248Z")
 * @param {number} [likeCursor] - 좋아요 수를 기준으로 페이지네이션 (0부터 시작)
 * @param {boolean} ascend - 정렬 순서 (오름차순 또는 내림차순)
 * @param {string} orderBy - 정렬 기준 (예: "createdAt")
 * @param {number[]} [threadSubject] - 필터링할 게시글 주제 ID 배열 (선택적)
 * - 1 : "프로덕트" / 2 : "개발" / 3 : "디자인" / 4 : "기획" / 5 : "인사이트" / 6 : "취업" / 7 : "창업" / 8 : "학교" / 9 : "기타"
 * @param {string} type - 필터링할 게시글 종류 (예: "아티클", "질문")
 */
export interface PostPostsRequest {
  dateCursor?: string;
  likeCursor?: number;
  ascend: boolean;
  orderBy: string;
  threadSubject?: number[];
  type?: string;
}

/**
 * @interface PostSummary
 * @description 게시글 목록에 사용되는 각 게시글의 요약 정보 모델입니다.
 * @param {string} threadId - 게시글 고유 ID (예: "thread-12345")
 * @param {number} userId - 작성자 고유 ID (예: 20230001)
 * @param {string} type - 게시글 종류 (예: "아티클", "질문")
 * @param {string} threadTitle - 게시글 제목 (예: "새로운 프로덕트 아이디어")
 * @param {string} threadBody - 게시글 본문 내용 (예: "이 아이디어에 대해 어떻게 생각하시나요?")
 * @param {string} createdAt - 게시글 작성일 (ISO 8601 형식, 예: "2023-10-01T12:00:00Z")
 * @param {number} threadShare - 게시글 공유 수 (예: 0)
 * @param {Object} user - 작성자 정보 객체
 * @param {string} user.dept - 작성자 학과 (예: "컴퓨터공학과")
 * @param {number} user.studentId - 작성자 학번 (예: 20230001)
 * @param {string} user.profileImage - 작성자 프로필 이미지 URL
 * @param {string} user.name - 작성자 이름 (예: "홍길동")
 * @param {string[]} [subjects] - 게시글 주제 배열 (선택적, 예: ["프로덕트 개발", "디자인"])
 * @param {string[]} [images] - 게시글 이미지 URL 배열 (선택적, 예: ["image1.jpg", "image2.jpg"])
 * @param {number} likeCount - 게시글 좋아요 수 (예: 10)
 * @param {number} commentCount - 게시글 댓글 수 (예: 5)
 *
 */

export interface PostSummary {
  threadId: string;
  userId: number;
  type?: string;
  threadTitle: string;
  threadBody: string;
  createdAt: string;
  threadShare: number;
  user: {
    dept: string;
    studentId: number;
    profileImage: string;
    name: string;
  };
  subjects?: string[];
  images?: string[];
  likeCount: number;
  commentCount: number;
}

/**
 * @interface GetPostsResponse
 * @description 게시글 목록을 조회하는 API (GET /posts)의 응답 데이터 타입을 정의합니다.
 * @param {string} resultType - 결과 타입 (예: "success", "FAIL")
 * @param {null | { errorCode: string, reason: string, data: null }} error - 에러 정보 (없을 경우 null), 에러 코드: errorCode, 에러 사유: reason
 * @param {null | { thread: PostSummary[], nextCursor: number }} success - 성공 시 게시글 목록과 다음 페이지 커서
 */
export interface PostPostsResponse {
  resultType: string;
  error: null | {
    errorCode: string;
    reason: string;
    data: null;
  };
  success: null | {
    thread: PostSummary[];
    nextCursor: number;
  };
}

/**
 * @interface GetThreadLookUpRequest
 * @description 특정 게시글의 상세 정보를 보내는 Type (GET /thread/lookUp)의 요청 타입을 정의합니다.
 * @param {string} threadId - 조회할 게시글의 고유 ID
 */
export interface GetThreadLookUpRequest {
  threadId: string;
}

/**
 * @interface GetThreadLookUpResponse
 * @description 특정 게시글의 상세 정보를 받는 Type (GET /thread/lookUp)의 응답 타입을 정의합니다.
 * @param {string} resultType - 결과 타입 (예: "success", "FATL")
 * @param {null | { errorCode: string, reason: string, data: null }} error - 에러 정보 (없을 경우 null), 에러 코드: errorCode, 에러 사유: reason
 * @param {null | { result: Post, likes: number }} success - 성공 시 게시글 상세 정보와 좋아요 수
 * @param {Post} success.result - 게시글 상세 정보
 * @param {number} success.likes - 게시글 좋아요 수
 */
export interface GetThreadLookUpResponse {
  resultType: string;
  error: null | {
    errorCode: string; // 에러 코드 (예: "THR-04")
    reason: string; // 에러 사유 (예: "게시글 ID가 없습니다.")
    data: null; // 추가 데이터 (없을 경우 null)
  };
  success: null | {
    result: {
      threadId: string; // 게시글 고유 ID
      threadTitle: string; // 게시글 제목
      threadBody: string; // 게시글 본문 내용
      threadShare: number; // 공유 수 (예: 0)
      createdAt: string; // 게시글 작성일 (ISO 8601 형식)
      type: string; // 게시글 종류 (예: "아티클", "질문")

      user: {
        profileImage: string; // 작성자 프로필 이미지 URL
        name: string; // 작성자 이름
        userId: number; // 작성자 고유 ID
      };
      subjectMatch: Array<{
        threadSubject: {
          subjectName: string; // 게시글 주제 이름
          subjectId: number; // 게시글 주제 고유 ID
        };
      }>;
    };
    //삭제 예정
    likes: number; // 좋아요 수
  };
}
