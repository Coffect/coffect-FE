const FeedInteraction = () => {
  const buttonStyle = "text-sm text-gray-600 hover:text-blue-500";

  return (
    <div className="mt-2 flex items-center justify-between">
      <div className="itmes-center flex gap-3">
        <button className={buttonStyle}>좋아요: num</button>
        <button className={buttonStyle}>댓글: num</button>
        <button className={buttonStyle}>인용</button>
        <button className={buttonStyle}>공유: num</button>
      </div>
      <div className="flex items-center">
        <button className={buttonStyle}>저장</button>
      </div>
    </div>
  );
};

export default FeedInteraction;
