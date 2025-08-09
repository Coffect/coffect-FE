/**
 * @file useWriteForm.ts
 * @author 흥부/강신욱
 * @description
 * 게시글 작성 폼의 상태 관리 및 유효성 검사를 담당하는 커스텀 훅입니다.
 * 이 훅은 폼 입력 필드, 이미지 파일, 폼 유효성 상태를 관리하고 관련 핸들러를 제공합니다.
 * @version 1.0.0
 * - 1.0.0 : 초기 작성 ( 게시글 작성 폼 상태 관리 훅 정의 )
 * @date 2023-08-05
 */

import { useState, useEffect, useCallback } from "react";

/**
 * @interface UseWriteFormReturn
 * @description useWriteForm 훅이 반환하는 값들의 타입을 정의합니다.
 *              게시글 작성 폼의 상태와 상태를 업데이트하는 함수들을 포함합니다.
 * @state {string} postType - 게시글 종류 (예: 아티클, 팀원 모집 등)
 * @state {string} topic - 선택된 주제 (예: 프로덕트, 개발 등)
 * @state {string} title - 게시글 제목
 * @state {string} content - 게시글 내용
 * @state {File[]} selectedImageFiles - 선택된 이미지 파일 배열
 * @state {boolean} isFormValid - 폼 유효성 상태 (제목과 내용이 모두 입력되었는지 여부)
 * @handle {function} handleTopicSelect - 주제 선택 핸들러
 * @handle {function} handlePostTypeSelect - 게시글 종류 선택 핸들러
 * @handle {function} handleImageChange - 이미지 파일 선택 핸들러
 * @handle {function} handleImageRemove - 이미지 파일 삭제 핸들러
 * @handle {function} resetForm - 폼 상태 초기화 핸들러
 */
export interface UseWriteFormReturn {
  postType: string;
  setPostType: (type: string) => void;
  topic: string;
  setTopic: (topic: string) => void;
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  selectedImageFiles: File[];
  setSelectedImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
  isFormValid: boolean;
  handleTopicSelect: (selectedTopic: string) => void;
  handlePostTypeSelect: (selectedPostType: string) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageRemove: (indexToRemove: number) => void;
  resetForm: () => void;
}

/**
 * @function useWriteForm
 * @description 게시글 작성 폼의 상태 관리 및 유효성 검사를 담당하는 커스텀 훅입니다.
 *              폼 입력 필드, 이미지 파일, 폼 유효성 상태를 관리하고 관련 핸들러를 제공합니다.
 * @returns {UseWriteFormReturn} 폼의 상태와 상태를 조작하는 함수들을 담은 객체
 */
export const useWriteForm = (): UseWriteFormReturn => {
  const [postType, setPostType] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  /**
   * @description 제목과 내용이 비어있지 않은지 확인하여 폼 유효성 상태를 업데이트합니다.
   */
  useEffect(() => {
    const isValid = title.trim() !== "" && content.trim() !== "";
    setIsFormValid(isValid);
  }, [title, content]);

  /**
   * @description 선택한 주제가 이미 선택되어 있다면 선택을 해제하고, 그렇지 않다면 선택한 칩으로 주제를 설정합니다.
   * @param {string} selectedTopic - 선택된 주제 문자열
   */
  const handleTopicSelect = (selectedTopic: string) => {
    setTopic((prevTopic) => (prevTopic === selectedTopic ? "" : selectedTopic));
  };

  /**
   * @description 선택한 게시글 종류가 이미 선택되어 있다면 선택을 해제하고, 그렇지 않다면 선택한 칩으로 종류를 설정합니다.
   * @param {string} selectedPostType - 선택된 게시글 종류 문자열
   */
  const handlePostTypeSelect = (selectedPostType: string) => {
    setPostType((prevPostType) =>
      prevPostType === selectedPostType ? "" : selectedPostType,
    );
  };

  /**
   * @description 파일 입력(카메라/갤러리) 변경 시 호출되는 이벤트 핸들러입니다.
   *              선택된 파일들을 selectedImageFiles 상태에 추가합니다.
   * @param {React.ChangeEvent<HTMLInputElement>} e - 파일 입력 변경 이벤트 객체
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedImageFiles((prevImages) => [...prevImages, ...newFiles]);
    }
  };

  /**
   * @description 특정 인덱스의 이미지를 미리보기에서 삭제합니다.
   * @param {number} indexToRemove - 삭제할 이미지의 인덱스
   */
  const handleImageRemove = (indexToRemove: number) => {
    setSelectedImageFiles((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove),
    );
  };

  /**
   * @description 폼 상태를 초기화하는 함수입니다.
   */
  const resetForm = useCallback(() => {
    setPostType("");
    setTopic("");
    setTitle("");
    setContent("");
    setSelectedImageFiles([]);
    setIsFormValid(false);
  }, []);

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
    resetForm,
  };
};
