/*
 * author: 강신욱
 * description: 게시글 상세 페이지의 헤더 컴포넌트입니다.
 * 뒤로 가기 기능을 제공합니다.
 */

import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PostDetailHeader = () => {
  const navigate = useNavigate();

  // 뒤로 가기 버튼 클릭 시 이전 페이지로 이동합니다.
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <header className="sticky top-0 z-10 flex items-center border-b border-gray-200 bg-white p-4">
      <button onClick={handleGoBack} className="mr-4">
        <ChevronLeft className="h-6 w-6" />
      </button>
    </header>
  );
};

export default PostDetailHeader;
