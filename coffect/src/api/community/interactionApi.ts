import type {
  LikeRequest,
  LikeResponse,
  ScrapRequest,
  ScrapResponse,
} from "@/types/community/threadInteractionTypes";
import { axiosInstance } from "../axiosInstance";

export const postLike = async (params: LikeRequest): Promise<LikeResponse> => {
  try {
    const response = await axiosInstance.post<LikeResponse>(
      "/thread/like",
      params,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching likes:", error);
    throw error;
  }
};

export const postScrap = async (
  params: ScrapRequest,
): Promise<ScrapResponse> => {
  try {
    const response = await axiosInstance.post<ScrapResponse>(
      "/thread/scrap",
      params,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching scrap:", error);
    throw error;
  }
};
