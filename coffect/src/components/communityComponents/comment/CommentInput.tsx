/**
 author : 강신욱
 description : 댓글 입력을 위한 컴포넌트
 */
import { useRef } from "react";
import { useComments } from "../../../hooks/useComments";
import { Send } from "lucide-react";
import useAutoResizeTextarea from "../../../hooks/useAutoResizeTextarea";

// 어떤 게시글에 대한 댓글인지 알기 위함
interface CommentInputProps {
  postId: number;
}

const CommentInput = ({ postId }: CommentInputProps) => {
  // useComments 훅을 사용하여 댓글 상태(newComment)와 관련 함수(setNewComment, handlePostComment)를 가져옴
  const { newComment, setNewComment, handlePostComment } = useComments();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useAutoResizeTextarea(textareaRef.current, newComment);

  // 실제 댓글 게시 로직 (postId와 함께 API 호출 등)
  const onPostComment = () => {
    console.log(`게시글 ${postId}에 댓글: ${newComment}`);
    handlePostComment(); // useComments 훅의 댓글 게시 함수 호출
  };

  return (
    <div className="flex w-full flex-shrink-0 items-center gap-2 bg-white">
      {/***** 프로필 이미지지 *****/}
      <img
        src="https://via.placeholder.com/40"
        alt="CurrentUser"
        className="h-10 w-10 rounded-full"
      />
      {/***** 댓글 입력 필드와 전송 버튼 *****/}
      <div className="relative flex-grow justify-center">
        {/* 댓글 입력 textarea */}
        <textarea
          ref={textareaRef}
          placeholder="댓글을 남겨보세요."
          className="scrollbar-hide max-h-24 w-full resize-none rounded-2xl border border-gray-300 bg-[#f5f5f5] py-2 pr-14 pl-5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={1} // 기본적으로 한 줄로 시작
        />
        {/* 입력된 댓글이 있을 때만 전송 버튼을 표시 */}
        {newComment.trim() && (
          <button
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-[#FF8126] p-2 text-white hover:bg-[#e0701f] disabled:bg-gray-300"
            onClick={onPostComment} // 클릭 시 onPostComment 함수 호출
          >
            {/* 전송 아이콘 */}
            <Send className="h-3 w-7" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentInput;
