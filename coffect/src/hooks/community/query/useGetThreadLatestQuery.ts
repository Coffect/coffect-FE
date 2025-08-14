/**
 * @file useGetThreadLatestQuery.ts
 * @description 최신순 게시글 목록을 무한 스크롤로 조회하는 API(getThreadLatest)를 위한 react-query 커스텀 훅입니다.
 *              - `useInfiniteQuery`를 사용하여 서버 상태(게시글 데이터)를 관리합니다.
 *              - 데이터 캐싱, 로딩, 에러 상태 처리를 자동으로 수행합니다.
 */

import { useInfiniteQuery } from "@tanstack/react-query";
import { getThreadLatest } from "@/api/community/postApi";
import type { GetThreadLatestResponse } from "@/types/community/postTypes";

/**
 * @constant QUERY_KEY
 * @description react-query가 이 쿼리를 식별하고 캐시를 관리하기 위한 고유 키입니다.
 */
const QUERY_KEY = ["community", "posts"];

/**
 * @function useGetThreadLatestQuery
 * @description 최신순 게시글 목록 데이터를 무한 스크롤로 가져오는 커스텀 훅
 * @returns useInfiniteQuery의 결과 객체 ({ data, fetchNextPage, hasNextPage, ... })
 */
export const useGetThreadLatestQuery = ({
  enabled,
}: { enabled?: boolean } = {}) => {
  return useInfiniteQuery<GetThreadLatestResponse, Error>({
    queryKey: QUERY_KEY,
    queryFn: ({ pageParam }) =>
      getThreadLatest({ dateCursor: pageParam as string | undefined }),
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
