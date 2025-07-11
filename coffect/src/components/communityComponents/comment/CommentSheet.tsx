/*
author : 강신욱
description : 댓글 UI를 표시하는 시트 컴포넌트입니다.
*/

import { useComments } from "../../../hooks/useComments";
import "./CommentSheetAnimation.css";
import FeedInteraction from "../feed/FeedInteraction";

interface CommentSheetProps {
  isVisible: boolean;
  onClose: () => void;
  likes: number; // FeedInteraction에 전달할 likes 추가
  comments: number; // FeedInteraction에 전달할 comments 추가
}

const CommentSheet = ({
  isVisible,
  onClose,
  likes,
  comments,
}: CommentSheetProps) => {
  const { newComment, setNewComment, handlePostComment } = useComments();

  if (!isVisible) return null;

  return (
    <>
      {/* 바깥 클릭 시 CommentSheet 사라지도록 함. */}
      <div className="fixed inset-0 z-40" onClick={onClose}></div>

      <div
        className={`animate-slide-up-sheet fixed top-1/2 bottom-[81px] left-1/2 z-50 flex w-full max-w-[430px] -translate-x-1/2 flex-col rounded-t-lg bg-white shadow-lg`}
      >
        {/* FeedInteraction이 나타나는 부분 */}
        <div className="relative w-full flex-shrink-0 pt-3 pr-3 pl-3">
          <FeedInteraction likes={likes} comments={comments} />
        </div>

        {/***** 댓글창 입력 부분 ******/}
        <div className="flex flex-grow flex-col">
          {/* Input Field */}
          <div className="flex flex-shrink-0 items-center gap-2 bg-white p-2">
            <img
              src="https://via.placeholder.com/40"
              alt="CurrentUser"
              className="h-10 w-10 rounded-full"
            />
            <input
              type="text"
              placeholder="댓글 남기기"
              className="flex-grow rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handlePostComment()}
            />
            <button
              className="rounded-lg bg-gray-700 px-4 py-2 text-white hover:bg-gray-800 disabled:bg-gray-300"
              onClick={handlePostComment}
              disabled={!newComment.trim()}
            >
              게시
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentSheet;
