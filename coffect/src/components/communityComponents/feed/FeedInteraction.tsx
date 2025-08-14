/* 
author : 강신욱
description : 피드의 하단(좋아요 수, 댓글 수, 인용, 공유 수, 저장)버튼에 대한 컴포넌트입니다. 
*/

import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
// import { useLikePostMutation } from "@/hooks/community/mutation/useLikePostMutation";
import { useScrapPostMutation } from "@/hooks/community/mutation/useScrapPostMutation";
import { useLikePostMutation } from "@/hooks/community/mutation/useLikePostMutation";

// 공통 스타일 변수 정의
const buttonStyle =
  "text-sm text-gray-600 hover:text-blue-500 flex items-center gap-1";

interface FeedInteractionProps {
  threadId: string;
  likes: number;
  comments: number;
  isDetailView?: boolean;
  showBookmarkButton?: boolean;
  isLiked: boolean;
  isScraped: boolean;
}

const FeedInteraction = ({
  threadId,
  likes,
  comments,
  isDetailView = false,
  showBookmarkButton,
  isLiked,
  isScraped,
}: FeedInteractionProps) => {
  const navigate = useNavigate();
  const { mutate: toggleLike } = useLikePostMutation();
  const { mutate: toggleScrap } = useScrapPostMutation();

  const handleLikeClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleLike(threadId);
  };

  const handleBookmarkClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleScrap(threadId);
  };

  const handleCommentClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!isDetailView) {
      navigate(`/community/post/${threadId}`);
    }
  };

  return (
    <>
      <div className="mt-2.5 flex h-8 items-center justify-between">
        <div className="flex items-center gap-4">
          <button className={buttonStyle} onClick={handleLikeClick}>
            <Heart
              size={20}
              fill={isLiked ? "red" : "none"}
              color={isLiked ? "red" : "currentColor"}
            />
            <span>{likes}</span>
          </button>
          <button className={buttonStyle} onClick={handleCommentClick}>
            <MessageCircle size={20} />
            <span>{comments}</span>
          </button>
        </div>
        {showBookmarkButton && (
          <button className={buttonStyle} onClick={handleBookmarkClick}>
            <Bookmark
              size={20}
              fill={isScraped ? "black" : "none"}
              color={isScraped ? "black" : "currentColor"}
            />
          </button>
        )}
      </div>
    </>
  );
};

export default FeedInteraction;
