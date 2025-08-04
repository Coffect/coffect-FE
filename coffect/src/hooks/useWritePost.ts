/**
 * @file useWritePost.ts
 * @author 흥부/강신욱
 * @description 글 작성 페이지의 "상태와 로직을 모두 관리"하는 커스텀 훅입니다.
 *              UI 컴포넌트(WritePostPage.tsx)는 이 훅을 사용하여 필요한 데이터와 함수를 받아오기만 합니다.
 *              API 연동 로직 및 로딩/에러/성공 상태 관리를 포함합니다.
 */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type {
  UseWritePostReturn,
  PostData,
} from "../types/community/writePostTypes";
import { createPost } from "../api/postApi";

/**
 * @function useWritePost
 * @description
 * 이 훅은 글 작성 페이지에서 사용되는 상태와 로직을 관리합니다.
 * @returns {UseWritePostReturn} 글 작성에 필요한 상태와 함수들을 담은 객체
 */
export const useWritePost = (): UseWritePostReturn => {
  const navigate = useNavigate();
  const [postType, setPostType] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  // 선택된 이미지 파일들을 관리하는 상태
  const [images, setImages] = useState<File[]>([]);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  /**
   * @description 제목과 내용이 비어있지 않은지 확인하여 버튼 활성화 상태를 업데이트합니다.
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
   *              선택된 파일들을 images 상태에 추가합니다.
   * @param {React.ChangeEvent<HTMLInputElement>} e - 파일 입력 변경 이벤트 객체
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...newFiles]);
    }
  };

  /**
   * @description 특정 인덱스의 이미지를 미리보기에서 삭제합니다.
   * @param {number} indexToRemove - 삭제할 이미지의 인덱스
   */
  const handleImageRemove = (indexToRemove: number) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove),
    );
  };

  /**
   * @description 글 작성 상태를 초기화하는 함수입니다.
   */
  const resetPost = useCallback(() => {
    setPostType("");
    setTopic("");
    setTitle("");
    setContent("");
    setImages([]); // 이미지 상태도 초기화
    setIsLoading(false);
    setError(null);
    setIsSuccess(false);
  }, []);

  /**
   * @description 뒤로가기 버튼 클릭 시 작성 중인 글의 상태를 초기화하고 커뮤니티 페이지로 이동합니다.
   */
  const handleBackClick = () => {
    resetPost();
    navigate("/community");
  };

  /**
   * @description 업로드 버튼 클릭 시 게시글 정보를 서버에 전송하고, 결과에 따라 상태를 업데이트합니다.
   */
  const handleUpload = async () => {
    if (!isFormValid) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    // FormData 객체 생성하여 이미지와 텍스트 데이터를 함께 전송 준비
    const formData = new FormData();
    const postData: PostData = {
      postType,
      topic,
      title,
      content,
    };
    formData.append(
      "post",
      new Blob([JSON.stringify(postData)], { type: "application/json" }),
    );
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      // await createPost(formData); // API 호출 (FormData를 보내도록 수정 필요)
      console.log("전송될 데이터:", Object.fromEntries(formData.entries()));
      // 임시 성공 처리
      setIsSuccess(true);
      resetPost();
      navigate("/community", { state: { showSuccessModal: true } });
    } catch (err) {
      console.error("게시글 작성 실패:", err);
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
      );
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    postType,
    handlePostTypeSelect,
    topic,
    handleTopicSelect,
    title,
    setTitle,
    content,
    setContent,
    images, // 이미지 상태
    handleImageChange, // 이미지 변경 핸들러
    handleImageRemove, // 이미지 삭제 핸들러
    isFormValid,
    handleBackClick,
    handleUpload,
    isLoading,
    error,
    isSuccess,
  };
};