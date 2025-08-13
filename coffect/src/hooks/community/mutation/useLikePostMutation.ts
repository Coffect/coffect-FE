import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLike } from "@/api/community/interactionApi";
import type { InfiniteData } from "@tanstack/react-query";
import type { PostThreadsFilterResponse } from "@/types/community/postTypes";

export const useLikePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (threadId: string) => postLike({ threadId }),
    onMutate: async (threadId) => {
      await queryClient.cancelQueries({ queryKey: ["communityPosts"] });

      const previousData = queryClient.getQueryData<
        InfiniteData<PostThreadsFilterResponse>
      >(["communityPosts"]);

      queryClient.setQueryData<InfiniteData<PostThreadsFilterResponse>>(
        ["communityPosts"],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => {
              if (!page.success) return page; // null 방어
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
        queryClient.setQueryData(["communityPosts"], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
    },
  });
};
