import { axiosInstance } from "../axiosInstance";
import type {
  LikeRequest,
  LikeResponse,
  ScrapRequest,
  ScrapResponse,
} from "@/types/community/threadInteractionTypes";

export const postLike = async (like: LikeRequest): Promise<LikeResponse> => {
  try {
    const response = await axiosInstance.post<LikeResponse>("/thread/like", {
      params: { threadId: like.threadId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching like:", error);
    throw error;
  }
};

export const postScrap = async (
  scrap: ScrapRequest,
): Promise<ScrapResponse> => {
  try {
    const response = await axiosInstance.post<ScrapResponse>("/thread/scrap", {
      params: { threadId: scrap.threadId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching like:", error);
    throw error;
  }
};
