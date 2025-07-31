/** 
 * @author : 강신욱
 * @description : community 상단 고정바 컴포넌트입니다. 

//Header UI
*/

import { SlidersHorizontal } from "lucide-react";
import { useCommunityHeaderFilters } from "../../hooks/community/useCommunityHeaderFilters";

// 공통 스타일 변수 정의
const buttonStyle =
  "flex h-[65%] w-[20%] items-center justify-center rounded-lg border border-[var(--gray-30)] text-[16px] text-[var(--gray-60)] font-md ";
const containerStyle = "flex items-center";
const activeButtonStyle =
  "bg-[var(--gray-70)] text-white font-semibold border-none";

interface HeaderProps {
  openModal: () => void;
}

const Header = ({ openModal }: HeaderProps) => {
  // 커스텀 훅에서 상태와 핸들러 함수를 가져옵니다.
  const {
    activeFilter,
    handleFilterClick,
    handleLatestClick,
    handlePopularClick,
  } = useCommunityHeaderFilters();

  return (
    <div className="sticky top-0 z-10 flex h-[15%] max-h-[120px] w-full flex-col border-b-[var(--gray-70)] bg-white">
      <div className="flex h-full w-full flex-col">
        {/***** 상단바 : Coffect *****/}
        <div className={`${containerStyle} h-[50%] justify-between p-6`}>
          <div className="text-2xl font-bold text-black">커뮤니티</div>
        </div>

        {/***** 필터바 : 필터 / 최신순 / 인기순 / 내학교 UI *****/}
        <div className={`${containerStyle} h-[50%] justify-start gap-1 px-6`}>
          <button
            onClick={() => {
              handleFilterClick(); // 훅의 필터 핸들러 호출
              openModal(); // 기존 모달 열기 함수 호출
            }}
            className={`flex h-[65%] w-[12%] items-center justify-center rounded-lg border border-[var(--gray-30)] text-sm ${
              activeFilter === "filter"
                ? activeButtonStyle
                : "text-[var(--gray-60)]"
            }`}
          >
            <SlidersHorizontal
              size={16}
              className={`${activeFilter === "filter" ? "text-white" : "text-[var(--gray-60)]"}`}
            />
          </button>
          <button
            onClick={handleLatestClick}
            className={`${buttonStyle} ${activeFilter === "latest" ? activeButtonStyle : ""}`}
          >
            최신순
          </button>
          <button
            onClick={handlePopularClick}
            className={`${buttonStyle} ${activeFilter === "popular" ? activeButtonStyle : ""}`}
          >
            인기순
          </button>
        </div>
      </div>
      {/* 구분선 */}
      <div className="h-[7.3%] min-h-[6px] w-full bg-[var(--gray-5)]"></div>
    </div>
  );
};

export default Header;
