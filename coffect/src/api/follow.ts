import { axiosInstance } from "@/api/axiosInstance";
import type {
  CountFollowRequest,
  CountFollowResponse,
} from "@/types/follow/countFollow";
import type {
  ListUpFollowerRequest,
  ListUpFollowerResponse,
  ListUpFollowingRequest,
  ListUpFollowingResponse,
} from "@/types/follow/listUpFollow";
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

export const getListUpFollower = async (
  params: ListUpFollowerRequest,
): Promise<ListUpFollowerResponse> => {
  try {
    const response = await axiosInstance.get<ListUpFollowerResponse>(
      "/follow/listUpFollower",
      {
        params,
      },
    );
    return response.data;
  } catch (error) {
    console.error("API 호출 중 에러 발생:", error);
    throw new Error("팔로우 여부를 확인할 수 없습니다. 다시 시도해주세요.");
  }
};

export const getListUpFollowing = async (
  params: ListUpFollowingRequest,
): Promise<ListUpFollowingResponse> => {
  try {
    const response = await axiosInstance.get<ListUpFollowingResponse>(
      "/follow/listUpFollowing",
      {
        params,
      },
    );
    return response.data;
  } catch (error) {
    console.error("API 호출 중 에러 발생:", error);
    throw new Error("팔로우 여부를 확인할 수 없습니다. 다시 시도해주세요.");
  }
};

export const getCountFollow = async (
  params: CountFollowRequest,
): Promise<CountFollowResponse> => {
  try {
    const response = await axiosInstance.get<CountFollowResponse>(
      "/follow/showUpFollowCount",
      {
        params,
      },
    );
    return response.data;
  } catch (error) {
    console.error("API 호출 중 에러 발생:", error);
    throw new Error("팔로우 여부를 확인할 수 없습니다. 다시 시도해주세요.");
  }
};
