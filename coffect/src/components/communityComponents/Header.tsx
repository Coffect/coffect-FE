/* author : 강신욱
description : community 상단 고정바 컴포넌트입니다. 
*/

import { useNavigate } from "react-router-dom";
import { Search, Pencil, SlidersHorizontal } from "lucide-react";

// 공통 스타일 변수 정의
const buttonStyle = "px-4 py-2 text-sm text-gray-600 border border-gray-300 ";
const containerStyle = "flex items-center";

interface HeaderProps {
  openModal: () => void;
}

const Header = ({ openModal }: HeaderProps) => {
  /*****  검색 클릭 시 community/search 페이지로 이동 *****/
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate("/community/search");
  };

  return (
    <div className="sticky top-0 z-10 flex w-full flex-col border-b-gray-700 bg-white">
      <div className="flex w-full flex-col">
        {/***** 상단바 : Coffect / 검색 / 글쓰기 UI *****/}
        <div className={`${containerStyle} h-12 justify-between px-4`}>
          <div className="text-lg font-bold text-black">coffect</div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSearchClick}
              className="w-auto items-center gap-2 border border-gray-700 p-2 px-4 py-2 text-sm"
            >
              <Search size={20} className="text-gray-600" />
            </button>
            <button
              onClick={() => navigate("/community/write")}
              className="w-auto items-center gap-2 border border-gray-700 p-2 px-4 py-2 text-sm"
            >
              <Pencil size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/***** 필터바 : 필터 / 최신순 / 인기순 / 내학교 UI *****/}
        <div className={`${containerStyle} h-12 justify-start gap-2 px-4`}>
          <button
            onClick={openModal}
            className="flex w-auto items-center gap-2 border border-gray-300 px-4 py-2 text-sm text-gray-600"
          >
            <SlidersHorizontal size={16} className="text-gray-600" />
          </button>
          <button className={buttonStyle}>최신순</button>
          <button className={buttonStyle}>인기순</button>
          <button className={buttonStyle}>내학교</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
