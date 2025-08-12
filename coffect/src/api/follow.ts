import { axiosInstance } from "@/api/axiosInstance";
import type {
  getIsFollowType,
  postFollowRequestType,
} from "@/types/mypage/follow";

export const getIsFollow = async (userId: number): Promise<getIsFollowType> => {
  try {
    const res = await axiosInstance.get<getIsFollowType>("/follow/isfollow", {
      params: { oppentUserId: userId },
    });
    return res.data;
  } catch (error) {
    console.error("API 호출 중 에러 발생:", error);
    throw new Error("팔로우 여부를 확인할 수 없습니다. 다시 시도해주세요.");
  }
};

export const postFollowRequest = async (
  userId: number,
): Promise<postFollowRequestType> => {
  try {
    const res = await axiosInstance.post<postFollowRequestType>(
      `/follow/followRequest`,
      {
        oppentUserId: userId,
      },
    );
    return res.data;
  } catch (error) {
    console.error("API 호출 중 에러 발생:", error);
    throw new Error("팔로우 요청을 보낼 수 없습니다. 다시 시도해주세요.");
  }
};
