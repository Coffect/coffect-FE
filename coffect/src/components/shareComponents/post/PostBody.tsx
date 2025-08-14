/**
 * @author: 흥부/강신욱
 * @description: 게시글의 본문 영역을 구성하는 분자(Molecule) 컴포넌트입니다.
 *                PostTitle, PostContent, PostImage, PostTags 의 원자(Atom) 컴포넌트를 조합하여
 *                게시글의 전체적인 본문 레이아웃을 결정합니다.

* @isDetailView prop을 통해 피드와 상세 페이지의 뷰를 제어합니다.
 */

import React from "react";
import type { ThreadSummary } from "@/types/community/postTypes";

// 원자(Atom) 컴포넌트들을 가져옵니다.
import PostTitle from "./PostTitle";
import PostContent from "./PostContent";
import PostImage from "./PostImage";
import PostTags from "./PostTags";
import FeedInteraction from "../../communityComponents/feed/FeedInteraction";

/** 컴포넌트가 받을 props 타입을 정의합니다.
 * @interface PostBodyProps
 * @property {PostSummary} post - 표시할 게시글의 모든 데이터를 담고 있습니다.
 * @property {boolean} [isDetailView=false] - isDetailView가 false이면(피드 등) 요약된 뷰를, true이면(상세 페이지) 전체 뷰를 표시합니다.
 * @property {() => void} [onContentClick] -  컨텐츠 영역 클릭 시 호출될 함수입니다. (피드에서 상세 페이지 이동 등)
 */
interface PostBodyProps {
  post: ThreadSummary;
  isDetailView?: boolean;
  onContentClick?: () => void;
  showBookmarkButton?: boolean; // 북마크 버튼 표시 여부를 결정하는 prop
}

const PostBody: React.FC<PostBodyProps> = ({
  post,
  isDetailView = false,
  onContentClick,
  showBookmarkButton,
}) => {
  return (
    <div
      className={`px-4 pb-2 ${onContentClick ? "cursor-pointer" : ""}`}
      onClick={onContentClick}
    >
      <PostTitle title={post.threadTitle} />
      <PostContent content={post.threadBody} isDetailView={isDetailView} />
      <PostImage src={post.images?.[0] || null} />

      {isDetailView && <PostTags type={post.type} topic={post.subjects} />}

      <FeedInteraction
        threadId={post.threadId}
        likes={post.likeCount}
        comments={post.commentCount}
        isDetailView={isDetailView}
        showBookmarkButton={showBookmarkButton}
        isLiked={post.isLiked}
        isScraped={post.isScraped}
      />
    </div>
  );
};

export default PostBody;
