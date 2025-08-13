export type profileType = {
  resultType: string;
  error: null | {
    errorCode: string;
    reason: string;
    data: null | string;
  };
  success: null | {
    threadCount: number;
    following: number;
    follower: number;
    userInfo: {
      userId: number;
      id: string;
      name: string;
      introduce: string;
      profileImage: string;
      dept: string;
      studentId: number;
      UnivList: {
        name: string;
      };
    };
    interest: Array<{
      category: {
        categoryId: number;
        categoryName: string;
        categoryColor: string;
      };
    }>;
    specifyProfile: {
      info: Array<{
        answer: string;
        isMain: boolean;
        question: string;
      }>;
    };
  };
};

export type patchProfileType = {
  resultType: string;
  error: null | {
    errorCode: string;
    reason: string;
    data: null | string;
  };
  success: string;
};

export type patchProfileInterestType = {
  resultType: string;
  error: null | {
    errorCode: string;
    reason: string;
    data: null | string;
  };
  success: null | string;
};

export type patchProfileDetailType = {
  resultType: string;
  error: null | {
    errorCode: string;
    reason: string;
    data: null | string;
  };
  success: string;
};

export type profileDetailItemType = {
  question: string;
  answer: string;
  isMain: boolean;
};

export type logoutType = {
  resultType: string;
  error: null | {
    errorCode: string;
    reason: string;
    data: null | string;
  };
  success: null | string;
};
