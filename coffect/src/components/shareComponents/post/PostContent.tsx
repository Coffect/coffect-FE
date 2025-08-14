/**
 * @author: 흥부/강신욱
 * @description: 게시글의 본문 내용을 표시하는 최종 버전의 원자(Atom) 컴포넌트입니다.
 *              이 컴포넌트는 게시글의 내용을 표시하며, 내용이 길 경우 '더보기' 버튼을 통해 확장할 수 있습니다.
 *             또한, 게시글이 상세보기 모드일 때는 '더보기' 버튼을 표시하지 않습니다.
 */

import React from "react";
import useClampManager from "../../../hooks/community/useClampManager";

/**
 * @interface PostContentProps
 * @description: 게시글 본문 내용을 표시하기 위한 props 인터페이스입니다.
 * @property {string} content - 게시글의 본문 내용입니다.
 * @property {boolean} [isDetailView=false] - 게시글이 상세보기 모드인지 여부를 나타내는 선택적 속성입니다.
 *                                           기본값은 false입니다.
 */
interface PostContentProps {
  content: string;
  isDetailView?: boolean;
}

const PostContent: React.FC<PostContentProps> = ({
  content,
  isDetailView = false,
}) => {
  const { contentRef, isClamped, isExpanded, handleToggle } = useClampManager({
    content,
  });

  // 텍스트를 잘라야 하는지 여부를 결정합니다.
  const needsClamping = !isDetailView && !isExpanded;

  return (
    <div className="mb-2 pt-2 text-[16px]">
      <span
        ref={contentRef}
        className={`text-md leading-6 whitespace-pre-wrap text-[var(--gray-70)] ${
          needsClamping ? "line-clamp-3" : ""
        }`}
      >
        {content}
      </span>
      {
        // isClamped가 true일 때만 (즉, 텍스트가 3줄을 넘을 때만) 버튼을 표시합니다.
        !isDetailView && isClamped && (
          <button onClick={handleToggle} className="mt-1 text-sm text-gray-500">
            {/* isExpanded 상태에 따라 버튼 텍스트를 동적으로 변경합니다. */}
            {isExpanded ? "접기" : "더보기"}
          </button>
        )
      }
    </div>
  );
};

export default PostContent;
