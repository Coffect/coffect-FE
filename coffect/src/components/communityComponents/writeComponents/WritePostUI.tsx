/**
 * @author 흥부/강신욱
 * @description
 * WritePostUI 컴포넌트는 글 작성 페이지의 전체 UI를 구성합니다.
 * 상태와 로직 관리는 useWritePost 훅을 통해 처리되며,
 * UI는 하위 컴포넌트를 통해 처리됩니다.ㄴ
 */

import React from "react";
import { useWritePost } from "../../../hooks/useWritePost";
import WritePostHeader from "./WritePostHeader";
import WritePostTitleInput from "./WritePostTitleInput";
import WritePostContentInput from "./WritePostContentInput";
import WritePostTopicSelector from "./WritePostTopicSelector";

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
      <WritePostHeader
        isFormValid={isFormValid}
        handleBackClick={handleBackClick}
        handleUpload={handleUpload}
      />
      <main className="flex-grow">
        <WritePostTitleInput title={title} setTitle={setTitle} />
        <div className="h-[0.8px] w-full bg-[var(--gray-5)]"></div>
        <WritePostContentInput content={content} setContent={setContent} />
        <div className="mb-4 h-[0.8px] w-full bg-[var(--gray-5)]"></div>
        <WritePostTopicSelector
          postType={postType}
          handlePostTypeSelect={handlePostTypeSelect}
          topic={topic}
          handleTopicSelect={handleTopicSelect}
        />
      </main>
    </div>
  );
};

export default WritePostUI;
