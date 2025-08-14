import { useNavigate } from "react-router-dom";
import FeedItem from "../../shareComponents/FeedItem";
import { useQuery } from "@tanstack/react-query";
import { getBookMark, getProfile } from "@/api/profile";
import LoadingScreen from "@/components/shareComponents/LoadingScreen";

import backIcon from "../../../assets/icon/mypage/back.png";
import emptyFeedIcon from "../../../assets/icon/mypage/emptyFeed.png";

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
      <div className="flex flex-1 flex-col overflow-y-auto">
        {sortedBookMarkPosts.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-4">
            <span className="text-md mb-3 text-[var(--gray-50)]">
              아직 저장한 글이 없어요!
            </span>
            <img src={emptyFeedIcon} className="h-10 w-10 opacity-40" />
          </div>
        ) : (
          <>
            {sortedBookMarkPosts.map((post) => (
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
          </>
        )}
      </div>
    </div>
  );
};

export default BookMark;
