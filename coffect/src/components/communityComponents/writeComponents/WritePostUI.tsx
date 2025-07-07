/* author : 강신욱
description : 글 작성 페이지의 UI를 담당하는 프레젠테이션 컴포넌트입니다.
*/
import React from "react";
import ChipGroup from "../common/ChipGroup";
import type { WritePostUIProps } from "../../../types/writePostTypes";

const WritePostUI: React.FC<WritePostUIProps> = ({
  postType,
  setPostType,
  topic,
  handleTopicSelect,
  title,
  setTitle,
  content,
  setContent,
  isFormValid,
  handleBackClick,
  onUpload,
}) => {
  const mediaButtonClasses = "rounded px-1 text-sm";
  const uploadButtonBaseClasses = "mt-6 w-[50%] py-3 text-white";

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between p-4">
        <button onClick={handleBackClick}>&lt;</button>
        <h1 className="text-lg font-bold">글 작성하기</h1>
        <div />
      </header>
      <main className="flex-grow p-4">
        <ChipGroup
          title=""
          options={["아티클", "팀원 모집", "질문"]}
          selectedOption={postType}
          onSelect={setPostType}
        />
        <input
          type="text"
          placeholder="제목을 입력하세요"
          className="mb-4 w-full border-b p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="오늘은 어떤 글을 써볼까요?"
          className="h-55 w-full rounded p-2"
          value={content}
          onChange={(e) => setContent(() => e.target.value)}
        />
        <div className="mt-4 mb-2 flex items-center space-x-4 border-b pb-2">
          <button className={mediaButtonClasses}>사진</button>
          <button className={mediaButtonClasses}>URL</button>
        </div>
        <ChipGroup
          title="글 주제"
          options={[
            "프로덕트",
            "개발",
            "디자인",
            "기획",
            "인사이트",
            "취업",
            "창업",
            "학교",
          ]}
          selectedOption={topic}
          onSelect={handleTopicSelect}
        />
        <div className="flex justify-center">
          <button
            className={`${uploadButtonBaseClasses} ${
              isFormValid ? "bg-black" : "cursor-not-allowed bg-gray-400"
            }`}
            disabled={!isFormValid}
            onClick={onUpload}
          >
            업로드
          </button>
        </div>
      </main>
    </div>
  );
};

export default WritePostUI;
