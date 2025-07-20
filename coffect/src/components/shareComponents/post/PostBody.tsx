/*
 * author: 강신욱
 * description: 게시글의 본문, 이미지, 태그, 인터랙션(좋아요/댓글)을 표시하는 공용 컴포넌트입니다.
 * isDetailView prop을 통해 피드에서의 모습(line-clamp 적용)과 상세 페이지에서의 모습(전체 내용 표시)을 제어할 수 있습니다.
 */
import React, { useRef, useState, useEffect, useCallback } from "react";
import FeedInteraction from "../../communityComponents/feed/FeedInteraction";
import type { Post } from "../../../data/communityDummyData";

// 컴포넌트가 받을 props 타입을 정의합니다.
interface PostBodyProps {
  // post 객체는 표시할 게시글의 모든 데이터를 담고 있습니다.
  post: Post;
  // isDetailView가 false이면(피드 등) 글 내용을 3줄로 제한하고, true이면(상세 페이지) 전체를 표시합니다.
  isDetailView?: boolean;
  // onContentClick 핸들러는 컨텐츠 영역 클릭 시 호출될 함수입니다. (피드에서 상세 페이지 이동 등)
  onContentClick?: () => void;
}

const PostBody: React.FC<PostBodyProps> = ({
  post,
  isDetailView = false,
  onContentClick,
}) => {
  const contentRef = useRef<HTMLSpanElement>(null);
  const [isClamped, setIsClamped] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const checkClamping = useCallback(() => {
    if (contentRef.current && !isDetailView) {
      const spanElement = contentRef.current;
      const lineHeight = parseFloat(getComputedStyle(spanElement).lineHeight);
      const maxHeight = lineHeight * 3; // 3줄 높이

      // 스크롤 높이가 3줄 높이보다 크면 클램핑 필요
      setIsClamped(spanElement.scrollHeight > maxHeight);
    }
  }, [isDetailView]);

  useEffect(() => {
    checkClamping(); // 초기 렌더링 시 클램핑 여부 확인

    // 윈도우 리사이즈 시 클램핑 여부 재확인
    window.addEventListener("resize", checkClamping);
    return () => {
      window.removeEventListener("resize", checkClamping);
    };
  }, [post.content, checkClamping]); // post.content 변경 시에도 재확인

  const handleShowMore = (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모의 onClick 이벤트 방지
    setShowMore(true);
  };

  return (
    // onContentClick 핸들러가 있으면 클릭 가능한 요소로 만듭니다.
    <div
      className={`px-4 pb-2 ${onContentClick ? "cursor-pointer" : ""}`}
      onClick={onContentClick}
    >
      {/* 글 내용 */}
      <div className="relative mb-2 pt-2 text-sm">
        <span
          ref={contentRef}
          className={`leading-normal whitespace-pre-wrap ${
            !isDetailView && isClamped && !showMore
              ? "display-webkit-box webkit-line-clamp-3 webkit-box-orient-vertical overflow-hidden text-ellipsis"
              : ""
          }`}
          style={{
            display:
              !isDetailView && isClamped && !showMore ? "-webkit-box" : "block",
            WebkitLineClamp:
              !isDetailView && isClamped && !showMore ? 3 : "unset",
            WebkitBoxOrient:
              !isDetailView && isClamped && !showMore ? "vertical" : "unset",
            overflow:
              !isDetailView && isClamped && !showMore ? "hidden" : "visible",
            textOverflow:
              !isDetailView && isClamped && !showMore ? "ellipsis" : "initial",
          }}
        >
          {post.content}
        </span>
        {!isDetailView && isClamped && !showMore && (
          <>
            <span className="absolute right-0 bottom-0 bg-gradient-to-l from-white via-white to-transparent pr-12">
              &nbsp; {/* This is for the gradient to have some space */}
            </span>
            <button
              onClick={handleShowMore}
              className="ml-1 text-gray-500 hover:underline"
            >
              더보기
            </button>
          </>
        )}
      </div>

      {/* 게시글 종류 및 주제 태그 (상세 페이지에서만 보입니다) */}
      {isDetailView && (
        <div className="my-3 flex gap-1.5">
          <span className="text-md inline-flex items-center justify-center rounded-lg border border-[var(--gray-5)] bg-[var(--gray-5)] px-3 py-1.5 text-[var(--gray-70)]">
            {post.type}
          </span>
          <span className="text-md inline-flex items-center justify-center rounded-lg border border-[var(--gray-5)] bg-[var(--gray-5)] px-3 py-1.5 text-[var(--gray-70)]">
            {post.topic}
          </span>
        </div>
      )}

      {/* 게시글에 이미지가 있을 경우 표시합니다. */}
      {post.image && (
        <img
          src={post.image}
          alt="게시글 이미지"
          className="w-full rounded-lg object-cover"
        />
      )}

      {/* 좋아요 및 댓글 수 표시 */}
      <FeedInteraction
        postId={post.id}
        likes={post.likes}
        comments={post.comments}
      />
    </div>
  );
};

export default PostBody;
