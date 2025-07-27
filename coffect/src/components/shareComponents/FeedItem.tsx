/*
 * author: 강신욱
 * description: 피드 목록에 표시되는 개별 게시글 아이템 컴포넌트입니다.
                공용 컴포넌트인 PostAuthorInfo와 PostBody를 조합하여 UI를 구성합니다.
 */
import { useNavigate } from "react-router-dom";
import type { Post } from "../../data/communityDummyData";
import PostAuthorInfo from "./post/PostAuthorInfo";
import PostBody from "./post/PostBody";

// FeedItem이 받을 props 타입을 정의합니다.
interface FeedItemProps {
  post: Post;
  showFollowButton?: boolean; // 팔로우 버튼 표시 여부를 결정하는 prop
}

// 날짜를 'X일 전' 형식으로 변환하는 간단한 유틸리티 함수입니다.
// (실제 애플리케이션에서는 이 함수를 별도의 유틸리티 파일로 분리하는 것이 좋습니다.)
const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "오늘";
  if (diffDays === 1) return "어제";
  return `${diffDays}일 전`;
};

const FeedItem = ({ post, showFollowButton = true }: FeedItemProps) => {
  const navigate = useNavigate();

  // 게시글 아이템 클릭 시 해당 게시글의 상세 페이지로 이동하는 함수입니다.
  const handlePostClick = () => {
    navigate(`/community/post/${post.id}`);
  };

  // 작성 시간을 "X일 전" 형식의 문자열로 변환합니다.
  const timeAgo = getTimeAgo(post.postedDate);

  return (
    // UI 하단에 회색 줄을 추가하여 각 피드 아이템을 구분합니다.
    <div className="border-b border-gray-200 pb-2">
      {/* 
        작성자 정보를 표시하는 공용 컴포넌트입니다.
        user와 timeAgo 정보를 props로 전달합니다.
        자식 요소로 팔로우 버튼을 전달하여, PostAuthorInfo 컴포넌트의 오른쪽에 표시되도록 합니다.
      */}
      <PostAuthorInfo user={post.user} timeAgo={timeAgo}>
        {showFollowButton && (
          <button className="rounded-md bg-[var(--gray-60)] px-4 py-1.5 text-sm font-semibold text-white">
            팔로우
          </button>
        )}
      </PostAuthorInfo>

      {/* 
        게시글 본문을 표시하는 공용 컴포넌트입니다.
        post 객체 전체를 전달하고, onContentClick 핸들러를 지정하여
        본문 영역 클릭 시에도 상세 페이지로 이동하도록 합니다.
        isDetailView prop은 명시적으로 false로 전달되거나 생략되어(기본값 false)
        글 내용이 100자로 제한되고 '더보기' 버튼이 표시됩니다.
      */}
      <PostBody post={post} onContentClick={handlePostClick} />
    </div>
  );
};

export default FeedItem;
