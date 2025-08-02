/**
 * @author 흥부/강신욱
 * @description 글 작성 페이지의 내용 입력 컴포넌트입니다.
 *              사용자가 게시글 내용을 입력할 수 있는 텍스트 영역과 이미지/링크 추가 버튼을 포함합니다.
 *              이 컴포넌트는 글 작성 페이지의 UI를 구성하며, 상태와 로직은 useWritePost 훅에서 관리합니다.
 */

import React from "react";
import { Image, Link } from "lucide-react";

/**
 * @interface WritePostContentInputProps
 * @description
 * 이 인터페이스는 WritePostContentInput 컴포넌트의 props 타입을 정의합니다.
 * @property content - 게시글 내용
 * @property setContent - 게시글 내용을 업데이트하는 함수
 */
interface WritePostContentInputProps {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

const WritePostContentInput: React.FC<WritePostContentInputProps> = ({
  content,
  setContent,
}) => {
  return (
    <div className="p-4">
      <textarea
        placeholder="오늘은 어떤 글을 써볼까요?"
        className="h-55 w-full rounded focus:outline-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="my-2 flex items-center space-x-4">
        <button className="rounded px-1 text-sm">
          <Image />
        </button>
        <button className="rounded px-1 text-sm">
          <Link />
        </button>
      </div>
    </div>
  );
};

export default WritePostContentInput;
