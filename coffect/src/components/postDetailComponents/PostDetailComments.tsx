/*
 * author: 강신욱
 * description: 게시글 상세 페이지의 댓글 목록 영역을 표시하는 컴포넌트입니다.
 */

import CommentList from "@/components/communityComponents/comment/CommentList";
import type { Comment } from "@/types/community/commentTypes";

// 컴포넌트가 받을 props 타입을 정의합니다.
interface PostDetailCommentsProps {
  commentList: Comment[];
}

const PostDetailComments = ({ commentList }: PostDetailCommentsProps) => {
  return (
    <section>
      {/* 댓글 목록 위쪽의 구분선입니다. */}
      <div className="h-[7.3%] min-h-[6px] w-full bg-[var(--gray-5)]"></div>
      {/* 댓글 목록을 렌더링하는 영역입니다. */}
      <div className="p-4">
        <CommentList commentList={commentList} />
      </div>
    </section>
  );
};

export default PostDetailComments;
