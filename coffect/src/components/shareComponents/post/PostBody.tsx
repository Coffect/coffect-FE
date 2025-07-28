/**
 * @author: 흥부/강신욱
 * @description: 게시글의 본문 영역을 구성하는 분자(Molecule) 컴포넌트입니다.
 *                PostTitle, PostContent, PostImage, PostTags 의 원자(Atom) 컴포넌트를 조합하여
 *                게시글의 전체적인 본문 레이아웃을 결정합니다.

* @isDetailView prop을 통해 피드와 상세 페이지의 뷰를 제어합니다.
 */

import React from "react";
import type { Post } from "../../../types/community";

// 원자(Atom) 컴포넌트들을 가져옵니다.
import PostTitle from "./PostTitle";
import PostContent from "./PostContent";
import PostImage from "./PostImage";
import PostTags from "./PostTags";
import FeedInteraction from "../../communityComponents/feed/FeedInteraction";

/** 컴포넌트가 받을 props 타입을 정의합니다.
 * @interface PostBodyProps
 * @property {Post} post - 표시할 게시글의 모든 데이터를 담고 있습니다.
 * @property {boolean} [isDetailView=false] - isDetailView가 false이면(피드 등) 요약된 뷰를, true이면(상세 페이지) 전체 뷰를 표시합니다.
 * @property {() => void} [onContentClick] -  컨텐츠 영역 클릭 시 호출될 함수입니다. (피드에서 상세 페이지 이동 등)
 */
interface PostBodyProps {
  post: Post;
  isDetailView?: boolean;
  onContentClick?: () => void;
}

const PostBody: React.FC<PostBodyProps> = ({
  post,
  isDetailView = false,
  onContentClick,
}) => {
  return (
    // onContentClick 핸들러가 있으면 클릭 가능한 요소로 만듭니다.
    <div
      className={`px-4 pb-2 ${onContentClick ? "cursor-pointer" : ""}`}
      onClick={onContentClick}
    >
      {/* 1. 게시글 제목 (항상 표시) */}
      <PostTitle title={post.title} />

      {/* 2. 게시글 본문 (요약 또는 전체) */}
      <PostContent content={post.content} isDetailView={isDetailView} />

      {/* 3. 게시글 종류 및 주제 태그 (상세 페이지에서만 표시) */}
      {isDetailView && <PostTags type={post.type} topic={post.topic} />}

      {/* 4. 게시글 이미지 (이미지가 있을 경우에만 표시) */}
      <PostImage src={post.image} />

      {/* 5. 좋아요 및 댓글 수 (항상 표시) */}
      <FeedInteraction
        postId={post.id}
        likes={post.likes}
        comments={post.comments}
        isDetailView={isDetailView}
      />
    </div>
  );
};

export default PostBody;
