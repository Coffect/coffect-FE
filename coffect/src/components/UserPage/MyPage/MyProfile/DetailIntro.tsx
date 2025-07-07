/*
author : 재하
description : 마이페이지 상세 소개 - 관심 키워드/상세 프로필 래퍼 컴포넌트입니다.
*/
import DetailIntroKeyword from "./DetailIntroKeyword";
import DetailIntroProfile from "./DetailIntroProfile";

const DetailIntro = () => {
  /*
  관심 키워드와 상세 프로필 컴포넌트를 묶어서 출력합니다.
  */
  return (
    <div className="flex w-full flex-col justify-center">
      {/* 관심 키워드 컴포넌트 */}
      <DetailIntroKeyword />
      {/* 상세 프로필 컴포넌트 */}
      <DetailIntroProfile />
    </div>
  );
};

export default DetailIntro;
