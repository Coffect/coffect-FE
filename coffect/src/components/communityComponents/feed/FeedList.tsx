/*
author : 강신욱
description : FeedItem.tsx 로부터 피드를 받아 목록을 출력하는 컴포넌트입니다.
*/

import FeedItem from "../../shareComponents/FeedItem";
import type { Post } from "../../../types/community";

interface FeedListProps {
  posts: Post[];
}

const FeedList = ({ posts }: FeedListProps) => {
  return (
    <div className="w-full space-y-4 pt-3">
      {posts.map((post) => (
        <FeedItem key={post.id} post={post} />
      ))}
    </div>
  );
};

export default FeedList;
