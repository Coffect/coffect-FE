/* 
author : 강신욱
description : 피드의 하단(좋아요 수, 댓글 수, 인용, 공유 수, 저장)버튼에 대한 컴포넌트입니다. 
*/

// 공통 스타일 변수 정의
const buttonStyle = "text-sm text-gray-600 hover:text-blue-500";

interface FeedInteractionProps {
  likes: number;
  comments: number;
}

const FeedInteraction = ({ likes, comments }: FeedInteractionProps) => {
  return (
    <div className="mr-4 ml-4 flex items-center justify-between">
      <div className="itmes-center flex gap-2">
        <button className={buttonStyle}>좋아요: {likes}</button>
        <button className={buttonStyle}>댓글: {comments}</button>
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
