/* author : 강신욱
description : 글 작성 관련 컴포넌트 및 훅에서 사용되는 타입 정의입니다.
*/

/*
postType: 글의 종류 (ex: 아티클, 팀원 모집, 질문 등)
topic: 글의 주제 (ex: 프로덕트, 개발 등)
handleTopicSelect: 종류/주제 선택 핸들러 함수
title: 글 제목
content: 글 내용
isFormValid: 글 작성 폼이 유효한지 여부
*/
export interface WritePostUIProps {
  postType: string;
  setPostType: (type: string) => void;
  topic: string;
  handleTopicSelect: (topic: string) => void;
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: (content: string) => string) => void;
  isFormValid: boolean;
  handleBackClick: () => void;
}

export interface UseWritePostReturn {
  postType: string;
  setPostType: (type: string) => void;
  topic: string;
  setTopic: (topic: string) => void;
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: (content: string) => string) => void;
  isFormValid: boolean;
  handleTopicSelect: (selectedTopic: string) => void;
  resetPost: () => void;
}
