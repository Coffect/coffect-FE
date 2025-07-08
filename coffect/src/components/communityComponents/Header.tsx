/* author : 강신욱
description : community 상단 고정바 컴포넌트입니다. 
*/

import { useNavigate } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";

// 공통 스타일 변수 정의
const buttonStyle =
  "w-[17.95%] h-[65%] text-sm text-gray-600 border border-gray-300  rounded-lg";
const containerStyle = "flex items-center";

interface HeaderProps {
  openModal: () => void;
}

const Header = ({ openModal }: HeaderProps) => {
  /*****  검색 클릭 시 community/search 페이지로 이동 *****/
  const navigate = useNavigate();

  // const handleSearchClick = () => {
  //   navigate("/community/search");
  // };

  return (
    <div className="sticky top-0 z-10 flex h-[15%] w-full flex-col border-b-gray-700 bg-white">
      <div className="flex h-full w-full flex-col">
        {/***** 상단바 : Coffect / 검색 / 글쓰기 UI *****/}
        <div className={`${containerStyle} h-[50%] justify-between p-6`}>
          <div className="text-2xl font-bold text-black">커뮤니티</div>
          {/* <div className="flex items-center space-x-2">
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
          </div> */}
        </div>

        {/***** 필터바 : 필터 / 최신순 / 인기순 / 내학교 UI *****/}
        <div className={`${containerStyle} h-[50%] justify-start gap-2 px-6`}>
          <button
            onClick={openModal}
            className="flex h-[65%] w-[12%] items-center justify-center rounded-lg border border-gray-300 text-sm text-gray-600"
          >
            <SlidersHorizontal size={16} className="text-gray-600" />
          </button>
          <button className={`${buttonStyle} w-[18%]`}>최신순</button>
          <button className={`${buttonStyle} w-[18%]`}>인기순</button>
        </div>
      </div>
      {/* 구분선 */}
      <div className="h-[7.3%] w-full bg-[#F5F5F5]"></div>
    </div>
  );
};

export default Header;
