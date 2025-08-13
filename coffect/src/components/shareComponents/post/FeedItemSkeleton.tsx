const FeedItemSkeleton = () => {
  return (
    <div className="border-b border-gray-200 pb-2">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-300 animate-pulse"></div>
          <div className="space-y-1">
            <div className="h-4 w-24 rounded bg-gray-300 animate-pulse"></div>
            <div className="h-3 w-16 rounded bg-gray-300 animate-pulse"></div>
          </div>
        </div>
        <div className="h-8 w-20 rounded-md bg-gray-300 animate-pulse"></div>
      </div>
      <div className="px-4 pb-4 space-y-3">
        <div className="h-5 w-3/4 rounded bg-gray-300 animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 rounded bg-gray-300 animate-pulse"></div>
          <div className="h-4 w-5/6 rounded bg-gray-300 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default FeedItemSkeleton;
