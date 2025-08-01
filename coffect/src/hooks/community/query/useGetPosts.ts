/**
 * @file useGetPosts.ts
 * @description 게시글 목록을 조회하는 API(getPosts)를 위한 react-query 커스텀 훅입니다.
 *              - `useQuery`를 사용하여 서버 상태(게시글 데이터)를 관리합니다.
 *              - 데이터 캐싱, 로딩, 에러 상태 처리를 자동으로 수행합니다.
 */

import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/api/community/postApi";
import type {
  PostPostsRequest,
  PostPostsResponse,
} from "@/types/community/postTypes";

/**
 * @constant QUERY_KEY
 * @description react-query가 이 쿼리를 식별하고 캐시를 관리하기 위한 고유 키입니다.
 *              - 요청 파라미터(params)가 변경될 때마다 쿼리를 다시 실행하기 위해 키에 포함시킵니다.
 */
const QUERY_KEY = ["community", "posts"];

/**
 * @function useGetPosts
 * @description 게시글 목록 데이터를 가져오는 커스텀 훅
 * @param params - API 요청에 필요한 파라미터 (예: 페이지 번호, 정렬 기준, 필터링 조건 등)
 * @returns useQuery의 결과 객체 ({ data, isLoading, isError, error, ... })
 */
export const useGetPosts = (params: PostPostsRequest) => {
  return useQuery<PostPostsResponse, Error>({
    // 성공 시 데이터 타입, 실패 시 에러 타입
    // queryKey는 쿼리를 고유하게 식별합니다.
    // params가 바뀔 때마다 새로운 쿼리로 인식하여 데이터를 다시 가져옵니다.
    queryKey: [...QUERY_KEY, params],

    // queryFn은 실제로 데이터를 가져오는 비동기 함수입니다.
    // react-query는 이 함수가 반환하는 Promise를 관리합니다.
    queryFn: () => getPosts(params),

    // useQuery의 추가 옵션들 (필요에 따라 사용)
    // enabled: 특정 조건이 만족될 때만 쿼리를 실행하고 싶을 때 사용합니다.
    // staleTime: 데이터가 fresh 상태로 유지되는 시간. 이 시간 동안에는 데이터를 다시 가져오지 않습니다.
    // gcTime: 데이터가 캐시에서 제거되기까지의 시간.
  });
};
