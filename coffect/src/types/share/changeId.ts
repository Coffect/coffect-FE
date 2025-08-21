export interface getChangeIdResponse {
  resultType: string;
  error: null | {
    errorCode: string;
    reason: string;
    data: string | null;
  };
  success: {
    id: string;
  } | null;
}
