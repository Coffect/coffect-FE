/*
 * author: 강신욱
 * description: 게시글의 본문, 이미지, 태그, 인터랙션(좋아요/댓글)을 표시하는 공용 컴포넌트입니다.
 * isDetailView prop을 통해 피드에서의 모습과 상세 페이지에서의 모습을 제어할 수 있습니다.
 */
import React, { useState } from 'react';
import FeedInteraction from '../../communityComponents/feed/FeedInteraction';
import type { Post } from '../../../data/communityDummyData';

// 컴포넌트가 받을 props 타입을 정의합니다.
interface PostBodyProps {
  // post 객체는 표시할 게시글의 모든 데이터를 담고 있습니다.
  post: Post;
  // isDetailView가 false이면(피드 등) 글 내용을 일부만 표시하고, true이면(상세 페이지) 전체를 표시합니다.
  isDetailView?: boolean;
  // onContentClick 핸들러는 컨텐츠 영역 클릭 시 호출될 함수입니다. (피드에서 상세 페이지 이동 등)
  onContentClick?: () => void;
}

const MAX_CONTENT_LENGTH = 100; // 피드에 표시될 최대 글자 수

const PostBody: React.FC<PostBodyProps> = ({ post, isDetailView = false, onContentClick }) => {
  // isExpanded 상태는 피드에서 '더보기' 버튼 클릭 여부를 관리합니다.
  const [isExpanded, setIsExpanded] = useState(false);

  // '더보기' 또는 '접기' 버튼 클릭 시 isExpanded 상태를 토글하는 함수입니다.
  const handleToggleContent = (event: React.MouseEvent) => {
    event.stopPropagation(); // 이벤트 버블링을 막아 onContentClick이 실행되지 않도록 합니다.
    setIsExpanded((prev) => !prev);
  };

  // 표시될 컨텐츠를 결정합니다.
  const contentToShow = isDetailView || isExpanded || post.content.length <= MAX_CONTENT_LENGTH
      ? post.content
      : `${post.content.slice(0, MAX_CONTENT_LENGTH)}...`;

  // '더보기' 버튼을 표시할지 여부를 결정합니다.
  const shouldShowMoreButton = !isDetailView && post.content.length > MAX_CONTENT_LENGTH;

  return (
    // onContentClick 핸들러가 있으면 클릭 가능한 요소로 만듭니다.
    <div className={`px-4 pb-2 ${onContentClick ? 'cursor-pointer' : ''}`} onClick={onContentClick}>
      {/* 글 내용과 '더보기/접기' 버튼 */}
      <div className="mb-2 py-2 text-sm">
        <p className="whitespace-pre-wrap leading-normal">{contentToShow}</p>
        {shouldShowMoreButton && (
          <button className="ml-2 font-semibold text-gray-500" onClick={handleToggleContent}>
            {isExpanded ? '접기' : '더보기'}
          </button>
        )}
      </div>

      {/* 게시글에 이미지가 있을 경우 표시합니다. */}
      {post.image && (
        <img
          src={post.image}
          alt="게시글 이미지"
          className="w-full rounded-lg object-cover"
        />
      )}

      {/* 게시글 종류 및 주제 태그 */}
      <div className="my-3 flex gap-2">
        <span className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700">
          {post.type}
        </span>
        <span className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700">
          {post.topic}
        </span>
      </div>

      {/* 좋아요 및 댓글 수 표시 */}
      <FeedInteraction likes={post.likes} comments={post.comments} />
    </div>
  );
};

export default PostBody;
