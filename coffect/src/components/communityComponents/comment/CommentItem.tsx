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
  return (
    <div className="flex items-start gap-3 py-2.25">
      <img
        src={comment.user.profileImage || "https://via.placeholder.com/40"} // 임시 기본 이미지,,
        alt={comment.user.name}
        className="h-10 w-10 rounded-full object-cover"
      />
      <div className="flex flex-grow flex-col justify-center gap-1">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-[var(--gray-90)]">
            {comment.user.name}
          </span>
          <span className="text-sm text-[var(--gray-40)]">
            {/* API 응답에 major가 없으므로 학번만 표시 => major 추가 시 major로 변경 !*/}
            {String(comment.user.studentId).substring(2, 4)}학번
          </span>
        </div>
        <p className="font-md text-[var(--gray-90)]">{comment.commentBody}</p>
        {/* <span className="text-xs text-[var(--gray-40)]">
          {formatTimeAgo(comment.createdAtD)}
        </span> */}
      </div>
    </div>
  );
};

export default CommentItem;
