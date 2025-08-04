export type getIsFollowType = {
  resultType: string;
  error: null | {
    errorCode: string;
    reason: string;
    data: null;
  };
  success: null | boolean;
};

export type postFollowRequestType = {
  resultType: string;
  error: null | {
    errorCode: string;
    reason: string;
    data: null;
  };
  success: null | boolean;
};
