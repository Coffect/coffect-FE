/*
author : 강신욱
description : 댓글 데이터와 관련 로직을 관리하는 커스텀 훅입니다.
*/
import { useState } from "react";
import { Comment, dummyComments } from "../data/commentDummyData";

/*
comments : 댓글 목록을 관리하는 상태입니다.
newComment : 새로 작성할 댓글 내용을 관리하는 상태입니다.
 */
export const useComments = () => {
  const [comments, setComments] = useState<Comment[]>(dummyComments);
  const [newComment, setNewComment] = useState("");

  const handlePostComment = () => {
    if (newComment.trim() === "") return;

    const newCommentData: Comment = {
      id: Date.now(),
      user: { name: "CurrentUser", avatar: "https://via.placeholder.com/40" },
      content: newComment,
    };

    setComments([newCommentData, ...comments]);
    setNewComment("");
  };

  return {
    comments,
    newComment,
    setNewComment,
    handlePostComment,
  };
};
