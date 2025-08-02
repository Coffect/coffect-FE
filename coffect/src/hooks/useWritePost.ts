/**
 * @file useWritePost.ts
 * @author 흥부/강신욱
 * @description 글 작성 페이지의 "상태와 로직을 모두 관리"하는 커스텀 훅입니다.
 *              UI 컴포넌트(WritePostUI.tsx)는 이 훅을 사용하여 필요한 데이터와 함수를 받아오기만 합니다.
 *              API 연동 로직 및 로딩/에러/성공 상태 관리를 포함합니다.
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { UseWritePostReturn, PostData } from "../types/writePostTypes";
import { createPost } from "../api/postApi";

/**
 * @function useWritePost
 * @description
 * 이 훅은 글 작성 페이지에서 사용되는 상태와 로직을 관리합니다.
 * @returns UseWritePostReturn
 */
export const useWritePost = (): UseWritePostReturn => {
  const navigate = useNavigate();
  const [postType, setPostType] = useState<string>(""); // 게시글 종류 (예: 아티클, 팀원 모집 등)
  const [topic, setTopic] = useState<string>(""); // 게시글 주제 (예: 프로덕트, 개발, 디자인 등)
  const [title, setTitle] = useState<string>(""); // 게시글 제목
  const [content, setContent] = useState<string>(""); // 게시글 내용
  const [isFormValid, setIsFormValid] = useState<boolean>(false); // 폼 유효성 검사 결과 (제목과 내용이 비어있지 않은지 여부)
  const [isLoading, setIsLoading] = useState<boolean>(false); // API 호출 로딩 상태
  const [error, setError] = useState<string | null>(null); // API 호출 에러 메시지
  const [isSuccess, setIsSuccess] = useState<boolean>(false); // API 호출 성공 상태

  /**
   * @function useEffect
   * @description 제목과 내용이 비어있지 않은지 확인하여 버튼 활성화 상태를 업데이트합니다.
   */
  useEffect(() => {
    const isValid = title.trim() !== "" && content.trim() !== "";
    setIsFormValid(isValid);
  }, [title, content]);

  /**
   * @function handleTopicSelect
   * @description 선택한 주제/종류가 이미 선택되어 있다면 선택을 해제하고, 그렇지 않다면 선택한 칩으로 주제/종류를 설정합니다.
   * @param selectedTopic - 선택된 주제 또는 종류 문자열
   */
  const handleTopicSelect = (selectedTopic: string) => {
    setTopic((prevTopic) => (prevTopic === selectedTopic ? "" : selectedTopic));
  };

  const handlePostTypeSelect = (selectedPostType: string) => {
    setPostType((prevPostType) =>
      prevPostType === selectedPostType ? "" : selectedPostType,
    );
  };

  /**
   * @function resetPost
   * @description 글 작성 상태를 초기화하는 함수입니다.
   */
  const resetPost = () => {
    setPostType("");
    setTopic("");
    setTitle("");
    setContent("");
    setIsLoading(false);
    setError(null);
    setIsSuccess(false);
  };

  /**
   * @function handleBackClick
   * @description 뒤로가기 버튼 클릭 시 작성 중인 글의 상태를 초기화하고 커뮤니티 페이지로 이동하는 로직입니다.
   */
  const handleBackClick = () => {
    resetPost();
    navigate("/community");
  };

  /**
   * @function handleUpload
   * @description 업로드 버튼 클릭 시 게시글 정보를 서버에 전송하고, 결과에 따라 상태를 업데이트합니다.
   *              API 호출 성공 시 커뮤니티 페이지로 이동하며 성공 모달을 띄웁니다.
   */
  const handleUpload = async () => {
    if (!isFormValid) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    const postData: PostData = {
      postType,
      topic,
      title,
      content,
    };

    try {
      await createPost(postData); // API 호출
      setIsSuccess(true);
      resetPost(); // 성공 시 상태 초기화
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
    setPostType,
    topic,
    setTopic,
    title,
    setTitle,
    content,
    setContent,
    isFormValid,
    handleTopicSelect,
    handlePostTypeSelect, // handlePostTypeSelect 추가
    resetPost,
    handleBackClick,
    handleUpload,
    isLoading,
    error,
    isSuccess,
  };
};
