import { useComments } from "../../../hooks/useComments";
import { Send } from "lucide-react";

interface CommentInputProps {
  postId: number; // 어떤 게시글에 대한 댓글인지 알기 위함
}

const CommentInput = ({ postId }: CommentInputProps) => {
  const { newComment, setNewComment, handlePostComment } = useComments(); // useComments 훅 사용

  const onPostComment = () => {
    // 실제 댓글 게시 로직 (postId와 함께 API 호출 등)
    console.log(`게시글 ${postId}에 댓글: ${newComment}`);
    handlePostComment(); // useComments 훅의 댓글 게시 함수 호출
  };

  return (
    <div className="flex w-full flex-shrink-0 items-center gap-2 bg-white">
      <img
        src="https://via.placeholder.com/40"
        alt="CurrentUser"
        className="h-10 w-10 rounded-full"
      />
      <div className="relative flex-grow justify-center">
        <textarea
          placeholder="댓글을 남겨보세요."
          className="max-h-24 w-full resize-none overflow-y-auto rounded-full border border-gray-300 bg-[#f5f5f5] p-2 pr-10 pl-5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onPostComment()}
          rows={1}
        />
        {newComment.trim() && (
          <button
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-[#FF8126] p-2 text-white hover:bg-[#e0701f] disabled:bg-gray-300"
            onClick={onPostComment}
          >
            <Send className="h-3 w-7" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentInput;
