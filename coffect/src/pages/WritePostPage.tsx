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

import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAddPostMutation } from "@/hooks/community/mutation/useAddPostMutation";
import type { postUploadRequest } from "@/types/community/writePostTypes";
import WritePostHeader from "@/components/communityComponents/writeComponents/WritePostHeader";
import WritePostTitleInput from "@/components/communityComponents/writeComponents/WritePostTitleInput";
import WritePostContentInput from "@/components/communityComponents/writeComponents/WritePostContentInput";
import WritePostTopicSelector from "@/components/communityComponents/writeComponents/WritePostTopicSelector";
import type { ChipOption } from "@/components/communityComponents/ChipFilterComponent/filterData";

const WritePostPage: React.FC = () => {
  const navigate = useNavigate();

  const [threadTitle, setThreadTitle] = useState<string>("");
  const [threadBody, setThreadBody] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [type, setType] = useState<string>("");
  const [threadSubject, setThreadSubject] = useState<string>("");

  const { mutate: addPost } = useAddPostMutation();

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setImages([e.target.files[0]]);
      } else {
        setImages([]);
      }
    },
    [],
  );

  const handleImageRemove = useCallback((indexToRemove: number) => {
    setImages((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove),
    );
  }, []);

  const handleTypeSelect = useCallback((option: ChipOption) => {
    setType(option.value as string);
  }, []);

  const handleThreadSubjectSelect = useCallback((option: ChipOption) => {
    setThreadSubject(option.value as string);
  }, []);

  const isFormValid =
    threadTitle.trim().length > 0 &&
    threadBody.trim().length > 0 &&
    type.length > 0 &&
    threadSubject.length > 0;

  const handleBackClick = useCallback(() => {
    navigate("/community"); // Assuming '/community' is the path to the community page
  }, [navigate]);

  const handleUpload = useCallback(() => {
    if (!isFormValid) {
      alert("모든 필수 필드를 채워주세요.");
      return;
    }
    const postData: postUploadRequest = {
      threadTitle: threadTitle,
      threadBody: threadBody,
      type: type,
      threadSubject: threadSubject,
      images: images as unknown as string[],
    };

    addPost(postData, {
      onSuccess: (response) => {
        if (response.resultType === "SUCCESS") {
          alert("게시글이 성공적으로 작성되었습니다!");
          navigate("/community"); // 게시글 작성 후 커뮤니티 페이지로 이동
        } else {
          alert(
            `게시글 작성 실패: ${response.error?.reason || "알 수 없는 오류"}`,
          );
        }
      },
      onError: (err) => {
        alert(`게시글 작성 중 오류 발생: ${err.message}`);
      },
    });
  }, [threadTitle, threadBody, type, threadSubject, images]);

  return (
    <div className="flex h-screen flex-col bg-white">
      <WritePostHeader
        isFormValid={isFormValid}
        handleBackClick={handleBackClick}
        handleUpload={handleUpload}
      />
      <main className="flex-grow overflow-y-auto">
        <WritePostTitleInput title={threadTitle} setTitle={setThreadTitle} />
        <div className="h-[0.8px] w-full bg-[var(--gray-5)]"></div>

        <WritePostContentInput
          content={threadBody}
          setContent={setThreadBody}
          images={images}
          handleImageChange={handleImageChange}
          handleImageRemove={handleImageRemove}
        />

        <div className="mb-4 h-[0.8px] w-full bg-[var(--gray-5)]"></div>
        <WritePostTopicSelector
          type={type}
          handleTypeSelect={handleTypeSelect}
          topic={threadSubject}
          handleThreadSubjectSelect={handleThreadSubjectSelect}
        />
      </main>
    </div>
  );
};

export default WritePostPage;
