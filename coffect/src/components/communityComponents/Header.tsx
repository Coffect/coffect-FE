/* author : 강신욱
description : community 상단 고정바 컴포넌트입니다. 
*/

// 공통 스타일 변수 정의
const buttonStyle = "border-4 text-sm text-gray-600 hover:text-gray-800";
const containerStyle = "flex items-center";

interface HeaderProps {
  openModal: () => void;
}

const Header = ({ openModal }: HeaderProps) => {
  return (
    <div className="sticky top-0 z-10 flex w-full flex-col bg-white shadow-md">
      <div className="flex w-full flex-col">
        {/***** 상단바 : Coffect / 검색 / 글쓰기 UI *****/}
        <div className={`${containerStyle} h-14 justify-between px-6`}>
          <div className="text-lg font-bold text-black">coffect</div>
          <div className="flex items-center space-x-4">
            <button className={buttonStyle}>검색</button>
            <button className={buttonStyle}>글쓰기</button>
          </div>
        </div>

        {/***** 필터바 : 필터 / 최신순 / 인기순 / 내학교 UI *****/}
        <div className={`${containerStyle} h-14 justify-start gap-3 pl-6`}>
          <button className={buttonStyle} onClick={openModal}>
            필터
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
