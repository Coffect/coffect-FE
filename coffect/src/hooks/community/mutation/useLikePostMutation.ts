// hooks/community/mutation/useLikePostMutation.ts
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { postLike } from "@/api/community/interactionApi";
import type {
  GetThreadLookUpResponse,
  PostThreadsFilterResponse,
} from "@/types/community/postTypes";
import { QUERY_KEYS } from "@/constants/queryKey";

export const useLikePostMutation = () => {
  const queryClient = useQueryClient();

  const isInfiniteData = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
  ): data is InfiniteData<PostThreadsFilterResponse> => {
    return data && typeof data === "object" && "pages" in data;
  };

  return useMutation({
    mutationFn: (threadId: string) => postLike({ threadId }),

    onMutate: async (threadId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.COMMUNITY.POSTS });
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.COMMUNITY.POST_DETAIL(threadId),
      });

      const previousData = queryClient.getQueriesData<
        InfiniteData<PostThreadsFilterResponse>
      >({
        queryKey: QUERY_KEYS.COMMUNITY.POSTS,
      });

      const previousDetailData =
        queryClient.getQueryData<GetThreadLookUpResponse>(
          QUERY_KEYS.COMMUNITY.POST_DETAIL(threadId),
        );

      queryClient.setQueriesData<InfiniteData<PostThreadsFilterResponse>>(
        { queryKey: QUERY_KEYS.COMMUNITY.POSTS },
        (old) => {
          if (!isInfiniteData(old)) return old;
          return {
            ...old,
            pages: old.pages.map((page) => {
              if (!page.success) return page;
              return {
                ...page,
                success: {
                  ...page.success,
                  thread: page.success.thread.map((t) =>
                    t.threadId === threadId
                      ? {
                          ...t,
                          isLiked: !t.isLiked,
                          likeCount: t.isLiked
                            ? t.likeCount - 1
                            : t.likeCount + 1,
                        }
                      : t,
                  ),
                },
              };
            }),
          };
        },
      );
      queryClient.setQueryData<GetThreadLookUpResponse>(
        QUERY_KEYS.COMMUNITY.POST_DETAIL(threadId),
        (old) => {
          if (!old || !old.success) return old;
          return {
            ...old,
            success: {
              ...old.success,
              isLiked: !old.success.isLiked,
              likeCount: old.success.isLiked
                ? old.success.likeCount - 1
                : old.success.likeCount + 1,
            },
          };
        },
      );

      return { previousData, previousDetailData };
    },

    onError: (_err, _threadId, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      if (context?.previousDetailData) {
        queryClient.setQueryData(
          QUERY_KEYS.COMMUNITY.POST_DETAIL(_threadId),
          context.previousDetailData,
        );
      }
    },

    onSettled: (_data, _error, threadId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMUNITY.POSTS });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COMMUNITY.POST_DETAIL(threadId),
      });
      queryClient.invalidateQueries({ queryKey: ["bookMark"] });
      queryClient.invalidateQueries({ queryKey: ["profileThread"] });
      queryClient.invalidateQueries({ queryKey: ["profileThreadSearch"] });
    },
  });
};
