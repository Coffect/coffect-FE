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
    interest: [
      {
        category: {
          categoryId: 0;
          categoryName: string;
          categoryColor: string;
        };
      },
    ];
    specifyProfile: {
      info: [
        {
          answer: string;
          isMain: boolean;
          question: string;
        },
      ];
    };
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
