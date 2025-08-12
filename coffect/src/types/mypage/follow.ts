export type getIsFollowType = {
  resultType: string;
  error: null | {
    errorCode: string;
    reason: string;
    data: null | string;
  };
  success: null | boolean;
};

export type postFollowRequestType = {
  resultType: string;
  error: null | {
    errorCode: string;
    reason: string;
    data: null | string;
  };
  success: null | boolean;
};
