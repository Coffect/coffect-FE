export interface getChangeIdResponse {
  resultType: string;
  error: null | {
    errorCode: string;
    reason: string;
    data: string;
  };
  success: {
    id: string;
  };
}
