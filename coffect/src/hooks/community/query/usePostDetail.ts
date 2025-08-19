/**
 * @author 흥부/강신욱
 * @description 게시글 상세 페이지 데이터 로직을 관리하는 커스텀 훅
 *               react-query를 사용하여 게시글 상세 정보를 비동기적으로 가져옵니다.ddddd
 * @version 1.2.0
 * @date 2025-08-02
 * @remarks
 * - 1.1.0: 댓글 데이터를 불러오는 로직을 분리하여 게시글 상세 정보만 책임지도록 수정.
 * - 1.2.0: `useQuery`의 `select` 옵션을 활용하여 데이터 가공 로직을 중앙화하고 렌더링 최적화.
 */

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPostDetail } from "@/api/community/postApi";
import { getTimeAgo } from "@/utils/dateUtils";
import type { GetThreadLookUpResponse } from "@/types/community/postTypes";
import { QUERY_KEYS } from "@/constants/queryKey";

export const usePostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const postId = id;

  const isPostIdValid = typeof postId === "string" && postId.length > 0;

  const {
    data: selectedData,
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.COMMUNITY.POST_DETAIL(postId),
    queryFn: () => getPostDetail({ threadId: postId as string }),
    enabled: isPostIdValid,

    select: (data: GetThreadLookUpResponse) => {
      const post = data.success || null;

      if (!post) {
        return { post: null, timeAgo: "" };
      }

      const timeAgo = getTimeAgo(post.createdAt);

      const transformedImages = post.images;

      return {
        post: {
          ...post,
          images: transformedImages,
        },
        timeAgo,
      };
    },
  });

  return {
    post: selectedData?.post || null,
    timeAgo: selectedData?.timeAgo || "",
    postId,
    isLoading,
    error,
  };
};
