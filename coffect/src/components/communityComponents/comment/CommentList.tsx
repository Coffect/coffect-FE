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
    <div className="flex-grow overflow-y-auto p-2">
      <p className="mb-4 font-semibold">댓글 {commentList.length}개</p>
      <div className="space-y-4">
        {commentList.map((comment) => (
          <div key={comment.id} className="flex items-start gap-3">
            <img
              src={comment.user.avatar}
              alt={comment.user.name}
              className="h-10 w-10 rounded-full"
            />
            <div className="flex-grow">
              <p className="font-semibold">{comment.user.name}</p>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentList;
