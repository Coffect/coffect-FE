export interface LikeRequest {
  threadId: string; // 게시글 ID
}

export interface LikeResponse {
  resultType: "SUCCESS" | "FAIL"; // 결과 타입 (예: "SUCCESS", "FAIL")
  error: null | {
    errorCode: string; // 에러 코드
    reason: string; // 에러 메시지
    data?: null; // 추가 데이터 (선택 사항)
  };
  success: null | string;
}

export interface ScrapRequest {
  threadId: string; // 게시글 ID
}

export interface ScrapResponse {
  resultType: "SUCCESS" | "FAIL"; // 결과 타입 (예: "SUCCESS", "FAIL")
  error: null | {
    errorCode: string; // 에러 코드
    reason: string; // 에러 메시지
    data?: null; // 추가 데이터 (선택 사항)
  };
  success: null | string;
}
