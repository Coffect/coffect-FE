/**
 * @file useGetCommunityPostsQuery.ts
 * @description 커뮤니티 게시글 목록을 정렬 및 필터링하여 무한 스크롤로 조회하는 통합 쿼리 훅입니다.
 */

import { useInfiniteQuery } from "@tanstack/react-query";
import { postThreadsFilter } from "@/api/community/postApi";
import type {
  PostThreadsFilterResponse,
  PostThreadsFilterRequest,
} from "@/types/community/postTypes";
import { QUERY_KEYS } from "@/constants/queryKey";

export const useGetCommunityPostsQuery = (
  params: PostThreadsFilterRequest,
  { enabled }: { enabled?: boolean } = {},
) => {
  return useInfiniteQuery<PostThreadsFilterResponse, Error>({
    queryKey: QUERY_KEYS.COMMUNITY.POSTS_FILTERED(params),
    queryFn: ({ pageParam }) =>
      postThreadsFilter({
        ...params,
        dateCursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.success && lastPage.success.nextCursor !== -1) {
        return lastPage.success.nextCursor;
      }

      return undefined;
    },

    enabled,
  });
};
