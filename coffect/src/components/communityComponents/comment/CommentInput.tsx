/**
 * @author: 흥부/강신욱
 * @description: 댓글 입력을 위한 컴포넌트
 * @version: 1.1.0
 * @date: 2025-08-03
 * @version: 2.0.0
 * @date: 2025-08-05
 * @remarks
 * - 1.1.0: 기존 useComments 훅을 제거하고, react-query의 useAddComment 훅을 사용하도록 리팩토링.
 * - 2.0.0: API 타입 정의(postCommentRequest)에 맞춰 mutate 함수 호출 로직 수정.
 */
import { useState, useRef } from "react";
import { useAddCommentMutation } from "@/hooks/community/mutation/useAddCommentMutation";
import { Send } from "lucide-react";
import useAutoResizeTextarea from "@/hooks/useAutoResizeTextarea";

interface CommentInputProps {
  postId?: string;
  currentUserProfileImage?: string;
}

const CommentInput = ({
  postId,
  currentUserProfileImage,
}: CommentInputProps) => {
  const [commentBody, setCommentBody] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useAutoResizeTextarea(textareaRef.current, commentBody);

  const { mutate: addComment, isPending } = useAddCommentMutation();

  const handlePostComment = () => {
    if (!postId || commentBody.trim() === "" || isPending) return;

    addComment(
      {
        threadId: postId,
        commentBody: commentBody,
        quote: 0,
      },
      {
        onSuccess: (response) => {
          if (response.success) {
            console.log("댓글 작성 성공:", response.success);
            setCommentBody("");
          }
        },
        onError: (error) => {
          alert(`댓글 작성에 실패했습니다: ${error.message}`);
        },
      },
    );
  };

  return (
    <div className="flex w-full flex-shrink-0 items-center gap-3 bg-white">
      <img
        src={currentUserProfileImage}
        alt="CurrentUser"
        className="h-10 w-10 rounded-full"
      />
      <div className="relative flex-grow justify-center">
        <textarea
          ref={textareaRef}
          placeholder="댓글을 남겨보세요."
          className="scrollbar-hide max-h-24 w-full resize-none overflow-hidden rounded-2xl bg-[var(--gray-5)] py-3 pr-17 pl-5 focus:outline-none"
          value={commentBody}
          onChange={(e) => setCommentBody(e.target.value)}
          rows={1}
          disabled={isPending}
        />
        {commentBody.trim() && (
          <button
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-[var(--design-text)] px-4.5 py-1.5 text-white disabled:bg-gray-300"
            onClick={handlePostComment}
            disabled={isPending} // 댓글 전송 중에는 버튼 비활성화
          >
            {/* isPending 상태에 따라 버튼 내용을 변경하여 사용자에게 시각적 피드백을 줍니다. */}
            {isPending ? "전송중!" : <Send className="h-5 w-5" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentInput;
