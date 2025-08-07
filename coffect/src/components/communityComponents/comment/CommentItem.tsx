/**
 * @author: 흥부/강신욱
 * @description: 개별 댓글 항목을 렌더링하는 컴포넌트
 */
import type { Comment } from "../../../types/commentTypes";

/**
 * @interface CommentItemProps
 * @description: CommentItem 컴포넌트에 전달되는 props 타입 정의
 * @property {Comment} comment - 댓글 데이터
 */
interface CommentItemProps {
  comment: Comment;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <div className="flex items-start gap-5 py-2.5">
      <img
        src={comment.user.profileImage}
        alt={comment.user.nickname}
        className="h-10 w-10 rounded-full object-cover"
      />
      <div className="flex flex-grow flex-col justify-center gap-1.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[var(--gray-90)]">
            {comment.user.nickname}
          </span>
          <span className="text-sm text-[var(--gray-40)]">
            {comment.user.major} {comment.user.studentId.substring(2, 4)}학번
          </span>
        </div>
        <p className="font-md text-[var(--gray-90)]">{comment.content}</p>
      </div>
    </div>
  );
};

export default CommentItem;
