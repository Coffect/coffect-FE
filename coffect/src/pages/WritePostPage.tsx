/**
 * @author 흥부/강신욱
 * @description
 * WritePostPage는 글 작성 페이지의 전체 UI를 구성합니다.
 * 상태와 로직 관리는 useWritePost 훅을 통해 처리되며,
 * UI는 하위 컴포넌트를 통해 렌더링됩니다.
 */

import React from "react";
import { useWritePost } from "@/hooks/useWritePost";
import WritePostHeader from "@/components/communityComponents/writeComponents/WritePostHeader";
import WritePostTitleInput from "@/components/communityComponents/writeComponents/WritePostTitleInput";
import WritePostContentInput from "@/components/communityComponents/writeComponents/WritePostContentInput";
import WritePostTopicSelector from "@/components/communityComponents/writeComponents/WritePostTopicSelector";

const WritePostPage: React.FC = () => {
  // useWritePost 훅에서 글 작성에 필요한 모든 상태와 함수들을 가져옵니다.
  const {
    postType,
    handlePostTypeSelect,
    topic,
    handleTopicSelect,
    title,
    setTitle,
    content,
    setContent,
    images, // 이미지 파일 목록
    handleImageChange, // 이미지 변경 핸들러
    handleImageRemove, // 이미지 삭제 핸들러
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
      <main className="flex-grow overflow-y-auto">
        <WritePostTitleInput title={title} setTitle={setTitle} />
        <div className="h-[0.8px] w-full bg-[var(--gray-5)]"></div>

        {/* WritePostContentInput에 이미지 관련 상태와 핸들러를 props로 전달합니다. */}
        <WritePostContentInput
          content={content}
          setContent={setContent}
          images={images}
          onImageChange={handleImageChange}
          onImageRemove={handleImageRemove}
        />

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

export default WritePostPage;