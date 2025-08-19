import { useParams } from "react-router-dom";
import {
  useFollowCountQuery,
  // useFollowerListQuery,
  useFollowerListQuery,
} from "@/hooks/follow/query";
import FollowList from "@/components/follow/FollowList";
import FollowHeader from "@/components/follow/followHeader";
import FollowingListSkeleton from "@/components/follow/skeleton/FollowingListSkeleton";
import FollowItemSkeleton from "@/components/follow/skeleton/FollowItemSkeleton";

const FollowerPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const Id = Number(userId);

  const { data, isPending, isFetchingNextPage } = useFollowerListQuery({
    oppentUserId: Id,
  });

  const { data: followCountData } = useFollowCountQuery({ userId: Id });
  const followerCount = followCountData?.success?.[1];

  if (!userId) {
    return <div>User not found</div>;
  }

  if (isPending) {
    return (
      <div>
        <FollowHeader follow="Follower" count={followerCount} />
        <FollowingListSkeleton />
      </div>
    );
  }

  const users = data?.pages.flatMap((page) => page.success ?? []) ?? [];

  if (users.length === 0) {
    return (
      <div>
        <FollowHeader follow="Follower" count={followerCount} />
        <div className="flex h-100 items-center justify-center">
          <p className="text-[var(--gray-50)]">팔로워가 아직 없어요 !</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <FollowHeader follow="Follower" count={followerCount} />
      <div className="flex flex-col items-center px-4">
        <FollowList users={users} />
        {isFetchingNextPage && <FollowItemSkeleton />}
      </div>
    </div>
  );
};

export default FollowerPage;
