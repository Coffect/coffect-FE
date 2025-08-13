import FeedItemSkeleton from "../../shareComponents/post/FeedItemSkeleton";

const FeedListSkeleton = ({ count = 3 }) => {
  return (
    <div className="w-full space-y-4 pt-3">
      {Array.from({ length: count }).map((_, index) => (
        <FeedItemSkeleton key={index} />
      ))}
    </div>
  );
};

export default FeedListSkeleton;
