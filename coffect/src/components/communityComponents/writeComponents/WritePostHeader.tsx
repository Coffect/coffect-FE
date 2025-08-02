/**
 * @author 흥부/강신욱
 * @description 글 작성 페이지의 헤더 컴포넌트입니다.
 *              사용자가 글 작성 페이지에서 뒤로가기 버튼과 완료 버튼을 사용할 수 있도록 합니다.
 *              이 컴포넌트는 글 작성 페이지의 UI를 구성하며, 상태와 로직은 useWritePost 훅에서 관리합니다.
 */
import React from "react";
import { ChevronLeft } from "lucide-react";

/**
 * @interface WritePostHeaderProps
 * @description
 * 이 인터페이스는 WritePostHeader 컴포넌트의 props 타입을 정의합니다.
 * @property isFormValid - 폼 유효성 검사 결과 (제목과 내용이 비어있지 않은지 여부)
 * @property handleBackClick - 뒤로가기 버튼 클릭 시 호출되는 함수
 * @property handleUpload - 완료 버튼 클릭 시 호출되는 함수
 */
interface WritePostHeaderProps {
  isFormValid: boolean;
  handleBackClick: () => void;
  handleUpload: () => void;
}

const WritePostHeader: React.FC<WritePostHeaderProps> = ({
  isFormValid,
  handleBackClick,
  handleUpload,
}) => {
  return (
    <header className="flex items-center justify-between p-4">
      <button onClick={handleBackClick}>
        <ChevronLeft />
      </button>
      <h1 className="text-lg font-bold">글 작성하기</h1>
      <button
        className={`rounded font-bold ${isFormValid ? "text-[#ff8126]" : "cursor-not-allowed text-gray-300"}`}
        disabled={!isFormValid}
        onClick={handleUpload}
      >
        완료
      </button>
    </header>
  );
};

export default WritePostHeader;
