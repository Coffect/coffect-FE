/**
 * @author: 흥부/강신욱
 * @description: 댓글 입력을 위한 컴포넌트
 */
import { useRef } from "react";
import { useComments } from "../../../hooks/useComments";
import { Send } from "lucide-react";
import useAutoResizeTextarea from "../../../hooks/useAutoResizeTextarea";

/**
 * @interface CommentInputProps
 * @description: CommentInput 컴포넌트에 전달되는 props 타입 정의
 * @property {number} postId - 현재 게시글의 ID
 */
interface CommentInputProps {
  postId: number;
}

const CommentInput = ({ postId }: CommentInputProps) => {
  const { newComment, setNewComment, handlePostComment } = useComments(postId);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useAutoResizeTextarea(textareaRef.current, newComment);

  return (
    <div className="flex w-full flex-shrink-0 items-center gap-3 bg-white">
      <img
        src="https://via.placeholder.com/40"
        alt="CurrentUser"
        className="h-10 w-10 rounded-full"
      />
      <div className="relative flex-grow justify-center">
        <textarea
          ref={textareaRef}
          placeholder="댓글을 남겨보세요."
          className="scrollbar-hide max-h-24 w-full resize-none overflow-hidden rounded-2xl bg-[var(--gray-5)] py-3 pr-17 pl-5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={1}
        />
        {newComment.trim() && (
          <button
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-[var(--design-text)] px-4.5 py-1.5 text-white disabled:bg-gray-300"
            onClick={handlePostComment}
          >
            <Send className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentInput;
