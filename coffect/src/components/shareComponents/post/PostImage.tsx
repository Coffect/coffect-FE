/**
 * @author: 흥부/강신욱
 * @description: 게시글의 이미지를 표시하는 원자(Atom) 컴포넌트입니다.
 *                이미지가 있을 경우에만 렌더링됩니다.
 */
import React from "react";

/** 컴포넌트가 받을 props 타입을 정의합니다.
 * @interface PostImageProps
 * @property {string} [src] - 이미지의 URL 주소입니다. 이 값이 존재할 때만 컴포넌트가 렌더링됩니다.
 * @property {string} [alt] - 이미지에 대한 설명 텍스트입니다. (웹 접근성)
 */
interface PostImageProps {
  src?: string;
  alt?: string;
}

const PostImage: React.FC<PostImageProps> = ({
  src,
  alt = "게시글 이미지", // 기본 alt
}) => {
  // src prop이 없으면 아무것도 렌더링하지 않습니다.
  if (!src) {
    return null;
  }

  return <img src={src} alt={alt} className="w-full rounded-lg object-cover" />;
};

export default PostImage;
