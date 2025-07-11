/*
author : 강신욱
description : 커뮤니티 검색 관련 라우트 정의 파일입니다.
*/

import type { RouteObject } from "react-router-dom";
import Search from "../pages/Search";

const CommunitySearchRoutes: RouteObject[] = [
  {
    path: "community/search",
    element: <Search />,
  },
];

export default CommunitySearchRoutes;
