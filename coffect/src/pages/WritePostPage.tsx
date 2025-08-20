/**
 * @author 흥부/강신욱
 * @description
 * 글 작성 페이지 컴포넌트 (한 장 이미지 업로드 + Crop 지원 + 메모리 누수 방지)
 * @version 1.1.0
 * - Crop 모달 URL 관리 및 Object URL 해제 적용
 * - 한 장만 업로드 가능
 * @date 2025-08-20
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
  const [threadTitle, setThreadTitle] = useState<string>("");
  const [threadBody, setThreadBody] = useState<string>("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [type, setType] = useState<string>("");
  const [threadSubject, setThreadSubject] = useState<string>("");

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropTargetUrl, setCropTargetUrl] = useState<string | null>(null);

  const { mutate: addPost } = useAddPostMutation();

  // --- Object URL 해제 ---
  const revokePreviewUrls = useCallback(() => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
  }, [previewUrls]);

  // --- Crop 완료 핸들러 ---
  const handleCropComplete = useCallback(
    (croppedFile: File) => {
      // 이전 preview URL 해제
      revokePreviewUrls();

      // 이전 cropTarget URL 해제
      if (cropTargetUrl) URL.revokeObjectURL(cropTargetUrl);

      // 새 파일과 URL 저장
      const croppedUrl = URL.createObjectURL(croppedFile);
      setImageFiles([croppedFile]);
      setPreviewUrls([croppedUrl]);

      // Crop 모달 닫기
      setCropModalOpen(false);
      setCropTargetUrl(null);
    },
    [cropTargetUrl, revokePreviewUrls],
  );

  // --- 이미지 선택 핸들러 ---
  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const fileUrl = URL.createObjectURL(file);
        setCropTargetUrl(fileUrl);
        setCropModalOpen(true);
      }
    },
    [],
  );

  // --- 이미지 삭제 ---
  const handleImageRemove = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_: number) => {
      revokePreviewUrls();
      setImageFiles([]);
    },
    [revokePreviewUrls],
  );

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

    if (imageFiles.length > 0) {
      formData.append("images", imageFiles[0]); // 한 장만 업로드
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
            onClose={() => {
              if (cropTargetUrl) URL.revokeObjectURL(cropTargetUrl);
              setCropTargetUrl(null);
              setCropModalOpen(false);
            }}
            onCropComplete={handleCropComplete}
          />
        )}
      </main>
    </div>
  );
};

export default WritePostPage;
