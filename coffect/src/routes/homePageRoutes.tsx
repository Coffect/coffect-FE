/*
author : 이희선
description : 홈화면과 관련된 일정, 알림 라우트 정의 파일입니다.
*/

import Home from "../pages/Home";
import CalendarView from "../components/Home/CalenderView";
import AlarmView from "../components/Home/AlarmView";
import CardDetailView from "../components/Home/CardDetailView";

const homePageRoutes = [
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/home/calendar",
    element: <CalendarView />,
  },
  {
    path: "/home/alarm",
    element: <AlarmView />,
  },
  {
    path: "/home/cards/:id",
    element: <CardDetailView />,
  },
];

export default homePageRoutes;
