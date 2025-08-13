import type {
  FollowRequest,
  FollowResponse,
} from "@/types/community/followTypes";
import { axiosInstance } from "../axiosInstance";

export const postFollow = async (
  params: FollowRequest,
): Promise<FollowResponse> => {
  try {
    const response = await axiosInstance.post<FollowResponse>(
      "/follow/followRequest",
      params,
    );
    if (
      response.data.resultType === "FAIL" &&
      response.data.error?.errorCode === "FE401"
    ) {
      alert("자기 자신을 팔로우 할 수 없습니다!");
      throw new Error("자기 자신 팔로우 시도");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};
