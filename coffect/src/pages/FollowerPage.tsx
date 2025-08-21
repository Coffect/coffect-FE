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
import followZero from "@/assets/icon/shareComponents/followZero.png";
import { useQuery } from "@tanstack/react-query";
import type { profileType } from "@/types/mypage/profile";
import { getProfile } from "@/api/profile";
import { useEffect, useState } from "react";
import { getChangeId } from "@/api/share/changeId";
import { getUserNameById } from "@/api/home";

const FollowerPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const Id = Number(userId);
  const [userName, setUserName] = useState("");
  const [isFetchingUserName, setIsFetchingUserName] = useState(true);

  const { data, isPending, isFetchingNextPage } = useFollowerListQuery({
    oppentUserId: Id,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userIdData = await getChangeId(Id);
        console.log("userIdData", userIdData);
        if (userIdData.success) {
          const newUserName = await getUserNameById(userIdData.success.id);
          setUserName(newUserName);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsFetchingUserName(false);
      }
    };
    if (Id) {
      fetchData();
    }
  }, [Id]);

  const { data: followCountData } = useFollowCountQuery({ userId: Id });
  const followerCount = followCountData?.success?.[1];

  const { data: myProfile } = useQuery<profileType>({
    queryKey: ["myProfile"],
    queryFn: getProfile,
  });
  const myUserId = myProfile?.success?.userInfo.userId;

  if (!userId) {
    return <div>User not found</div>;
  }

  if (isPending) {
    return (
      <div>
        <FollowHeader follow="Follower" count={0} myId="Coffect.." />
        <FollowingListSkeleton />
      </div>
    );
  }

  const users = data?.pages.flatMap((page) => page.success ?? []) ?? [];

  if (users.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <FollowHeader
          follow="Follower"
          count={followerCount}
          myId={isFetchingUserName ? "Coffect.." : userName}
        />
        <div className="flex flex-1 flex-col items-center justify-center gap-3.5">
          <div className="text-xl font-bold text-[var(--gray-90)]">
            아직 팔로워가 없어요
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
      <FollowHeader
        follow="Follower"
        count={followerCount}
        myId={isFetchingUserName ? "Coffect.." : userName}
      />
      <div className="flex flex-col items-center px-4">
        <FollowList users={users} myUserId={myUserId} />
        {isFetchingNextPage && <FollowItemSkeleton />}
      </div>
    </div>
  );
};

export default FollowerPage;
