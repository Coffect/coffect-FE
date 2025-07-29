/**
 * @author: 흥부/강신욱
 * @description: 게시글의 제목을 표시하는 원자(Atom) 컴포넌트입니다.
 *                이 컴포넌트는 오직 제목을 렌더링하는 책임만 가집니다.
 */
import React from "react";

/** 컴포넌트가 받을 props 타입을 정의합니다.
 * @interface PostTitleProps
 * @property {string} title - 표시할 게시글의 제목 문자열입니다.
 */
interface PostTitleProps {
  title: string;
}

const PostTitle: React.FC<PostTitleProps> = ({ title }) => {
  return (
    <h2 className="pt-2 text-lg font-semibold text-[var(--gray-90)]">
      {title}
    </h2>
  );
};

export default PostTitle;
