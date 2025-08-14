/*
author : 재하
description : 로그인 한 사용자 or 특정 유저를 구분하여
              유저 페이지를 출력하는 page 컴포넌트입니다.
*/

import MyPage from "./MyPage";

const UserPage = () => {
  // UI 확인을 위한 임시 변수 ( 사용자가 나인지 구분 )
  const isUser = true;

  return <>{isUser ? <MyPage /> : <MyPage />}</>;
};

export default UserPage;
