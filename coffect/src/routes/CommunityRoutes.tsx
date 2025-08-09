/*
author : 강신욱 
description : 커뮤니티, 글 작성, 게시글 상세 페이지 등 커뮤니티 관련 라우트 정의 파일입니다.
*/

import type { RouteObject } from "react-router-dom";
import Community from "@/pages/Community";
import WritePostPage from "@/pages/WritePostPage";
import PostDetail from "@/pages/PostDetailPage";

const CommunityRoutes: RouteObject[] = [
  {
    path: "community",
    element: <Community />,
  },
  {
    path: "community/write",
    element: <WritePostPage />,
  },
  {
    path: "community/post/:id",
    element: <PostDetail />,
  },
];

export default CommunityRoutes;
