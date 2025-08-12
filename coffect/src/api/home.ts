import { axiosInstance } from "./axiosInstance";
import {
  type getPastCoffeeChatType,
  type getSpecifyCoffeeChatType,
} from "../types/mypage/ChatRecord";
import { AxiosError } from "axios";

// 나의 커피챗 기록을 모두 가져오는 api
export const getPastCoffeeChat = async (): Promise<getPastCoffeeChatType> => {
  try {
    const res = await axiosInstance.get<getPastCoffeeChatType>(
      "/home/getPastCoffeeChat",
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorData = axiosError.response?.data as getPastCoffeeChatType;

    if (errorData?.error?.errorCode === "HE404") {
      return axiosError.response?.data as getPastCoffeeChatType;
    }

    // 다른 에러들도 처리
    console.error("API 호출 중 에러 발생:", errorData);
    throw new Error("커피챗 기록을 불러올 수 없습니다. 다시 시도해주세요.");
  }
};

// 나의 커피챗 기록 중 하나에 대한 상세 정보를 가져오는 api
export const getSpecifyCoffeeChat = async ({
  coffectId,
}: {
  coffectId: number;
}): Promise<getSpecifyCoffeeChatType["success"]> => {
  try {
    const res = await axiosInstance.get<getSpecifyCoffeeChatType>(
      "/home/getSpecifyCoffeeChat",
      {
        params: {
          coffectId: coffectId,
        },
      },
    );
    return res.data.success;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("API 호출 중 에러 발생:", axiosError.response?.data);
    throw new Error("커피챗 상세 정보를 불러오는데 실패했습니다.");
  }
};
