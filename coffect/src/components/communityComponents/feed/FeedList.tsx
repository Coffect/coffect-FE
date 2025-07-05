/*
author : 강신욱
description : FeedItem.tsx 로부터 피드를 받아 목록을 출력하는 컴포넌트입니다.
*/

import FeedItem from "../../shareComponents/FeedItem";

// Post 타입 정의
interface Post {
  id: number;
  user: {
    profileImage: string;
    nickname: string;
  };
  image: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
}

interface FeedListProps {
  posts: Post[];
}

const FeedList = ({ posts }: FeedListProps) => {
  return (
    <div className="w-full space-y-4">
      {posts.map((post) => (
        <FeedItem key={post.id} post={post} />
      ))}
    </div>
  );
};

export default FeedList;
