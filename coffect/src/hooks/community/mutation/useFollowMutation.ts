// useFollowMutation.ts
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { postFollow } from "@/api/community/followApi";
import type { FollowRequest } from "@/types/community/followTypes";
import type { PostThreadsFilterResponse } from "@/types/community/postTypes";
import { QUERY_KEYS } from "@/constants/queryKey";

export const useFollowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number) => {
      const params: FollowRequest = { oppentUserId: userId };
      return postFollow(params);
    },

    onMutate: async (userId: number) => {
      // await queryClient.cancelQueries({ queryKey: ["community", "posts"] });
      //'community', 'posts' 키로 시작하는 모든 쿼리를 취소
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.COMMUNITY.POSTS,
      });

      // 이전 데이터를 가져옴옴.
      const previousData = queryClient.getQueriesData<
        InfiniteData<PostThreadsFilterResponse>
      >({
        // queryKey: ["community", "posts"]
        queryKey: QUERY_KEYS.COMMUNITY.POSTS,
      });

      // 쿼리 데이터를 업데이트하여 팔로우 상태를 반전시킴 (낙관적 업뎃)
      queryClient.setQueriesData<InfiniteData<PostThreadsFilterResponse>>(
        { queryKey: QUERY_KEYS.COMMUNITY.POSTS },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              if (!page.success) return page;

              return {
                ...page,
                success: {
                  ...page.success,
                  thread: (page.success.thread ?? []).map((t) =>
                    t.userId === userId
                      ? { ...t, isFollowing: !t.isFollowing }
                      : t,
                  ),
                },
              };
            }),
          };
        },
      );

      return { previousData };
    },

    onError: (err, _variables, context) => {
      console.error("팔로우 요청 실패:", err);
      // 실패 시 이전 데이터를 복원
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    // 서버 데이터와 동기화를 위해 관련 쿼리를 무효화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMUNITY.POSTS });
      queryClient.invalidateQueries({ queryKey: ["bookMark"] });
      queryClient.invalidateQueries({ queryKey: ["isFollow"] });
      queryClient.invalidateQueries({ queryKey: ["profileThreadSearch"] });
    },
  });
};
