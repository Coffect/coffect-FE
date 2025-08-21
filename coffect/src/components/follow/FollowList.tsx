/*
author : 강신욱
description : FeedItem.tsx 로부터 피드를 받아 목록을 출력하는 컴포넌트입니다.
*/

// import FeedItem from "../../shareComponents/FeedItem";
// import type { ThreadSummary } from "@/types/community/postTypes"; // PostSummary 타입 임포트
import FollowItem from "./FollowItem";
import type { ListUpFollow } from "@/types/follow/listUpFollow";

interface FollowListProps {
  users: ListUpFollow[];
  myUserId?: number;
}

const FeedList = ({ users, myUserId }: FollowListProps) => {
  return (
    <div className="w-full">
      {users.map((user) => (
        <FollowItem key={user.userId} user={user} myUserId={myUserId} />
      ))}
    </div>
  );
};

export default FeedList;
