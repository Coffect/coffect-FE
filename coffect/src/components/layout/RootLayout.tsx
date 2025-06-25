/*
author : 박재하
description : 게시글 목록을 출력하는 컴포넌트입니다.
*/

import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default RootLayout;
