/**
 * @author 흥부/강신욱
 * @description
 * 1. src/types/community/writePostType에 타입을 정의함.
 * 2. src/api/community/writeApi.ts에 API 함수를 정의함.
 * 3. src/hooks/community/mutation/useUploadPostMutation.ts와
 *    src/hooks/community/mutation/useUploadPostImageMutation.ts에 React Query ( museMutation )를 사용한 API 호출 로직을 정의함.
 * 4. src/hooks/community/writePost/useWritePost.ts에 글 작성 페이지의 상태와 로직을 관리하는 커스텀 훅을 정의함.
 * 5. src/pages/WritePostPage.tsx에 글 작성 페이지 컴포넌트를 정의함.
 * @version 1.0.0
 * - 1.0.0 : 초기 작성 ( 글 작성 페이지 컴포넌트 정의 )
 * @date 2023-08-05
 */

import React from "react";
import { useWritePost } from "@/hooks/community/writePost/useWritePost";
import WritePostHeader from "@/components/communityComponents/writeComponents/WritePostHeader";
import WritePostTitleInput from "@/components/communityComponents/writeComponents/WritePostTitleInput";
import WritePostContentInput from "@/components/communityComponents/writeComponents/WritePostContentInput";
import WritePostTopicSelector from "@/components/communityComponents/writeComponents/WritePostTopicSelector";

const WritePostPage: React.FC = () => {
  const {
    postType,
    handlePostTypeSelect,
    topic,
    handleTopicSelect,
    title,
    setTitle,
    content,
    setContent,
    selectedImageFiles,
    handleImageChange,
    handleImageRemove,
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
          selectedImageFiles={selectedImageFiles}
          handleImageChange={handleImageChange}
          handleImageRemove={handleImageRemove}
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
