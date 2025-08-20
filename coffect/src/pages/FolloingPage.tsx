import { useParams } from "react-router-dom";
import {
  // useFollowingListQuery,
  useFollowCountQuery,
  useFollowingListQuery,
} from "@/hooks/follow/query";
import FollowList from "@/components/follow/FollowList";
import FollowHeader from "@/components/follow/followHeader";
import FollowingListSkeleton from "@/components/follow/skeleton/FollowingListSkeleton";
import FollowItemSkeleton from "@/components/follow/skeleton/FollowItemSkeleton";
import followZero from "@/assets/icon/shareComponents/followZero.png";

const FollowingPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const Id = Number(userId);

  const { data, isPending, isFetchingNextPage } = useFollowingListQuery({
    oppentUserId: Id,
  });

  const { data: followCountData } = useFollowCountQuery({ userId: Id });
  const followingCount = followCountData?.success?.[0];

  if (!userId) {
    return <div>User not found</div>;
  }

  if (isPending) {
    return (
      <div>
        <FollowHeader follow="Following" count={followingCount} />
        <FollowingListSkeleton />
      </div>
    );
  }

  const users = data?.pages.flatMap((page) => page.success ?? []) ?? [];

  if (users.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <FollowHeader follow="Following" count={followingCount} />
        <div className="flex flex-1 flex-col items-center justify-center gap-3.5">
          <div className="text-xl font-bold text-[var(--gray-90)]">
            아직 팔로잉이 없어요
          </div>
          <div>
            <img src={followZero} alt="팔로잉 없음" className="h-11 w-11" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <FollowHeader follow="Following" count={followingCount} />
      <div className="flex flex-col items-center px-4">
        <FollowList users={users} />
        {isFetchingNextPage && <FollowItemSkeleton />}
      </div>
    </div>
  );
};

export default FollowingPage;
