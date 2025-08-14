// useFollowMutation.ts
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { postFollow } from "@/api/community/followApi";
import type { FollowRequest } from "@/types/community/followTypes";
import type { PostThreadsFilterResponse } from "@/types/community/postTypes";

export const useFollowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number) => {
      const params: FollowRequest = { oppentUserId: userId };
      return postFollow(params);
    },

    onMutate: async (userId: number) => {
      await queryClient.cancelQueries({ queryKey: ["community", "posts"] });

      const previousData = queryClient.getQueriesData<
        InfiniteData<PostThreadsFilterResponse>
      >({
        queryKey: ["community", "posts"],
      });

      queryClient.setQueriesData<InfiniteData<PostThreadsFilterResponse>>(
        { queryKey: ["community", "posts"] },
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
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["community", "posts"] });
      queryClient.invalidateQueries({ queryKey: ["bookMark"] });
      queryClient.invalidateQueries({ queryKey: ["isFollow"] });
      queryClient.invalidateQueries({ queryKey: ["profileThreadSearch"] });
    },
  });
};
