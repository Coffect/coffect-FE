import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import FeedItem from "../../shareComponents/FeedItem";
import { useQuery } from "@tanstack/react-query";
import { getBookMark, getProfile } from "@/api/profile";
import LoadingScreen from "@/components/shareComponents/LoadingScreen";
import { useInView } from "react-intersection-observer";

import backIcon from "../../../assets/icon/mypage/back.png";
import emptyFeedIcon from "../../../assets/icon/mypage/emptyFeed.png";
import FeedListSkeleton from "@/components/communityComponents/feed/FeedListSkeleton";

const BookMark = () => {
  const navigate = useNavigate();

  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
  });

  const { data: bookMarkData, isLoading: isBookMarkLoading } = useQuery({
    queryKey: ["bookMark"],
    queryFn: () => getBookMark(),
  });
  const bookMarkPosts = bookMarkData?.success || [];
  const sortedBookMarkPosts = [...bookMarkPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  // 무한 스크롤 상태
  const PAGE_SIZE = 10;
  const [visibleCount, setVisibleCount] = useState<number>(
    Math.min(PAGE_SIZE, sortedBookMarkPosts.length),
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { ref: sentinelRef, inView } = useInView({
    threshold: 0,
    root: scrollContainerRef.current,
  });

  // 데이터가 바뀌면 초기화
  useEffect(() => {
    setVisibleCount(Math.min(PAGE_SIZE, sortedBookMarkPosts.length));
  }, [sortedBookMarkPosts.length]);

  // sentinel 관찰되면 다음 청크 표시
  useEffect(() => {
    if (!inView) return;
    if (visibleCount >= sortedBookMarkPosts.length) return;
    setVisibleCount((prev) =>
      Math.min(prev + PAGE_SIZE, sortedBookMarkPosts.length),
    );
  }, [inView, visibleCount, sortedBookMarkPosts.length]);

  if (isProfileLoading || isBookMarkLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between px-4 py-3">
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
      {/* 저장된 콘텐츠 출력 */}
      <div
        className="flex flex-1 flex-col overflow-y-auto"
        ref={scrollContainerRef}
      >
        {sortedBookMarkPosts.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-4">
            <span className="text-md mb-3 text-[var(--gray-50)]">
              아직 저장한 글이 없어요!
            </span>
            <img src={emptyFeedIcon} className="h-10 w-10 opacity-40" />
          </div>
        ) : (
          <>
            {sortedBookMarkPosts.slice(0, visibleCount).map((post) => (
              <FeedItem
                key={post.threadId}
                post={post}
                showFollowButton={
                  profileData?.success?.userInfo.id === post.user.id
                    ? false
                    : true
                }
                showBookmarkButton={true}
              />
            ))}
            {visibleCount < sortedBookMarkPosts.length && (
              <>
                <div ref={sentinelRef} className="flex h-1 justify-center py-4">
                  <FeedListSkeleton count={1} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookMark;
