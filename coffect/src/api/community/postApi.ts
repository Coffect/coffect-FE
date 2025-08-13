/**
 * @file postApi.ts
 * @description 커뮤니티 게시글과 관련된 API 함수들을 정의합니다.
 *              - 모든 함수는 axiosInstance를 사용하여 API 요청을 보냅니다.
 *              - 각 함수는 `postTypes.ts`에서 정의한 타입을 파라미터 및 반환 값으로 사용합니다.
 * @version 1.0.0
 * @date 2025-08-01
 * @remarks
 * - 1.0.0: 게시글 목록 조회(getPosts) 및 게시글 상세 조회(getPostDetail) API 함수 구현
 */

import { axiosInstance } from "@/api/axiosInstance";
import type {
  PostThreadsFilterRequest,
  PostThreadsFilterResponse,
  GetThreadLookUpRequest,
  GetThreadLookUpResponse,
  GetThreadLatestRequest,
  GetThreadLatestResponse,
} from "@/types/community/postTypes";

/**
 * @function getThreadLatest
 * @description 최신순으로 게시글을 요청하는 API 함수입니다.
 */
export const getThreadLatest = async (
  params: GetThreadLatestRequest,
): Promise<GetThreadLatestResponse> => {
  const response = await axiosInstance.get<GetThreadLatestResponse>(
    "/thread/latest",
    {
      params,
    },
  );
  return response.data;
};

/**
 * @function postThreadsFilter
 * @description 서버에 필터 처리된 게시글을 요청하는 API 함수입니다.
 */
export const postThreadsFilter = async (
  params: PostThreadsFilterRequest,
): Promise<PostThreadsFilterResponse> => {
  try {
    const response = await axiosInstance.post<PostThreadsFilterResponse>(
      "/thread/main",
      params,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching filtered threads:", error);
    throw error;
  }
};

/**
 * @function getPostDetail
 * @description 특정 게시글의 상세 정보를 요청하는 API 함수입니다.
 */
export const getPostDetail = async (
  params: GetThreadLookUpRequest,
): Promise<GetThreadLookUpResponse> => {
  try {
    const response = await axiosInstance.get<GetThreadLookUpResponse>(
      "/thread/lookUp",
      {
        params: { threadId: params.threadId },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching post detail:", error);
    throw error;
  }
};
