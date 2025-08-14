/*
author : 재하
description : 마이페이지, 유저페이지 등 사용자 관련 라우트 정의 파일입니다.
*/

import MyPage from "../pages/MyPage";
import MyProfile from "../components/UserPage/MyPage/MyProfile/MyProfile";
import TimeTable from "../components/UserPage/MyPage/TimeTable";
import ChatCard from "../components/UserPage/MyPage/ChatRecord/ChatCard";
import ChatRecord from "../components/UserPage/MyPage/ChatRecord/ChatRecord";
import Modify from "../components/UserPage/MyPage/MyProfile/Modify/Modify";
import BookMark from "../components/UserPage/MyPage/BookMark";
import UserProfile from "../components/UserPage/OtherUserPage/UserProfile";

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
    element: <MyProfile />,
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
    // element: <UserPage />,
    element: <UserProfile />,
  },
];

export default userPageRoutes;
