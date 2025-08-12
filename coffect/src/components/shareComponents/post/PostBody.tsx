/**
 * @author: 흥부/강신욱
 * @description: 게시글의 본문 영역을 구성하는 분자(Molecule) 컴포넌트입니다.
 *                PostTitle, PostContent, PostImage, PostTags 의 원자(Atom) 컴포넌트를 조합하여
 *                게시글의 전체적인 본문 레이아웃을 결정합니다.

* @isDetailView prop을 통해 피드와 상세 페이지의 뷰를 제어합니다.
 */

import React from "react";

interface BodySummary {
  threadId: string; // 게시글 고유 ID
  threadTitle: string; // 게시글 제목
  threadBody: string; // 게시글 본문 내용
  images?: string[]; // 게시글 이미지 URL 배열 (선택적)
  likeCount: number; // 좋아요 수
  commentCount: number; // 댓글 수
  type?: string; // 게시글 종류 (예: "아티클", "질문")
  subjects?: string[]; // 게시글 주제 배열 (선택적, 예: ["프론트엔드", "백엔드"])
}

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
  post: BodySummary;
  isDetailView?: boolean;
  onContentClick?: () => void;
  showBookmarkButton?: boolean; // 북마크 버튼 표시 여부를 결정하는 prop
}

const PostBody: React.FC<PostBodyProps> = ({
  post,
  isDetailView = false,
  onContentClick,
  showBookmarkButton = true,
}) => {
  return (
    // onContentClick 핸들러가 있으면 클릭 가능한 요소로 만듭니다.
    <div
      className={`px-4 pb-2 ${onContentClick ? "cursor-pointer" : ""}`}
      onClick={onContentClick}
    >
      <PostTitle title={post.threadTitle} />

      {/* 4. 게시글 이미지 (이미지가 있을 경우에만 표시) */}
      <PostImage src={null} />

      <PostContent content={post.threadBody} isDetailView={isDetailView} />

      {isDetailView && <PostTags type={post.type} topic={post.subjects} />}

      <FeedInteraction
        threadId={post.threadId}
        likes={post.likeCount}
        comments={post.commentCount}
        isDetailView={isDetailView}
        showBookmarkButton={showBookmarkButton}
      />
    </div>
  );
};

export default PostBody;
