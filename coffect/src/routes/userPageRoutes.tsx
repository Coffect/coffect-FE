/*
author : 재하
description : 마이페이지, 유저페이지 등 사용자 관련 라우트 정의 파일입니다.
*/

import MyPage from "@/pages/MyPage";
import TimeTable from "@/components/UserPage/MyPage/TimeTable";
import ChatCard from "@/components/UserPage/MyPage/ChatRecord/ChatCard";
import ChatRecord from "@/components/UserPage/MyPage/ChatRecord/ChatRecord";
import Modify from "@/components/UserPage/Profile/Modify/Modify";
import BookMark from "@/components/UserPage/MyPage/BookMark";
import UserProfile from "@/components/UserPage/Profile/UserProfile";
import FollowerPage from "@/pages/FollowerPage";
import FollowingPage from "@/pages/FolloingPage";

/*
사용자 관련 페이지 라우트 배열을 반환합니다.
*/
const userPageRoutes = [
  {
    path: "/mypage",
    element: <MyPage />,
  },
  {
    path: "/mypage/myprofile",
    element: <UserProfile />,
  },
  {
    path: "/mypage/myprofile/modify",
    element: <Modify />,
  },
  {
    path: "/mypage/timetable",
    element: <TimeTable />,
  },
  {
    path: "/mypage/chatrecord",
    element: <ChatRecord />,
  },
  {
    path: "/mypage/chatrecord/:id",
    element: <ChatCard />,
  },
  {
    path: "/mypage/bookmark",
    element: <BookMark />,
  },
  {
    path: "/userpage/:id",
    element: <UserProfile />,
  },
  {
    path: "/followerList/:userId",
    element: <FollowerPage />,
  },
  {
    path: "/followingList/:userId",
    element: <FollowingPage />,
  },
];

export default userPageRoutes;
