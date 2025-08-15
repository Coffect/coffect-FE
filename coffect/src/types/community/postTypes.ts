/**
 * @file postTypes.ts
 * @description 커뮤니티 게시글(Post)과 관련된 모든 API의 요청(Request) 및 응답(Response) 타입을 정의합니다.
 *              - 파일 하나에서 게시글 관련 타입을 모두 관리하여 응집도를 높이고 유지보수성을 향상시킵니다.
 *              - 타입 이름은 '기능 + 목적' (예: GetPostsRequest) 또는 '데이터 모델' (예: Post)으로 명명합니다.
 */

/**
 * @interface ThreadSummary
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
 * @param {boolean} isFollowing - 작성자 팔로우 여부 (예: true)
 * @param {boolean} isScraped - 게시글 스크랩 여부 (예: false)
 * @param {boolean} isLiked - 게시글 좋아요 여부 (예: true)
 *
 */

export interface ThreadSummary {
  threadId: string;
  userId: number;
  threadTitle: string;
  threadBody: string;
  type?: string;
  createdAt: string;
  threadShare: number;
  user: {
    dept: string;
    studentId: number;
    profileImage: string;
    name: string;
    id: string;
  };
  subjects?: string[];
  images?: string[];
  likeCount: number;
  commentCount: number;
  isFollowing: boolean;
  isScraped: boolean;
  isLiked: boolean;
}

// --- API별 요청/응답 타입 ---

/************************ 최신순 게시글 조회 API ************************/

export interface GetThreadLatestRequest {
  dateCursor?: string;
}

export interface GetThreadLatestResponse {
  resultType: string;
  error: null | {
    errorCode: string; // 에러 코드 (예: "THR-04")
    reason: string; // 에러 사유 (예: "게시글 ID가 없습니다.")
    data: null; // 추가 데이터 (없을 경우 null)
  };
  success: null | {
    thread: ThreadSummary[];
    nextCursor: number;
  };
}

/**************************** 게시글 페이지 필터링 조회 ************************/

export interface PostThreadsFilterRequest {
  dateCursor?: string;
  orderBy: string;
  threadSubject?: number[] | null;
  type?: string | null;
}

export interface PostThreadsFilterResponse {
  resultType: string;
  error: null | {
    errorCode: string;
    reason: string;
    data: null;
  };
  success: null | {
    thread: ThreadSummary[];
    nextCursor: number;
  };
}

/******************************** 게시글 상세 페이지 조회 *************************/

export interface GetThreadLookUpRequest {
  threadId: string;
}

export interface GetThreadLookUpResponse {
  resultType: string;
  error: null | {
    errorCode: string;
    reason: string;
    data: null;
  };
  success: null | {
    threadId: string; // 게시글 고유 ID
    userId: number; // 작성자 고유 ID
    type: string; // 게시글 종류 (예: "아티클", "질문")
    threadTitle: string; // 게시글 제목
    threadBody: string; // 게시글 본문 내용
    createdAt: string; // 게시글 작성일 (ISO 8601 형식)
    threadShare: number; // 게시글 공유 수 (예: 0)
    user: {
      dept: string; // 작성자 학과 (예: "컴퓨터공학과")
      studentId: number; // 작성자 학번 (예: 20230001)
      profileImage: string; // 작성자 프로필 이미지 URL
      name: string; // 작성자 이름 (예: "홍길동")
      id: string;
    };
    subjects: string[];
    images: string[];
    commentCount: number; // 게시글 댓글 수 (예: 5)
    likeCount: number; // 게시글 좋아요 수 (예: 10)
    isFollowing: boolean; // 작성자 팔로우 여부 (예: true)
    isScraped: boolean; // 게시글 스크랩 여부 (예: false)
    isLiked: boolean; // 게시글 좋아요 여부 (예: true)
  };
}
