/**
 * @author 흥부/강신욱
 * @description 게시글 상세 페이지 데이터 로직을 관리하는 커스텀 훅
 *               react-query를 사용하여 게시글 상세 정보를 비동기적으로 가져옵니다.
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

export const usePostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const postId = id;

  const isPostIdValid = typeof postId === "string" && postId.length > 0;

  // useQuery의 제네릭 타입을 <API응답, 에러, 선택된데이터> 순으로 지정할 수 있습니다.
  // 여기서는 선택된 데이터가 { post: GetThreadLookUpResponse | null, timeAgo: string } 형태가 됩니다.
  const {
    data: selectedData, // 반환된 data의 이름을 selectedData로 명명하여 명확성을 높임
    isLoading,
    error,
  } = useQuery({
    queryKey: ["postDetail", postId],
    queryFn: () => getPostDetail({ threadId: postId as string }),
    enabled: isPostIdValid,

    /**
     * `select` 옵션: API 원본 데이터에서 필요한 값을 추출하거나 가공합니다.
     * - 이 함수는 데이터가 성공적으로 fetch되었을 때만 호출됩니다.
     * - 여기서 반환된 값은 `useQuery`의 `data` 속성이 됩니다.
     * - `select`를 통해 반환된 데이터가 이전과 동일하면 컴포넌트 리렌더링을 방지합니다.
     */
    select: (data: GetThreadLookUpResponse) => {
      const post = data.success || null;

      // 게시글이 없으면 null과 빈 문자열을 반환합니다.
      if (!post) {
        return { post: null, timeAgo: "" };
      }

      // 게시글 작성 시간으로부터 현재까지의 경과 시간을 계산합니다.
      const timeAgo = getTimeAgo(post.createdAt);

      // 컴포넌트에서 사용할 최종 데이터 형태로 만들어 반환합니다.
      return { post, timeAgo };
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
