/*
 * author: 강신욱
 * description: 게시글 상세 페이지의 댓글 목록 영역을 표시하는 컴포넌트입니다.
 */

import CommentList from "@/components/communityComponents/comment/CommentList";
import type { Comment } from "@/types/community/commentTypes";

interface PostDetailCommentsProps {
  commentList: Comment[];
}

const PostDetailComments = ({ commentList }: PostDetailCommentsProps) => {
  return (
    <section>
      <div className="h-[7.3%] min-h-[6px] w-full bg-[var(--gray-5)]"></div>
      <div className="pt-4 pr-4 pl-4">
        <CommentList commentList={commentList} />
      </div>
    </section>
  );
};

export default PostDetailComments;
