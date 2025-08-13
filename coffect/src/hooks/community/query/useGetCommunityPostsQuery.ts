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

const QUERY_KEY = ["community", "posts"];

export const useGetCommunityPostsQuery = (
  params: PostThreadsFilterRequest,
  { enabled }: { enabled?: boolean } = {},
) => {
  return useInfiniteQuery<PostThreadsFilterResponse, Error>({
    // 필터 및 정렬 조건이 변경될 때마다 새로운 쿼리로 인식하도록 queryKey에 params를 포함합니다.
    queryKey: [...QUERY_KEY, params],
    queryFn: ({ pageParam }) =>
      postThreadsFilter({
        ...params,
        dateCursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      // 다음 페이지가 있는 경우, nextCursor 값을 반환합니다.
      if (lastPage.success && lastPage.success.nextCursor !== -1) {
        return lastPage.success.nextCursor;
      }
      // 다음 페이지가 없으면 undefined를 반환합니다.
      return undefined;
    },
    // Community.tsx에서 전달된 enabled 값으로 훅의 실행 여부를 제어합니다.
    enabled,
  });
};
