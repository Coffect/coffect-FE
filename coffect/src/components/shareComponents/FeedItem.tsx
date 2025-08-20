import { useNavigate } from "react-router-dom";
import type { ThreadSummary } from "@/types/community/postTypes";
import PostAuthorInfo from "./post/PostAuthorInfo";
import PostBody from "./post/PostBody";
import { getTimeAgo } from "@/utils/dateUtils";
import { useFollowMutation } from "@/hooks/community/mutation/useFollowMutation";

// FeedItem이 받을 props 타입을 정의합니다.
interface FeedItemProps {
  post: ThreadSummary;
  myUserId?: number;
  showFollowButton?: boolean; // 팔로우 버튼 표시 여부를 결정하는 prop
  showBookmarkButton?: boolean; // 북마크 버튼 표시 여부를 결정하는 prop
}

const FeedItem = ({
  post,
  myUserId,
  showFollowButton = true,
  showBookmarkButton = true,
}: FeedItemProps) => {
  const navigate = useNavigate();
  const { mutate: follow } = useFollowMutation();

  // 자신의 게시물인지 확인
  const isMyPost = post.userId === myUserId;

  // 게시글 아이템 클릭 시 해당 게시글의 상세 페이지로 이동하는 함수입니다.
  const handlePostClick = () => {
    navigate(`/community/post/${post.threadId}`);
  };

  // 작성자 클릭 시 해당 작성자의 프로필 페이지로 이동하는 함수입니다
  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/userpage/${post.user.id}`);
  };

  // 팔로우 버튼 클릭 핸들러
  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    follow(post.userId);
  };

  // 작성 시간을 "X일 전" 형식의 문자열로 변환합니다.
  const timeAgo = getTimeAgo(post.createdAt);

  return (
    // UI 하단에 회색 줄을 추가하여 각 피드 아이템을 구분합니다.
    <div className="border-b border-gray-200 pb-2" onClick={handlePostClick}>
      <PostAuthorInfo
        user={{
          name: post.user.name,
          profileImage: post.user.profileImage,
          studentId: post.user.studentId,
          dept: post.user.dept,
        }}
        timeAgo={timeAgo}
        onAuthorClick={handleAuthorClick}
      >
        {showFollowButton && !isMyPost && (
          <button
            onClick={handleFollowClick}
            // disabled={isFollowing}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold text-white ${
              post.isFollowing
                ? "bg-[var(--orange-500)]"
                : "bg-[var(--gray-60)]"
            }`}
          >
            {post.isFollowing ? "팔로잉" : "팔로우"}
          </button>
        )}
      </PostAuthorInfo>

      {/* PostBody에 post prop을 직접 전달합니다. */}
      <PostBody
        post={post}
        onContentClick={handlePostClick}
        showBookmarkButton={showBookmarkButton}
      />
    </div>
  );
};

export default FeedItem;
