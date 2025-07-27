/**
 * @author: 흥부/강신욱
 * @description:  CommentItem에 map 함수를 사용하여 댓글 목록을 표시하는 컴포넌트
 */
import type { Comment } from "../../../types/commentTypes";
import CommentItem from "./CommentItem";

/**
 * @interface CommentListProps
 * @description: CommentList 컴포넌트에 전달되는 props 타입 정의
 * @property {Comment[]} commentList - 댓글 데이터 배열
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
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default CommentList;
