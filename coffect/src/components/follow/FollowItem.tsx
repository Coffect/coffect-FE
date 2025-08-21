/**
 * @description 팔로워/팔로잉 유저 하나를 보여주는 아이템
 */

import type { ListUpFollow } from "@/types/follow/listUpFollow";
import { useNavigate } from "react-router-dom";
import { useFollowMutation } from "@/hooks/community/mutation/useFollowMutation";
import { useQuery } from "@tanstack/react-query";
import { getIsFollow } from "@/api/follow";

interface FollowItemProps {
  user: ListUpFollow;
  myUserId?: number;
}

const FollowItem = ({ user, myUserId }: FollowItemProps) => {
  const navigate = useNavigate();
  const { mutate: follow } = useFollowMutation();

  // 자신의 리스트인지 확인
  const isMyList = user.userId === myUserId;

  const handleUserClick = () => {
    navigate(`/userpage/${user.id}`);
  };

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    follow(user.userId);
  };

  const { data: isFollow } = useQuery({
    queryKey: ["isFollow", user.userId],
    queryFn: () => getIsFollow(user.userId),
  });

  const isFollowing = isFollow?.success === true;

  return (
    <div
      onClick={handleUserClick}
      className="flex items-center justify-between border-b border-gray-200 py-3.25 hover:bg-gray-50"
    >
      <div className="flex items-center gap-3">
        <img
          src={user.profileImage || "/default-profile.png"}
          alt={user.name}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <p className="text-[16px] font-semibold text-[var(--gray-90)]">
            {user.name}
          </p>
          <p className="text-[16px] font-normal text-[var(--gray-50)]">
            {user.id}
          </p>
        </div>
      </div>
      {!isMyList && (
        <button
          onClick={handleFollowClick}
          className={`rounded-md px-4 py-1.5 text-sm font-semibold ${isFollowing ? "bg-[var(--gray-10)] text-[var(--gray-70)]" : "bg-[var(--gray-60)] text-white"}`}
        >
          {isFollowing ? "팔로잉" : "팔로우"}
        </button>
      )}
    </div>
  );
};

export default FollowItem;
