import FollowItemSkeleton from "./FollowItemSkeleton";

const FollowingListSkeleton = () => {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 8 }).map((_, idx) => (
        <FollowItemSkeleton key={idx} />
      ))}
    </div>
  );
};

export default FollowingListSkeleton;
