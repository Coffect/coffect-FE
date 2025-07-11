/*
author : 박재하
description : 게시글 목록을 출력하는 컴포넌트입니다.
*/

import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="flex h-dvh w-dvw justify-center bg-gray-100">
      <div className="flex h-full w-full max-w-[430px] flex-col bg-white">
        {/* Main 영역 */}
        <main className="h-full w-full bg-green-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
