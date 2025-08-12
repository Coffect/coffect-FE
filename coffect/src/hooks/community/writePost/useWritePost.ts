/**
 * @file useWritePost.ts
 * @author 흥부/강신욱
 * @description
 * 글 작성 페이지의 최상위 로직을 관리하는 커스텀 훅입니다.
 * 이 훅은 폼 상태 관리(useWriteForm)와 게시글 생성 로직(usePostCreation)을 통합하여 제공합니다.
 * @version 1.0.0
 * - 1.0.0 : 초기 작성 ( 글 작성 페이지 로직 훅 정의 )
 * * @date 2023-08-05
 */

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useWritePostForm } from "./useWritePostForm";
import { postSubjectOptions } from "@/components/communityComponents/ChipFilterComponent/filterData";

/**
 * @function useWritePost
 * @description
 * 이 훅은 글 작성 페이지의 최상위 로직을 관리합니다.
 * 폼 상태 관리(useWriteForm)와 게시글 생성 로직(usePostCreation)을 통합하여 제공합니다.
 * @returns {object} 글 작성에 필요한 모든 상태와 함수들을 담은 객체
 */
export const useWritePost = () => {
  const navigate = useNavigate();

  // 폼 상태 관리 훅 사용
  const {
    type: postType,
    setType: setPostType,
    subject: topic,
    setSubject: setTopic,
    title,
    setTitle,
    content,
    setContent,
    selectedImageFiles,
    setSelectedImageFiles,
    isFormValid,
    handleTopicSelect,
    handlePostTypeSelect,
    handleImageChange,
    handleImageRemove,
    resetForm,
  } = useWritePostForm();

  /**
   * @description 전체 게시글 작성 상태를 초기화하고 커뮤니티 페이지로 이동합니다.
   *              폼 상태 초기화와 내비게이션을 포함합니다.
   */
  const resetAll = useCallback(() => {
    resetForm();
  }, [resetForm]);

  /**
   * @description 뒤로가기 버튼 클릭 시 작성 중인 글의 상태를 초기화하고 커뮤니티 페이지로 이동합니다.
   */
  const handleBackClick = () => {
    resetAll();
    navigate("/community");
  };

  /**
   * @description 최종 업로드 버튼 클릭 시 호출되는 함수입니다.
   *              폼 유효성 검사 후 게시글 생성 로직을 트리거합니다.
   */
  const handleUpload = async () => {
    if (!isFormValid) {
      console.error("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const subjectId = postSubjectOptions.find(
        (option) => option.value === topic,
      )?.id;

      if (subjectId === undefined) {
        console.error("유효하지 않은 주제입니다.");
        return;
      }

      resetAll();
      navigate("/community", { state: { showSuccessModal: true } });
    } catch (err) {
      console.error("게시글 작성 최종 실패:", err);
    }
  };

  return {
    postType,
    setPostType,
    topic,
    setTopic,
    title,
    setTitle,
    content,
    setContent,
    selectedImageFiles,
    setSelectedImageFiles,
    isFormValid,
    handleTopicSelect,
    handlePostTypeSelect,
    handleImageChange,
    handleImageRemove,

    handleBackClick,
    handleUpload,
  };
};
