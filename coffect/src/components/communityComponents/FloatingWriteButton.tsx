/* author : 강신욱
description : community 글쓰기 버튼입니다. 
*/

import { useNavigate } from "react-router-dom";
// import { Pencil } from "lucide-react";
import pencil from "../../assets/icon/community/pencilIcon.png";

/*****  글쓰기 FloatingButton 클릭 시에 글쓰기 페이지로 이동합니다. *****/
const FloatingWriteButton = () => {
  const navigate = useNavigate();

  const handleWriteClick = () => {
    navigate("/community/write");
  };

  return (
    <button
      onClick={handleWriteClick}
      className="absolute right-4 bottom-[calc(81px+16px)] z-20 flex h-16 w-16 items-center justify-center rounded-full bg-[#ff8126] text-white shadow-lg"
    >
      <img src={pencil} alt="pencil Icon" className="h-[30px] w-[30px]" />
    </button>
  );
};

export default FloatingWriteButton;
