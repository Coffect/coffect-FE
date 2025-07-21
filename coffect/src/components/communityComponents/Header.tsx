/* author : 강신욱
description : community 상단 고정바 컴포넌트입니다. 
*/

import { SlidersHorizontal } from "lucide-react";

// 공통 스타일 변수 정의
const buttonStyle =
  "flex h-[65%] w-[20%] items-center justify-center rounded-lg border border-gray-300 text-sm text-[##4a4a4a] font-semibold ";
const containerStyle = "flex items-center";

interface HeaderProps {
  openModal: () => void;
}

const Header = ({ openModal }: HeaderProps) => {
  return (
    <div className="sticky top-0 z-10 flex h-[15%] max-h-[120px] w-full flex-col border-b-gray-700 bg-white">
      <div className="flex h-full w-full flex-col">
        {/***** 상단바 : Coffect / 검색 / 글쓰기 UI *****/}
        <div className={`${containerStyle} h-[50%] justify-between p-6`}>
          <div className="text-2xl font-bold text-black">커뮤니티</div>
        </div>

        {/***** 필터바 : 필터 / 최신순 / 인기순 / 내학교 UI *****/}
        <div className={`${containerStyle} h-[50%] justify-start gap-1 px-6`}>
          <button
            onClick={openModal}
            className="flex h-[65%] w-[12%] items-center justify-center rounded-lg border border-gray-300 text-sm text-gray-600"
          >
            <SlidersHorizontal size={16} className="text-gray-600" />
          </button>
          <button className={`${buttonStyle} `}>최신순</button>
          <button className={`${buttonStyle} `}>인기순</button>
        </div>
      </div>
      {/* 구분선 */}
      <div className="h-[7.3%] min-h-[6px] w-full bg-[#F5F5F5]"></div>
    </div>
  );
};

export default Header;
