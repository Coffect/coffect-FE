/**
 * @author: 흥부/강신욱
 * @description: 게시글의 종류(예: 스터디, 프로젝트)와 주제(예: 프론트엔드) 태그를 표시하는 원자(Atom) 컴포넌트입니다.
 *                상세 페이지에서만 보이도록 설계되었습니다.
 */
import React from "react";

/** 컴포넌트가 받을 props 타입을 정의합니다.
 * @interface PostTagsProps
 * @property {string} type - 게시글의 종류 태그 (예: 스터디, 프로젝트 등)
 * @property {string} topic - 게시글의 주제 태그 (예: 프론트엔드, 백엔드 등)
 */
interface PostTagsProps {
  type: string | null;
  topic: string | null;
}

const PostTags: React.FC<PostTagsProps> = ({ type, topic }) => {
  const TagStyle =
    "inline-flex items-center justify-center rounded-lg border border-[var(--gray-5)] bg-[var(--gray-5)] px-3 py-1.5 text-[14px] text-[var(--gray-70)]";
  return (
    <div className="my-3 flex gap-1.5">
      {/* 게시글 종류 태그 */}
      <span className={`${TagStyle}`}>{type}</span>
      {/* 게시글 주제 태그 */}
      <span className={`${TagStyle}`}>{topic}</span>
    </div>
  );
};

export default PostTags;
