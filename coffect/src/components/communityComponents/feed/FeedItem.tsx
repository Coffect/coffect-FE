import "./FeedInteraction";

const FeedItem = ({ feed }: { feed: any }) => {
  return (
    <div className="border-b border-gray-300 p-4">
      {/* 사용자 프로필 영역 */}
      <div className="mb-4 flex items-center">
        <img
          src={feed.profileImage}
          alt="프로필 사진"
          className="mr-4 h-12 w-12 rounded-full"
        />
        <div>
          <h3 className="text-lg font-bold">{feed.name}</h3>
          <p className="text-sm text-gray-600">{feed.introduction}</p>
        </div>
      </div>

      {/* 글 및 사진 영역 */}
      <div className="mb-4">
        <p className="text-md mb-2">{feed.content}</p>
        {feed.image && (
          <img
            src={feed.image}
            alt="게시글 이미지"
            className="w-full rounded-lg"
          />
        )}
        <p className="mt-2 text-xs text-gray-500">{feed.uploadedTime}</p>
      </div>

      {/* 하단 인터랙션 아이콘 */}
      <FeedInteraction />
    </div>
  );
};

export default FeedItem;
