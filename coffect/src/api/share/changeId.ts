import type { getChangeIdResponse } from "@/types/share/changeId";
import { axiosInstance } from "../axiosInstance";

export const getChangeId = async (
  userId: number,
): Promise<getChangeIdResponse> => {
  try {
    const { data } = await axiosInstance.post<getChangeIdResponse>(
      "/profile/id",
      {
        userId: userId,
      },
    );
    return data;
  } catch (error) {
    console.error("API 호출 중 에러 발생:", error);
    throw Error("아이디를 조회할 수 없습니다. 다시 시도해주세요");
  }
};
