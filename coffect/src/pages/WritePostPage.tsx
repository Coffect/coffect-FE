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
// import type { postUploadRequest } from "@/types/community/writePostTypes";
import WritePostHeader from "@/components/communityComponents/writeComponents/WritePostHeader";
import WritePostTitleInput from "@/components/communityComponents/writeComponents/WritePostTitleInput";
import WritePostContentInput from "@/components/communityComponents/writeComponents/WritePostContentInput";
import WritePostTopicSelector from "@/components/communityComponents/writeComponents/WritePostTopicSelector";
import {
  // postSubjectOptions,
  type ChipOption,
} from "@/components/communityComponents/ChipFilterComponent/filterData";
import ImageCropModal from "@/components/shareComponents/imageCrop/ImageCropModal";

const WritePostPage: React.FC = () => {
  const navigate = useNavigate();

  // 전송되는 상태 변수들
  const [threadTitle, setThreadTitle] = useState<string>("");
  const [threadBody, setThreadBody] = useState<string>("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [type, setType] = useState<string>("");
  const [threadSubject, setThreadSubject] = useState<string>("");

  // 이미지 크롭 모달 상태 변수들
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropTargetUrl, setCropTargetUrl] = useState<string | null>(null);

  const { mutate: addPost } = useAddPostMutation();

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const fileUrl = URL.createObjectURL(file);
        setCropTargetUrl(fileUrl);
        setCropModalOpen(true); // 모달 오픈
        e.target.value = "";
        // const files = Array.from(e.target.files);
        // setImageFiles((prev) => [...prev, ...files]);
        // const lastFile = files[files.length - 1];
        // const lastFileUrl = URL.createObjectURL(lastFile);
        // setPreviewUrls([lastFileUrl]);
      }
    },
    [],
  );

  // const handleCropComplete = useCallback((croppedFile: File) => {
  //   setImageFiles((prev) => [...prev, croppedFile]);
  //   setPreviewUrls((prev) => [...prev, URL.createObjectURL(croppedFile)]);
  //   setCropModalOpen(false);
  //   setCropTargetUrl(null);
  // }, []);

  const handleCropComplete = useCallback((croppedFile: File) => {
    const croppedUrl = URL.createObjectURL(croppedFile);
    setImageFiles([croppedFile]);
    setPreviewUrls([croppedUrl]);
    setCropModalOpen(false);
    setCropTargetUrl(null);
  }, []);

  const handleImageRemove = useCallback(() => {
    // setImageFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    setImageFiles([]);
    setPreviewUrls([]);
    // setPreviewUrls((prev) => prev.filter((_, i) => i !== indexToRemove));
  }, []);

  const handleTypeSelect = useCallback((option: ChipOption) => {
    setType(option.value as string);
  }, []);

  const handleThreadSubjectSelect = useCallback((option: ChipOption) => {
    setThreadSubject(String(option.id));
  }, []);

  const isFormValid =
    threadTitle.trim().length > 0 &&
    threadBody.trim().length > 0 &&
    type.length > 0 &&
    threadSubject !== "";

  // const selectedTopicValue =
  //   postSubjectOptions.find((option) => String(option.id) === threadSubject)
  //     ?.value || "";

  const handleBackClick = useCallback(() => {
    navigate("/community");
  }, [navigate]);

  const handleUpload = () => {
    if (!isFormValid) {
      alert("모든 필수 필드를 채워주세요.");
      return;
    }
    const formData = new FormData();
    formData.append("threadTitle", threadTitle);
    formData.append("threadBody", threadBody);
    formData.append("type", type);
    formData.append("threadSubject", threadSubject);

    if (imageFiles.length > 0) {
      formData.append("images", imageFiles[imageFiles.length - 1]);
    }

    // imageFiles.forEach((file) => {
    //   formData.append("images", file);
    // });

    addPost(formData, {
      // uploadPost에서 multipart/form-data 처리
      onSuccess: (response) => {
        if (response.success) {
          navigate("/community", {
            state: { showSuccessModal: true, newPost: response.success }, // 모달 표시 플래그
          });
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
  };

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
          images={previewUrls}
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

        {cropTargetUrl && (
          <ImageCropModal
            isOpen={cropModalOpen}
            imageSrc={cropTargetUrl}
            onClose={() => setCropModalOpen(false)}
            onCropComplete={handleCropComplete}
          />
        )}
      </main>
    </div>
  );
};

export default WritePostPage;
