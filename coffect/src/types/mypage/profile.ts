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

export type timeLineType = {
  resultType: string;
  error: null | {
    errorCode: string;
    reason: string;
    data: null | string;
  };
  success: null | string;
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

export type postIsCoffeeChatType = {
  resultType: string;
  error: null | {
    errorCode: string;
    reason: string;
    data: null | string;
  };
  success: null | {
    senderId: number;
    receiverId: number;
    isCoffeeChat: boolean; // 제안 여부를 보냈는지
    check: boolean; // 보낸 제안을 승낙했는지
  };
};

export type postChatStartType = {
  resultType: string;
  error: null | {
    errorCode: string;
    reason: string;
    data: null | string;
  };
  success: null | {
    chatRoomId: string;
  };
};
