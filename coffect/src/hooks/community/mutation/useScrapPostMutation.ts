import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { postScrap } from "@/api/community/interactionApi";
import type { PostThreadsFilterResponse } from "@/types/community/postTypes";

export const useScrapPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (threadId: string) => postScrap({ threadId }),

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
              if (!page.success) return page;
              return {
                ...page,
                success: {
                  ...page.success,
                  thread: page.success.thread.map((t) =>
                    t.threadId === threadId
                      ? { ...t, isScraped: !t.isScraped }
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
