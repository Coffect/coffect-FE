// import {
//   useMutation,
//   useQueryClient,
//   type InfiniteData,
// } from "@tanstack/react-query";
// import { postLike, postScrap } from "@/api/community/threadInteractionApi";
// import type {
//   PostThreadsFilterResponse,
//   ThreadSummary,
// } from "@/types/community/postTypes";
// import type {
//   LikeRequest,
//   ScrapRequest,
// } from "@/types/community/threadInteractionTypes";

// type InteractionType = "like" | "scrap";

// export const useThreadInteractionMutation = (type: InteractionType) => {
//   const queryClient = useQueryClient();

//   const mutationFn =
//     type === "like"
//       ? (req: LikeRequest) => postLike(req)
//       : (req: ScrapRequest) => postScrap(req);

//   return useMutation({
//     mutationFn,

//     onMutate: async (variables: LikeRequest | ScrapRequest) => {
//       const threadId = variables.threadId;

//       await queryClient.cancelQueries({ queryKey: ["community", "posts"] });

//       const previousData = queryClient.getQueriesData<
//         InfiniteData<PostThreadsFilterResponse>
//       >({
//         queryKey: ["community", "posts"],
//       });

//       queryClient.setQueriesData<InfiniteData<PostThreadsFilterResponse>>(
//         { queryKey: ["community", "posts"] },
//         (oldData) => {
//           if (!oldData) return oldData;

//           return {
//             ...oldData,
//             pages: oldData.pages.map((page) => {
//               if (!page.success?.thread) return page;

//               return {
//                 ...page,
//                 success: {
//                   ...page.success,
//                   thread: page.success.thread.map((t: ThreadSummary) => {
//                     if (t.threadId !== threadId) return t;

//                     if (type === "like") {
//                       return {
//                         ...t,
//                         isLiked: !t.isLiked,
//                         likeCount: t.isLiked
//                           ? t.likeCount - 1
//                           : t.likeCount + 1,
//                       };
//                     } else {
//                       return {
//                         ...t,
//                         isScrapped: !t.isScraped,
//                       };
//                     }
//                   }),
//                 },
//               };
//             }),
//           };
//         },
//       );

//       return { previousData };
//     },

//     onError: (err, _variables, context) => {
//       console.error(`${type} 요청 실패:`, err);
//       if (context?.previousData) {
//         context.previousData.forEach(([key, data]) => {
//           queryClient.setQueryData(key, data);
//         });
//       }
//     },

//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ["community", "posts"] });
//     },
//   });
// };
