import { uploadPost } from "@/api/community/writeApi";
import { QUERY_KEYS } from "@/constants/queryKey";
import type {
  // postUploadRequest,
  postUploadResponse,
} from "@/types/community/writePostTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<postUploadResponse, Error, FormData>({
    mutationFn: uploadPost,
    onSuccess: (response) => {
      if (response.success) {
        console.log("포스트가가 성공적으로 추가되었습니다.", response.success);

        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.COMMUNITY.POSTS,
        });
      } else {
        console.error(
          "댓글 추가 API는 성공했으나, 서버에서 에러를 반환했습니다:",
          response.error,
        );
      }
    },
    onError: (error) => {
      console.error("댓글 추가 중 에러가 발생했습니다:", error);
    },
  });
};
