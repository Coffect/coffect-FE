/**
 * @author: 흥부/강신욱
 * @description: 개별 댓글 항목을 렌더링하는 컴포넌트
 * @version: 1.1.0
 * @date: 2025-08-03
 * @remarks
 * - 1.1.0: API 데이터 구조 변경에 따라 사용하는 props(comment)의 필드를 수정
 *          (nickname -> name, content -> commentBody, major 제거)
 */
import type { Comment } from "@/types/community/commentTypes";
import { useNavigate } from "react-router-dom";
// import { formatTimeAgo } from "@/utils/dateUtils";

/**
 * @interface CommentItemProps
 * @description: CommentItem 컴포넌트에 전달되는 props 타입 정의
 * @property {Comment} comment - 댓글 데이터
 */
interface CommentItemProps {
  comment: Comment;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  const navigate = useNavigate();
  const handleCommentClick = () => {
    navigate(`/userpage/${comment.user.id}`);
  };

  return (
    <div className="flex items-start gap-3 pb-4.5" onClick={handleCommentClick}>
      <img
        src={comment.user.profileImage || "https://via.placeholder.com/40"}
        alt={comment.user.name}
        className="h-10 w-10 flex-shrink-0 rounded-full border-[1.5px] border-[var(--gray-10)] object-cover"
      />
      <div className="flex min-w-0 flex-grow flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-[var(--gray-90)]">
            {comment.user.name}
          </span>
          <div>
            <span className="pr-1 text-sm text-[var(--gray-40)]">
              {comment.user.dept}
            </span>
            <span className="text-sm text-[var(--gray-40)]">
              {String(comment.user.studentId).substring(2, 4)}학번
            </span>
          </div>
        </div>
        <p className="font-md break-words whitespace-pre-wrap text-[var(--gray-90)]">
          {comment.commentBody}
        </p>
      </div>
    </div>
  );
};

export default CommentItem;
