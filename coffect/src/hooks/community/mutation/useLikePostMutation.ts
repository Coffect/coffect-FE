// hooks/community/mutation/useLikePostMutation.ts
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { postLike } from "@/api/community/interactionApi";
import type { PostThreadsFilterResponse } from "@/types/community/postTypes";

export const useLikePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (threadId: string) => postLike({ threadId }),

    onMutate: async (threadId) => {
      await queryClient.cancelQueries({ queryKey: ["community", "posts"] });

      const previousData = queryClient.getQueryData<
        InfiniteData<PostThreadsFilterResponse>
      >(["community", "posts"]);

      queryClient.setQueryData<InfiniteData<PostThreadsFilterResponse>>(
        ["community", "posts"],
        (old) => {
          if (!old) return old;
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

      return { previousData };
    },

    onError: (_err, _threadId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["community", "posts"], context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["community", "posts"] });
      queryClient.invalidateQueries({ queryKey: ["bookMark"] });
      queryClient.invalidateQueries({ queryKey: ["profileThread"] });
      queryClient.invalidateQueries({ queryKey: ["profileThreadSearch"] });
    },
  });
};
