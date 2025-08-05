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
import { useAddComment } from "@/hooks/community/mutation/useAddComment";
import { Send } from "lucide-react";
import useAutoResizeTextarea from "@/hooks/useAutoResizeTextarea";

interface CommentInputProps {
  postId?: string;
}

const CommentInput = ({ postId }: CommentInputProps) => {
  // 1. 댓글 입력을 위한 로컬 상태 (UI 상태)
  // API 명세와 일관성을 맞추기 위해 변수명을 commentBody로 변경합니다.
  const [commentBody, setCommentBody] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useAutoResizeTextarea(textareaRef.current, commentBody);

  // 2. 댓글 추가를 위한 mutation 훅 사용 (서버 상태)
  // isPending은 mutation이 진행 중인지를 나타내는 boolean 값입니다.
  const { mutate: addComment, isPending } = useAddComment();

  // 3. 댓글 등록 버튼 클릭 시 실행될 핸들러
  const handlePostComment = () => {
    // postId가 없거나, 댓글 내용이 비어있거나, 이미 전송 중이면 함수를 종료합니다.
    if (!postId || commentBody.trim() === "" || isPending) return;

    // useAddComment 훅에서 반환된 mutate 함수(addComment)를 호출하여 서버에 댓글을 전송합니다.
    addComment(
      {
        threadId: postId, // 현재 게시글의 ID
        commentBody: commentBody, // 사용자가 입력한 댓글 내용
        quote: 0, // 현재는 일반 댓글만 지원하므로 0으로 고정합니다.
      },
      {
        // mutate 실행 후 추가적인 콜백을 정의할 수 있습니다.
        onSuccess: (response) => {
          // API 응답이 성공적일 경우에만 입력 필드를 초기화합니다.
          if (response.resultType === "success") {
            console.log("댓글 작성 성공:", response.success);
            setCommentBody("");
          }
        },
        onError: (error) => {
          // 네트워크 오류 등 mutation 자체의 실패 시 사용자에게 알림을 줍니다.
          alert(`댓글 작성에 실패했습니다: ${error.message}`);
        },
      },
    );
  };

  return (
    <div className="flex w-full flex-shrink-0 items-center gap-3 bg-white">
      <img
        src="https://via.placeholder.com/40" // TODO: 현재 사용자 프로필 이미지로 교체 필요
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
          disabled={isPending} // 댓글 전송 중에는 입력 비활성화
        />
        {commentBody.trim() && (
          <button
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-[var(--design-text)] px-4.5 py-1.5 text-white disabled:bg-gray-300"
            onClick={handlePostComment}
            disabled={isPending} // 댓글 전송 중에는 버튼 비활성화
          >
            {/* isPending 상태에 따라 버튼 내용을 변경하여 사용자에게 시각적 피드백을 줍니다. */}
            {isPending ? "..." : <Send className="h-5 w-5" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentInput;
