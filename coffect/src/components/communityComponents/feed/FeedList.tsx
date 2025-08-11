/*
author : 강신욱
description : FeedItem.tsx 로부터 피드를 받아 목록을 출력하는 컴포넌트입니다.
*/

import FeedItem from "../../shareComponents/FeedItem";
import type { ThreadSummary } from "@/types/community/postTypes"; // PostSummary 타입 임포트

interface FeedListProps {
  posts: ThreadSummary[]; // Post[] 대신 PostSummary[] 사용
}

const FeedList = ({ posts }: FeedListProps) => {
  return (
    <div className="w-full space-y-4 pt-3">
      {posts.map((post) => (
        <FeedItem key={post.threadId} post={post} /> // key를 post.threadId로 변경
      ))}
    </div>
  );
};

export default FeedList;
