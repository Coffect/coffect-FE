/**
 * @author: 흥부/강신욱
 * @description:  CommentItem에 map 함수를 사용하여 댓글 목록을 표시하는 컴포넌트
 * @version: 1.1.0
 * @date: 2025-08-03
 * @remarks
 * - 1.1.0: map 함수의 key를 comment.id에서 comment.commentId로 수정
 */
import type { Comment } from "@/types/community/commentTypes";
import CommentItem from "./CommentItem";

/**
 * @interface CommentListProps
 * @description: CommentList 컴포넌트에 전달되는 props 타입 정의
 */
interface CommentListProps {
  commentList: Comment[];
}

const CommentList = ({ commentList }: CommentListProps) => {
  return (
    <div className="flex-grow overflow-y-auto">
      <div className="mb-4 font-semibold">댓글 {commentList.length}개</div>
      <div className="">
        {commentList.map((comment) => (
          <CommentItem key={comment.commentId} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default CommentList;
