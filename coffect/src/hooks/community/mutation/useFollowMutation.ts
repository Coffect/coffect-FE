import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postFollow } from "@/api/community/followApi"; // 올바른 API 경로 임포트
import type { FollowRequest } from "@/types/community/followTypes"; // 타입 임포트

/**
 * @description 팔로우 요청을 보내는 뮤테이션 훅 (낙관적 업데이트 적용)
 * @returns {object} useMutation 반환 객체
 */
export const useFollowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number) => {
      const params: FollowRequest = { oppentUserId: userId };
      return postFollow(params);
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["community"] });

      const previousFeed = queryClient.getQueryData(["community"]);

      return { previousFeed };
    },

    onError: (err, _variables, context) => {
      console.error("팔로우 요청 실패:", err);
      if (context?.previousFeed) {
        queryClient.setQueryData(["community"], context.previousFeed);
      }
      // alert("오류가 발생하여 팔로우 상태를 되돌립니다. 다시 시도해주세요.");
      console.error("팔로우 요청 중 오류 발생:", err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["community"] });
    },
  });
};
