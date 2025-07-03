import { useState } from "react";
import "./FeedInteraction";
import FeedInteraction from "./FeedInteraction";

const FeedItem = ({ feed }: { feed: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_CONTENT_LENGTH = 100; // 최대 글자 수 설정

  const handleToggleContent = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="border-b border-gray-300 p-4">
      {/*****  사용자 프로필 영역  *****/}

      <div className="flex items-center justify-around">
        <img
          src={feed.profileImage}
          alt="프로필 사진"
          className="mr-4 h-12 w-12 rounded-full"
        />
        <div>
          <h3 className="text-lg font-bold">{feed.name}</h3>
          <p className="text-sm text-gray-600">{feed.introduction}</p>
        </div>
        <p className="text-xs text-gray-500">{feed.uploadedTime}</p>
      </div>

      {/* 글 및 사진 영역 */}
      <div className="m-3">
        <div className="mb-2 items-center text-sm">
          <span>
            {isExpanded || feed.content.length <= MAX_CONTENT_LENGTH
              ? feed.content
              : `${feed.content.slice(0, MAX_CONTENT_LENGTH)}...`}
          </span>
          {feed.content.length > MAX_CONTENT_LENGTH && (
            <button
              className="ml-2 text-gray-500"
              onClick={handleToggleContent}
            >
              {isExpanded ? "접기" : "더보기"}
            </button>
          )}
        </div>

        {/***** 사진 영역 *****/}
        {feed.image && feed.image.length === 1 && (
          <img
            src={feed.image[0]}
            alt="게시글 이미지"
            className="w-full rounded-lg object-cover"
          />
        )}

        {feed.image && feed.image.length === 2 && (
          <div className="grid grid-cols-2">
            {feed.image.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`게시글 이미지 ${index + 1}`}
                className="w-full rounded-lg object-cover"
              />
            ))}
          </div>
        )}

        {feed.image && feed.image.length === 3 && (
          <div className="grid grid-flow-col grid-rows-2">
            <img
              src={feed.image[0]}
              alt="게시글 이미지 1"
              className="row-span-2 h-full w-full rounded-lg object-cover"
            />
            {feed.image.slice(1).map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`게시글 이미지 ${index + 2}`}
                className="w-full rounded-lg object-cover"
              />
            ))}
          </div>
        )}

        {feed.image && feed.image.length >= 4 && (
          <div className="relative grid grid-flow-col grid-rows-2">
            <img
              src={feed.image[0]}
              alt="게시글 이미지 1"
              className="row-span-2 h-full w-full rounded-lg object-cover"
            />
            {feed.image.slice(1, 3).map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  alt={`게시글 이미지 ${index + 2}`}
                  className="w-full rounded-lg object-cover"
                />
                {/* 마지막 사진에 스타일 적용 */}
                {index === 2 && (
                  <div className="bg-opacity-50 absolute flex items-center justify-center rounded-lg backdrop-blur-sm">
                    <span className="text-lg font-bold text-white">
                      +{feed.image.length - 3}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 하단 인터랙션 아이콘 */}
      <FeedInteraction />
    </div>
  );
};

export default FeedItem;
