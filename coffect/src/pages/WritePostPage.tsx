/**
 * @description
 * 글 작성 페이지 (한 장 이미지 업로드 + Crop 선택 지원 + 메모리 누수 방지)
 * @version 1.2.0
 * - 원본 업로드 후 즉시 미리보기 가능
 * - "자르기" 버튼으로 Crop 모달 실행
 * - 잘린 이미지는 원본을 대체
 */

import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAddPostMutation } from "@/hooks/community/mutation/useAddPostMutation";
import WritePostHeader from "@/components/communityComponents/writeComponents/WritePostHeader";
import WritePostTitleInput from "@/components/communityComponents/writeComponents/WritePostTitleInput";
import WritePostContentInput from "@/components/communityComponents/writeComponents/WritePostContentInput";
import WritePostTopicSelector from "@/components/communityComponents/writeComponents/WritePostTopicSelector";
import { type ChipOption } from "@/components/communityComponents/ChipFilterComponent/filterData";
import ImageCropModal from "@/components/shareComponents/imageCrop/ImageCropModal";

const WritePostPage: React.FC = () => {
  const navigate = useNavigate();

  // --- 상태 ---
  const [threadTitle, setThreadTitle] = useState("");
  const [threadBody, setThreadBody] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCropped, setIsCropped] = useState(false);

  const [type, setType] = useState("");
  const [threadSubject, setThreadSubject] = useState("");

  const [cropModalOpen, setCropModalOpen] = useState(false);

  const { mutate: addPost } = useAddPostMutation();

  // --- Object URL 해제 ---
  const revokePreviewUrl = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }, [previewUrl]);

  // --- 이미지 선택 핸들러 ---
  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];

      revokePreviewUrl(); // 기존 URL 해제
      setImageFile(file);

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsCropped(false);
    },
    [revokePreviewUrl],
  );

  // --- 크롭 완료 핸들러 ---
  const handleCropComplete = useCallback(
    (croppedFile: File) => {
      revokePreviewUrl();

      setImageFile(croppedFile);
      const url = URL.createObjectURL(croppedFile);
      setPreviewUrl(url);
      setIsCropped(true);
      setCropModalOpen(false);
    },
    [revokePreviewUrl],
  );

  // --- 이미지 삭제 ---
  const handleImageRemove = useCallback(() => {
    revokePreviewUrl();
    setImageFile(null);
  }, [revokePreviewUrl]);

  // --- 타입/주제 선택 ---
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

  // --- 뒤로가기 ---
  const handleBackClick = useCallback(() => {
    navigate("/community");
  }, [navigate]);

  // --- 업로드 ---
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

    if (imageFile) {
      formData.append("images", imageFile);
    }

    addPost(formData, {
      onSuccess: (response) => {
        if (response.success) {
          navigate("/community", {
            state: { showSuccessModal: true, newPost: response.success },
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
          images={previewUrl ? [previewUrl] : []}
          handleImageChange={handleImageChange}
          handleImageRemove={handleImageRemove}
          onCropClick={() => setCropModalOpen(true)}
          isCropped={isCropped}
        />

        <div className="mb-4 h-[0.8px] w-full bg-[var(--gray-5)]"></div>

        <WritePostTopicSelector
          type={type}
          handleTypeSelect={handleTypeSelect}
          topic={threadSubject}
          handleThreadSubjectSelect={handleThreadSubjectSelect}
        />

        {cropModalOpen && previewUrl && (
          <ImageCropModal
            isOpen={cropModalOpen}
            imageSrc={previewUrl}
            onClose={() => setCropModalOpen(false)}
            onCropComplete={handleCropComplete}
          />
        )}
      </main>
    </div>
  );
};

export default WritePostPage;
