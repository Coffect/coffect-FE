/*
author : 강신욱
description : FeedItem.tsx 로부터 피드를 받아 목록을 출력하는 컴포넌트입니다.
*/

import FeedItem from "../../shareComponents/FeedItem";
import type { ThreadSummary } from "@/types/community/postTypes";

interface FeedListProps {
  posts: ThreadSummary[];
  myUserId?: number;
}

const FeedList = ({ posts, myUserId }: FeedListProps) => {
  return (
    <div className="w-full space-y-4 pt-3">
      {posts.map((post) => (
        <FeedItem key={post.threadId} post={post} myUserId={myUserId} />
      ))}
    </div>
  );
};

export default FeedList;
