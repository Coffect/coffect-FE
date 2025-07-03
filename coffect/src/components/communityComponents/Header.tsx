/* author : 강신욱
description : community 상단 고정바 컴포넌트입니다. */

import { useState } from "react";
import FilterModal from "./BottomSeat/FilterModal";

// 공통 스타일 변수 정의
const buttonStyle = "border-4 text-sm text-gray-600 hover:text-gray-800";
const containerStyle = "flex items-center";

const Header = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible((prev) => !prev);
  };

  return (
    <>
      <header className="fixed top-0 z-10 flex h-[15%] w-full flex-col bg-white shadow-md">
        {/***** 상단바 : Coffect / 검색 / 글쓰기 UI *****/}
        <div className={`${containerStyle} h-[50%] justify-between px-6`}>
          <div className="text-lg font-bold text-black">coffect</div>
          <div className="flex items-center space-x-4">
            <button className={buttonStyle}>검색</button>
            <button className={buttonStyle}>글쓰기</button>
          </div>
        </div>

        {/***** 필터바 : 필터 / 최신순 / 인기순 / 내학교 UI *****/}
        <div className={`${containerStyle} h-[50%] justify-start gap-3 pl-6`}>
          <button className={buttonStyle} onClick={toggleModal}>
            필터
          </button>
          <button className={buttonStyle}>최신순</button>
          <button className={buttonStyle}>인기순</button>
          <button className={buttonStyle}>내학교</button>
        </div>
      </header>
      {/***** 모달 컴포넌트 *****/}
      <FilterModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

export default Header;
