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
      // --- 1) community/posts 낙관적 업데이트 ---
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.COMMUNITY.POSTS });

      const previousPosts = queryClient.getQueriesData<
        InfiniteData<PostThreadsFilterResponse>
      >({ queryKey: QUERY_KEYS.COMMUNITY.POSTS });

      let isCurrentlyFollowing: boolean | undefined = undefined;

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
                  thread: (page.success.thread ?? []).map((t) => {
                    if (t.userId === userId) {
                      isCurrentlyFollowing = t.isFollowing; // 현재 상태 저장
                      return { ...t, isFollowing: !t.isFollowing };
                    }
                    return t;
                  }),
                },
              };
            }),
          };
        },
      );

      // --- 2) followCount 낙관적 업데이트 ---
      const prevFollowCount = queryClient.getQueryData<{
        followers: number;
        following: number;
      }>(QUERY_KEYS.USER.FOLLOW_COUNT(userId));

      queryClient.setQueryData<{ followers: number; following: number }>(
        QUERY_KEYS.USER.FOLLOW_COUNT(userId),
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            followers: isCurrentlyFollowing
              ? oldData.followers - 1 // 언팔 → -1
              : oldData.followers + 1, // 팔로우 → +1
          };
        },
      );

      return { previousPosts, prevFollowCount };
    },

    onError: (err, userId, context) => {
      console.error("팔로우 요청 실패:", err);

      // posts 롤백
      if (context?.previousPosts) {
        context.previousPosts.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }

      // followCount 롤백
      if (context?.prevFollowCount) {
        queryClient.setQueryData(
          QUERY_KEYS.USER.FOLLOW_COUNT(userId),
          context.prevFollowCount,
        );
      }
    },

    onSettled: (_data, _error, userId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMUNITY.POSTS });
      queryClient.invalidateQueries({ queryKey: ["bookMark"] });
      queryClient.invalidateQueries({ queryKey: ["isFollow"] });
      queryClient.invalidateQueries({ queryKey: ["profileThreadSearch"] });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER.FOLLOW_COUNT(userId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER.IS_FOLLOWING(userId),
      });

      // queryClient.invalidateQueries({
      //   queryKey: QUERY_KEYS.USER.PROFILE(),
      // });
    },
  });
};
