/*
author : 이희선
description : 홈화면과 일정, 알림, 추천 카드, 추천 카드 상세 보기 라우트 정의 파일입니다.
*/

import Home from "../pages/Home";
import CalendarView from "../components/Home/CalenderView";
import AlarmView from "../components/Home/AlarmView";
import CardsView from "../components/Home/CardsView";
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
    path: "/home/cards",
    element: <CardsView />,
  },
  {
    path: "/home/cards/:id",
    element: <CardDetailView />,
  },
];

export default homePageRoutes;
