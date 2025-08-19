export type ListUpFollow = {
  userId: number;
  id: string;
  name: string;
  profileImage: string;
  studentId: string;
  dept: string;
  idCursor?: number;
};

export type ListUpFollowerRequest = {
  oppentUserId: number;
  idCursor?: number;
};

export type ListUpFollowerResponse = {
  resultType: "SUCCESS" | "FAIL";
  error: null | {
    errorCode: string;
    reason: string;
    data?: null;
  };
  success: null | ListUpFollow[];
};

/******************************************************* */

export type ListUpFollowingRequest = {
  oppentUserId: number;
  idCursor?: number;
};

export type ListUpFollowingResponse = {
  resultType: "SUCCESS" | "FAIL";
  error: null | {
    errorCode: string;
    reason: string;
    data?: null;
  };
  success: null | ListUpFollow[];
};
