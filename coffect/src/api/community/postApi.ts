/**
 * @file postApi.ts
 * @description 커뮤니티 게시글과 관련된 API 함수들을 정의합니다.
 *              - 모든 함수는 axiosInstance를 사용하여 API 요청을 보냅니다.
 *              - 각 함수는 `postTypes.ts`에서 정의한 타입을 파라미터 및 반환 값으로 사용합니다.
 */

import { axiosInstance } from "../axiosInstance";
import type {
  PostPostsRequest,
  PostPostsResponse,
  GetThreadLookUpRequest,
  GetThreadLookUpResponse,
} from "@/types/community/postTypes";

/**
 * @function getPosts
 * @description 서버에 게시글 목록을 요청하는 API 함수입니다.
 * @param params - 페이지 번호, 사이즈, 정렬 기준 등 요청 파라미터 객체
 * @returns Promise<GetPostsResponse> - 게시글 목록과 페이징 정보를 포함하는 Promise 객체
 */
export const getPosts = async (
  params: PostPostsRequest,
): Promise<PostPostsResponse> => {
  const response = await axiosInstance.post<PostPostsResponse>(
    "/thread/main",
    params,
  );
  return response.data;
};

/**
 * @function getPostDetail
 * @description 특정 게시글의 상세 정보를 요청하는 API 함수입니다.
 * @param params - 조회할 게시글의 threadId를 포함하는 객체
 * @returns Promise<GetThreadLookUpResponse> - 게시글 상세 정보를 포함하는 Promise 객체
 */
export const getPostDetail = async (
  params: GetThreadLookUpRequest,
): Promise<GetThreadLookUpResponse> => {
  // GET 요청 시에는 params를 URL 쿼리 스트링으로 전달합니다.
  const response = await axiosInstance.get<GetThreadLookUpResponse>(
    "/thread/lookUp",
    {
      params: { threadId: params.threadId },
    },
  );
  return response.data;
};
