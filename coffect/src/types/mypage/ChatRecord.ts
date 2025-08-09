export type getPastCoffeeChatType = {
  resultType: "string";
  error: null | {
    errorCode: string;
    reason: string;
    data: null;
  };
  success:
    | null
    | [
        {
          coffectId: number;
          opponentName: string;
          color1: string;
          color2: string;
          coffeeDate: string;
        },
      ];
};

export type getSpecifyCoffeeChatType = {
  resultType: string;
  error: null | {
    errorCode: string;
    reason: string;
    data: null;
  };
  success: null | {
    opponentName: string;
    color1: string;
    color2: string;
    coffeeDate: string;
    location: string;
    firstUserImage: string;
    secondUserImage: string;
  };
};
