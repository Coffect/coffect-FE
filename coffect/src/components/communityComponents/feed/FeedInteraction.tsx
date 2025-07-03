const FeedInteraction = () => {
  const buttonStyle = "text-sm text-gray-600 hover:text-blue-500";

  return (
    <div className="mt-4 flex items-center justify-between">
      <button className={buttonStyle}>좋아요</button>
      <button className={buttonStyle}>댓글</button>
      <button className={buttonStyle}>인용</button>
      <button className={buttonStyle}>공유</button>
      <button className={buttonStyle}>저장</button>
    </div>
  );
};

export default FeedInteraction;
