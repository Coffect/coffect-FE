/**
 * @author 흥부/강신욱
 * @description
 * WritePostTitleInput 컴포넌트는 게시글 작성 페이지에서 제목을 입력받는 입력 필드를 제공합니다.
 * 이 컴포넌트는 제목을 입력할 수 있는 텍스트 입력 필드를 렌더링하며, 입력된 제목을 상위 컴포넌트로 전달하는 역할을 합니다.
 */
import React from "react";

/**
 * @interface WritePostTitleInputProps
 * @description
 * WritePostTitleInput 컴포넌트에 전달되는 props의 타입을 정의합니다.
 * @property title - 현재 입력된 제목 문자열
 * @property setTitle - 제목을 업데이트하는 함수
 */
interface WritePostTitleInputProps {
  title: string;
  setTitle: (title: string) => void;
}

const WritePostTitleInput: React.FC<WritePostTitleInputProps> = ({
  title,
  setTitle,
}: WritePostTitleInputProps) => {
  return (
    <div className="flex items-center justify-center px-4 py-4 text-center">
      <input
        type="text"
        placeholder="제목을 입력하세요"
        className="w-full text-xl font-bold placeholder:text-xl placeholder:font-bold placeholder:text-[#121212] focus:outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>
  );
};

export default WritePostTitleInput;
