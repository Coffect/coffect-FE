import { useNavigate } from "react-router-dom";
import FeedItem from "../../shareComponents/FeedItem";
import type { ThreadSummary } from "../../../types/community/postTypes";

import backIcon from "../../../assets/icon/mypage/back.png";
import emptyFeedIcon from "../../../assets/icon/mypage/emptyFeed.png";

const myDummyPosts: ThreadSummary[] = [];

const BookMark = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex h-full w-full flex-col bg-white px-4">
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between py-3">
          <button
            className="pr-9 text-left text-3xl"
            onClick={() => navigate("/mypage")}
          >
            <img src={backIcon} className="h-6 w-6" />
          </button>
          <div className="flex-1 items-center justify-center pr-15 text-center">
            <span className="text-lg font-semibold">저장한 콘텐츠</span>
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto py-5">
          {/* 내 피드 탭이 활성화된 경우 피드 내용 출력 */}
          {myDummyPosts.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center">
              <span className="text-md mb-3 text-[var(--gray-50)]">
                아직 작성한 글이 없어요!
              </span>
              <img src={emptyFeedIcon} className="h-10 w-10 opacity-40" />
            </div>
          ) : (
            <>
              {myDummyPosts.map((post) => (
                <FeedItem key={post.threadId} post={post} />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BookMark;
