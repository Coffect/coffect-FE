export interface FollowRequest {
  oppentUserId: number;
}

export interface FollowResponse {
  resultType: string;
  error: null | {
    errorCode: string;
    reason: string;
    data?: null;
  };
  success: null | string;
}
