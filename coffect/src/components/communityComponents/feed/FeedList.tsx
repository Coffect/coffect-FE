import FeedItem from "./FeedItem";

const FeedList = ({ feeds }: { feeds: any[] }) => {
  return (
    <div className="w-full">
      {feeds.map((feed, index) => (
        <FeedItem key={index} feed={feed} />
      ))}
    </div>
  );
};

export default FeedList;
