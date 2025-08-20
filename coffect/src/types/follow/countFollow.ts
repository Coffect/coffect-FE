export interface CountFollowRequest {
  userId: number;
}

export interface CountFollowResponse {
  resultType: "SUCCESS" | "FAIL";
  error: null | {
    errorCode: string;
    reason: string;
    data?: null;
  };
  success: null | number[];
}
