import { useNavigate } from "react-router-dom";
import type { ThreadSummary } from "@/types/community/postTypes";
import PostAuthorInfo from "./post/PostAuthorInfo";
import PostBody from "./post/PostBody";

// FeedItem이 받을 props 타입을 정의합니다.
interface FeedItemProps {
  post: ThreadSummary;
  showFollowButton?: boolean; // 팔로우 버튼 표시 여부를 결정하는 prop
  showBookmarkButton?: boolean; // 북마크 버튼 표시 여부를 결정하는 prop
}

// 날짜를 'X일 전' 형식으로 변환하는 간단한 유틸리티 함수입니다.
const getTimeAgo = (dateStr: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return ""; // 유효하지 않은 날짜 처리

  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "오늘";
  if (diffDays === 1) return "어제";
  return `${diffDays}일 전`;
};

const FeedItem = ({ post, showFollowButton = true, showBookmarkButton = true }: FeedItemProps) => {
  const navigate = useNavigate();

  // 게시글 아이템 클릭 시 해당 게시글의 상세 페이지로 이동하는 함수입니다.
  const handlePostClick = () => {
    navigate(`/community/post/${post.threadId}`);
  };

  // 작성 시간을 "X일 전" 형식의 문자열로 변환합니다.
  const timeAgo = getTimeAgo(post.createdAt);

  return (
    // UI 하단에 회색 줄을 추가하여 각 피드 아이템을 구분합니다.
    <div className="border-b border-gray-200 pb-2">
      <PostAuthorInfo
        user={{
          name: post.user.name,
          profileImage: post.user.profileImage,
          studentId: post.user.studentId,
          dept: post.user.dept,
        }}
        timeAgo={timeAgo}
      >
        {showFollowButton && (
          <button className="rounded-md bg-[var(--gray-60)] px-4 py-1.5 text-sm font-semibold text-white">
            팔로우
          </button>
        )}
      </PostAuthorInfo>

      {/* PostBody에 post prop을 직접 전달합니다. */}
      <PostBody post={post} onContentClick={handlePostClick} showBookmarkButton={showBookmarkButton} />
    </div>
  );
};

export default FeedItem;
