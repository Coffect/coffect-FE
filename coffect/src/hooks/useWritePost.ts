/* 
author : 강신욱
description : 글 작성 페이지의 "상태를 관리"하는 커스텀 훅입니다.
*/
import { useState, useEffect } from "react";
import type { UseWritePostReturn } from "../types/writePostTypes";

export const useWritePost = (): UseWritePostReturn => {
  const [postType, setPostType] = useState("");
  const [topic, setTopic] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  /*****  제목과 내용이 비어있지 않은지 확인하여 버튼 활성화 상태를 업데이트합니다. ******/
  useEffect(() => {
    const isValid = title !== "" && content !== "";
    setIsFormValid(isValid);
  }, [title, content]);

  /***** 선택한 주제/종류 가 이미 선택되어 있다면 선택을 해제하는 로직입니다. 선택한 칩으로 주제/종류를 설정합니다.******/
  const handleTopicSelect = (selectedTopic: string) => {
    setTopic((prevTopic) => (prevTopic === selectedTopic ? "" : selectedTopic));
  };

  /***** 글 작성 상태를 초기화하는 함수입니다. ******/
  const resetPost = () => {
    setPostType("");
    setTopic("");
    setTitle("");
    setContent("");
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
    resetPost,
  };
};
