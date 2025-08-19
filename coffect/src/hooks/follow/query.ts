import {
  useInfiniteQuery,
  useQuery,
  type InfiniteData,
} from "@tanstack/react-query";

import {
  getCountFollow,
  getListUpFollower,
  getListUpFollowing,
} from "@/api/follow";

import { QUERY_KEYS } from "@/constants/queryKey";

import type {
  ListUpFollowerRequest,
  ListUpFollowerResponse,
  ListUpFollowingRequest,
  ListUpFollowingResponse,
} from "@/types/follow/listUpFollow";

import type {
  CountFollowRequest,
  CountFollowResponse,
} from "@/types/follow/countFollow";

export const useFollowingListQuery = (
  params: Omit<ListUpFollowerRequest, "idCursor">,
) => {
  return useInfiniteQuery<
    ListUpFollowerResponse,
    Error,
    InfiniteData<ListUpFollowerResponse>,
    ReturnType<typeof QUERY_KEYS.USER.FOLLOWERS>,
    number | undefined
  >({
    queryKey: QUERY_KEYS.USER.FOLLOWERS(params.oppentUserId),
    queryFn: ({ pageParam = undefined }) =>
      getListUpFollower({ ...params, idCursor: pageParam }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      const lastItem = lastPage.success?.[lastPage.success.length - 1];
      return lastItem ? lastItem.idCursor : undefined;
    },
  });
};

export const useFollowerListQuery = (
  params: Omit<ListUpFollowingRequest, "idCursor">,
) => {
  return useInfiniteQuery<
    ListUpFollowingResponse,
    Error,
    InfiniteData<ListUpFollowingResponse>,
    ReturnType<typeof QUERY_KEYS.USER.FOLLOWING>,
    number | undefined
  >({
    queryKey: QUERY_KEYS.USER.FOLLOWING(params.oppentUserId),
    queryFn: ({ pageParam = undefined }) =>
      getListUpFollowing({ ...params, idCursor: pageParam }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      const lastItem = lastPage.success?.[lastPage.success.length - 1];
      return lastItem ? lastItem.idCursor : undefined;
    },
  });
};

export const useFollowCountQuery = (params: CountFollowRequest) => {
  return useQuery<CountFollowResponse, Error>({
    queryKey: QUERY_KEYS.USER.FOLLOW_COUNT(params.userId),
    queryFn: () => getCountFollow(params),
  });
};
