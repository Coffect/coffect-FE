import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { postScrap } from "@/api/community/interactionApi";
import type {
  GetThreadLookUpResponse,
  PostThreadsFilterResponse,
} from "@/types/community/postTypes";
import { QUERY_KEYS } from "@/constants/queryKey";

export const useScrapPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (threadId: string) => postScrap({ threadId }),

    onMutate: async (threadId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.COMMUNITY.POSTS });
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.COMMUNITY.POST_DETAIL(threadId),
      });

      const previousListData = queryClient.getQueriesData<
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
          if (!old || !("pages" in old)) return old;

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

      // 2. 게시글 상세 페이지 캐시 낙관적 업데이트
      queryClient.setQueryData<GetThreadLookUpResponse>(
        QUERY_KEYS.COMMUNITY.POST_DETAIL(threadId),
        (old) => {
          if (!old || !old.success) return old;
          return {
            ...old,
            success: {
              ...old.success,
              isScraped: !old.success.isScraped,
            },
          };
        },
      );

      // 롤백을 위해 이전 데이터 반환
      return { previousListData, previousDetailData };
    },

    onError: (_err, threadId, context) => {
      // 오류 발생 시 이전 데이터로 롤백
      if (context?.previousListData) {
        context.previousListData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      if (context?.previousDetailData) {
        queryClient.setQueryData(
          QUERY_KEYS.COMMUNITY.POST_DETAIL(threadId),
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
