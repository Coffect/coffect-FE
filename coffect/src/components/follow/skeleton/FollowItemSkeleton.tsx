/**
 * @description 팔로워/팔로잉 유저 아이템의 스켈레톤 UI
 */

const FollowItemSkeleton = () => {
  return (
    <div className="flex items-center justify-between border-b border-[var(--gray-20)] px-4 py-3">
      <div className="flex items-center gap-3 pb-1">
        <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--gray-20)]" />

        <div className="flex flex-col gap-1">
          <div className="h-4 w-24 animate-pulse rounded bg-[var(--gray-20)]" />
          <div className="h-3 w-16 animate-pulse rounded bg-[var(--gray-20)]" />
        </div>
      </div>

      <div className="h-7 w-16 animate-pulse rounded-md bg-[var(--gray-20)]" />
    </div>
  );
};

export default FollowItemSkeleton;
