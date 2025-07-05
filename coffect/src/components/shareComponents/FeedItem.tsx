/*
author : 강신욱
description : 하나의 피드 UI를 구성하는 컴포넌트입니다.
*/

import { useState } from "react";
import FeedInteraction from "../communityComponents/feed/FeedInteraction";

// Post 타입 정의
interface Post {
  id: number;
  user: {
    profileImage: string;
    nickname: string;
  };
  image: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
}

interface FeedItemProps {
  post: Post;
}

const FeedItem = ({ post }: FeedItemProps) => {
  /*
  isExpanded : 글 내용이 최대 글자 수를 초과할 때, 더보기 버튼을 클릭하여
  글 내용을 확장하거나 축소하는 상태를 관리합니다.
   */
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_CONTENT_LENGTH = 100; // 최대 글자 수 설정

  const handleToggleContent = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="border-b-6 border-gray-300 pt-2 pb-2">
      {/*****  사용자 프로필 영역 / 작성 시간  *****/}
      <div className="flex items-center justify-around">
        <div className="flex items-center">
          <img
            src={post.user.profileImage}
            alt="프로필 사진"
            className="mr-4 h-12 w-12 rounded-full"
          />
          <div>
            <h3 className="text-lg font-bold">{post.user.nickname}</h3>
            <p className="text-sm text-gray-700">{post.title}</p>
          </div>
        </div>
        <div>
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString()} (임의작성)
          </span>
        </div>
      </div>

      {/******  글 및 사진 영역  *******/}
      <div className="m-3">
        <div className="mb-2 items-center text-sm">
          <span>
            {isExpanded || post.content.length <= MAX_CONTENT_LENGTH
              ? post.content
              : `${post.content.slice(0, MAX_CONTENT_LENGTH)}...`}
          </span>
          {post.content.length > MAX_CONTENT_LENGTH && (
            <button
              className="ml-2 text-gray-500"
              onClick={handleToggleContent}
            >
              {isExpanded ? "접기" : "더보기"}
            </button>
          )}
        </div>

        {/***** 사진 영역 *****/}
        {post.image && (
          <img
            src={post.image}
            alt="게시글 이미지"
            className="w-full rounded-lg object-cover"
          />
        )}
      </div>

      {/***** 하단 인터랙션 아이콘 *****/}
      <FeedInteraction likes={post.likes} comments={post.comments} />
    </div>
  );
};

export default FeedItem;
