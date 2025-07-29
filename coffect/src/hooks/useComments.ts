/**
 * @author: 흥부/강신욱
 * @description: 댓글 데이터 조회, 추가, 삭제, 수정 등의 비즈니스 로직을 모두 처리하는 커스텀 훅
 *                추후 API 연동을 위해 더미 데이터 생성 로직을 분리하고, API 호출 함수를 사용하는 구조로 변경
 */
import { useState, useEffect, useCallback } from "react";
import type { Comment } from "../types/commentTypes";
import { getComments, addComment } from "../api/commentApi";

/**
 * @description 댓글 관련 비즈니스 로직을 처리하는 커스텀 훅
 * @param postId - 현재 게시글의 ID
 */
export const useComments = (postId: number) => {
  const [comments, setComments] = useState<Comment[]>([]); // 댓글 목록 상태
  const [newComment, setNewComment] = useState(""); //  새로운 댓글 입력 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState<Error | null>(null); // 오류 상태

  // 컴포넌트 마운트 시 댓글 목록을 가져옵니다.
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const fetchedComments = await getComments(postId);
        setComments(fetchedComments);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  /**
   * @description 새로운 댓글을 게시하는 함수
   */
  const handlePostComment = useCallback(async () => {
    if (newComment.trim() === "") return;

    try {
      const newCommentData = await addComment(postId, newComment);
      setComments((prevComments) => [newCommentData, ...prevComments]);
      setNewComment(""); // 입력 필드 초기화
    } catch (err) {
      setError(err as Error);
      // 댓글 작성 실패 시 사용자에게 알림을 주는 로직 추가 가능
      console.error("Failed to post comment:", err);
    }
  }, [newComment, postId]);

  return {
    comments,
    newComment,
    setNewComment,
    handlePostComment,
    isLoading,
    error,
  };
};
