import type {
  LikeRequest,
  LikeResponse,
  ScrapRequest,
  ScrapResponse,
} from "@/types/community/threadInteractionTypes";
import { axiosInstance } from "../axiosInstance";
export const postScrap = async (
  scrap: ScrapRequest,
): Promise<ScrapResponse> => {
  try {
    const response = await axiosInstance.post<ScrapResponse>(
      "/thread/scrap",
      null, // body는 없음
      { params: { threadId: scrap.threadId } }, // query string에 추가
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching scrap:", error);
    throw error;
  }
};

export const postLike = async (like: LikeRequest): Promise<LikeResponse> => {
  try {
    const response = await axiosInstance.post<LikeResponse>(
      "/thread/like",
      null, // body는 없음
      { params: { threadId: like.threadId } },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching like:", error);
    throw error;
  }
};
