/**
 * @author 흥부/강신욱
 * @description : 글 작성 페이지의 UI를 담당하는 컴포넌트입니다.
                  모든 상태와 로직은 useWritePost 훅에서 관리하며, 이 컴포넌트는 UI를 렌더링하는 역할만 합니다.
*/
import React from "react";
import ChipGroup from "../ChipFilterComponent/ChipGroup";
import {
  postTypeOptions,
  postTopicOptions,
} from "../ChipFilterComponent/filterData";
//** 수정 사항 : Image와 Link icon이 디자인과 같지 않습니다.
import { ChevronLeft, Image, Link } from "lucide-react";
import { useWritePost } from "../../../hooks/useWritePost";

const WritePostUI: React.FC = () => {
  const {
    postType,
    handlePostTypeSelect,
    topic,
    handleTopicSelect,
    title,
    setTitle,
    content,
    setContent,
    isFormValid,
    handleBackClick,
    handleUpload,
  } = useWritePost();
  return (
    <div className="flex h-screen flex-col bg-white">
      {/* 헤더 영역: 뒤로가기 버튼, 제목, 완료 버튼 */}
      <header className="flex items-center justify-between p-4">
        {/* 뒤로가기 버튼: 클릭 시 handleBackClick 함수 실행 */}
        <button onClick={handleBackClick}>
          <ChevronLeft />
        </button>
        <h1 className="text-lg font-bold">글 작성하기</h1>
        {/* 완료 버튼: isFormValid 상태에 따라 활성화/비활성화 및 스타일 변경, 클릭 시 handleUpload 함수 실행 */}
        <button
          className={`rounded font-bold ${isFormValid ? "text-[var(--design-text)]" : "cursor-not-allowed text-[var(--gray-30)]"}`}
          disabled={!isFormValid}
          onClick={handleUpload}
        >
          완료
        </button>
      </header>
      {/* 메인 컨텐츠 영역 */}
      <main className="flex-grow">
        {/* 제목 입력 필드 */}
        <div className="flex items-center justify-center px-4 py-4 text-center">
          <input
            type="text"
            placeholder="제목을 입력하세요"
            className="w-full text-xl font-bold placeholder:text-xl placeholder:font-bold placeholder:text-[var(--gray-90)] focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="h-[0.8px] w-full bg-[var(--gray-5)]"></div>

        {/* 내용 입력 필드 및 이미지/링크 버튼 */}
        <div className="p-4">
          <textarea
            placeholder="오늘은 어떤 글을 써볼까요?"
            className="h-55 w-full rounded focus:outline-none"
            value={content}
            onChange={(e) => setContent(() => e.target.value)}
          />
          <div className="my-2 flex items-center space-x-4">
            {/* 이미지 추가 버튼 */}
            <button className="rounded px-1 text-sm">
              <Image />
            </button>
            {/* 링크 추가 버튼 */}
            <button className="rounded px-1 text-sm">
              <Link />
            </button>
          </div>
        </div>
        <div className="mb-4 h-[0.8px] w-full bg-[var(--gray-5)]"></div>

        {/* 글 종류 및 주제 선택 ChipGroup */}
        <div>
          <div className="px-4 pt-4">
            {/* 글 종류 선택 */}
            <div className="mb-4">
              <h3 className="mb-5 text-base font-semibold">글 종류</h3>
              <ChipGroup
                options={postTypeOptions}
                selectedOption={postType}
                onSelect={handlePostTypeSelect}
              />
            </div>
            {/* 글 주제 선택 */}
            <div className="pt-4">
              <h3 className="mb-5 text-base font-semibold">글 주제</h3>
              <ChipGroup
                options={postTopicOptions}
                selectedOption={topic}
                onSelect={handleTopicSelect}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WritePostUI;
