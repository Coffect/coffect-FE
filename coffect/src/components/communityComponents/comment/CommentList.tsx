/*
author: 강신욱
description: 댓글 목록을 표시하는 컴포넌트입니다.
 */

import type { Comment } from "../../../hooks/useComments";

interface CommentListProps {
  commentList: Comment[];
}

const CommentList = ({ commentList }: CommentListProps) => {
  return (
    <div className="flex-grow overflow-y-auto">
      <div className="mb-4 font-semibold">댓글 {commentList.length}개</div>
      <div className="">
        {commentList.map((comment) => (
          <div key={comment.id} className="flex items-start gap-5 py-2.5">
            <img
              src={comment.user.avatar}
              alt={comment.user.name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex flex-grow flex-col justify-center gap-1.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[var(--gray-90)]">
                  양관식
                </span>
                <span className="text-sm text-[var(--gray-40)]">
                  경영학과 23학번
                </span>
              </div>
              <p className="font-md text-[var(--gray-90)]">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentList;
