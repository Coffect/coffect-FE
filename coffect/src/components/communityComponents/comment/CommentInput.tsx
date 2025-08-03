/**
 * @author: 흥부/강신욱
 * @description: 댓글 입력을 위한 컴포넌트
 * @version: 1.1.0
 * @date: 2025-08-03
 * @remarks
 * - 1.1.0: 기존 useComments 훅을 제거하고, react-query의 useAddComment 훅을 사용하도록 리팩토링.
 *          로컬 상태(useState)로 입력 값을 관리하고, mutate 함수로 댓글을 추가.
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
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useAutoResizeTextarea(textareaRef.current, content);

  // 2. 댓글 추가를 위한 mutation 훅 사용 (서버 상태)
  const { mutate: addComment, isPending } = useAddComment();

  // 3. 댓글 등록 버튼 클릭 시 실행될 핸들러
  const handlePostComment = () => {
    // postId가 없거나, 내용이 비어있거나, 이미 요청 중이면 실행하지 않음
    if (!postId || content.trim() === "" || isPending) return;

    // useAddComment 훅에서 반환된 mutate 함수를 호출
    addComment(
      { postId, content },
      {
        // mutate 실행 후 추가적인 콜백도 가능
        onSuccess: () => {
          // 성공 시 입력 필드 초기화
          setContent("");
        },
        onError: (error) => {
          // 실패 시 사용자에게 알림
          alert(`댓글 작성에 실패했습니다: ${error.message}`);
        },
      },
    );
  };

  return (
    <div className="flex w-full flex-shrink-0 items-center gap-3 bg-white">
      <img
        src="https://via.placeholder.com/40" // 현재 사용자 프로필 이미지로 교체 필요
        alt="CurrentUser"
        className="h-10 w-10 rounded-full"
      />
      <div className="relative flex-grow justify-center">
        <textarea
          ref={textareaRef}
          placeholder="댓글을 남겨보세요."
          className="scrollbar-hide max-h-24 w-full resize-none overflow-hidden rounded-2xl bg-[var(--gray-5)] py-3 pr-17 pl-5 focus:outline-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={1}
          disabled={isPending} // 요청 중에는 입력 비활성화
        />
        {content.trim() && (
          <button
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-[var(--design-text)] px-4.5 py-1.5 text-white disabled:bg-gray-300"
            onClick={handlePostComment}
            disabled={isPending} // 요청 중에는 버튼 비활성화
          >
            {isPending ? "..." : <Send className="h-5 w-5" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentInput;