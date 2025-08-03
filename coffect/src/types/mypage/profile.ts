export type profileType = {
  resultType: string;
  error: null | {
    errorCode: string;
    reason: string;
    data: null;
  };
  success: null | {
    threadCount: 0;
    following: 0;
    follower: 0;
    userInfo: {
      UnivList: {
        name: string;
      };
      studentId: 0;
      dept: string;
      profileImage: string;
      introduce: string;
      id: string;
      name: string;
    };
    interest: [
      {
        category: {
          categoryColor: string;
          categoryName: string;
          categoryId: 0;
        };
      },
    ];
  };
};

export type patchProfileType = {
  resultType: string;
  error: null | {
    errorCode: string;
    reason: string;
    data: string;
  };
  success: string;
};

export type patchProfileInterestType = {
  resultType: string;
  error: null | {
    errorCode: string;
    reason: string;
    data: null;
  };
  success: null | string;
};

export type profileDetailType = {
  resultType: string;
  error: null | {
    errorCode: string;
    reason: string;
    data: null;
  };
  success:
    | null
    | [
        {
          question: string;
          answer: string;
          isMain: boolean;
        },
      ];
};

export type patchProfileDetailType = {
  resultType: string;
  error: null | {
    errorCode: string;
    reason: string;
    data: null;
  };
  success: string;
};

export type profileDetailItemType = {
  question: string;
  answer: string;
  isMain: boolean;
};
