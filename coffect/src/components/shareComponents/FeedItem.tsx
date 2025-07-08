/*
 * author: 강신욱
 * description: 하나의 피드 UI를 구성하는 컴포넌트입니다.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FeedInteraction from "../communityComponents/feed/FeedInteraction";
import type { Post } from "../../data/communityDummyData";

interface FeedItemProps {
  post: Post;
}

const FeedItem = ({ post }: FeedItemProps) => {
  const navigate = useNavigate();
  /*
  isExpanded : 글 내용이 최대 글자 수를 초과할 때, 더보기 버튼을 클릭하여
  글 내용을 확장하거나 축소하는 상태를 관리합니다.
   */
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_CONTENT_LENGTH = 100; // 최대 글자 수 설정

  const handleToggleContent = () => {
    setIsExpanded((prev) => !prev);
  };

  const handlePostClick = () => {
    navigate(`/community/post/${post.id}`);
  };

  return (
    <div className="border-b-6 border-gray-300 pb-2" onClick={handlePostClick}>
      {/*****  사용자 프로필 영역 / 작성 시간 / 팔로우 버튼 *****/}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <img
            src={post.user.profileImage}
            alt="프로필 사진"
            className="mr-3 h-full w-14 rounded-full object-cover"
          />
          <div>
            <h3 className="text-md font-bold">{post.user.nickname}</h3>
            <p className="text-sm text-gray-500">{post.user.major} 20학번</p>

            <p className="text-sm text-gray-500">2일 전</p>
          </div>
        </div>
        <div>
          <button className="h-[50%] rounded-sm bg-[#4a4a4a] px-4 py-1 text-sm text-white">
            팔로우
          </button>
        </div>
      </div>

      {/******  글 및 사진 영역  *******/}
      <div className="px-4 py-2">
        <div className="mb-2 pb-1 text-sm">
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
      <div className="px-4">
        <FeedInteraction likes={post.likes} comments={post.comments} />
      </div>
    </div>
  );
};

export default FeedItem;
