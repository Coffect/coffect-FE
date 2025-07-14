/* author : 강신욱
description : 글 작성을 관리하는 컨테이너 컴포넌트입니다.
*/
import React from "react";
import { useNavigate } from "react-router-dom";
import WritePostUI from "./WritePostUI";
import { useWritePost } from "../../../hooks/useWritePost";

const WritePost: React.FC = () => {
  const navigate = useNavigate();

  const {
    postType,
    setPostType,
    topic,
    handleTopicSelect,
    title,
    setTitle,
    content,
    setContent,
    isFormValid,
    resetPost,
  } = useWritePost();

  /***** 뒤로가기 버튼 클릭 시 작성 중인 글의 상태를 초기화하고 커뮤니티 페이지로 이동하는 로직입니다.  ******/
  const handleBackClick = () => {
    resetPost();
    navigate("/community");
  };

  /***** 업로드 버튼 클릭 시 성공 모달을 여는 로직입니다. ******/
  const handleUpload = () => {
    // 실제 API 호출 로직이 여기에 들어갈 수 있습니다.
    // API 호출 성공 시 아래 로직 수행
    console.log("글 종류:", postType);
    console.log("제목:", title);
    console.log("내용:", content);
    console.log("글 주제:", topic);
    
    // 글 작성 마치고 state와 함께 커뮤니티 페이지로 이동
    navigate("/community", { state: { showSuccessModal: true } });
  };

  return (
    <>
      <WritePostUI
        postType={postType}
        setPostType={setPostType}
        topic={topic}
        handleTopicSelect={handleTopicSelect}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        isFormValid={isFormValid}
        handleBackClick={handleBackClick}
        onUpload={handleUpload}
      />
    </>
  );
};

export default WritePost;
