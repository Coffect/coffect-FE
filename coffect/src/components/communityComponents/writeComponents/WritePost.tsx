/* author : 강신욱
description : 글 작성을 관리하는 컨테이너 컴포넌트입니다.
*/
import React from "react";
import { useNavigate } from "react-router-dom";
import BottomNavbar from "../../shareComponents/BottomNavbar";
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

  /***** 업로드 버튼 클릭 시 글의 종류, 제목, 내용, 주제를 콘솔에 출력하는 로직입니다. (후에 API 연동 예정) ******/
  const handleUpload = () => {
    console.log("글 종류:", postType);
    console.log("제목:", title);
    console.log("내용:", content);
    console.log("글 주제:", topic);
    // 여기에 API 호출 로직을 추가할 수 있습니다.
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
      <BottomNavbar activeLabel="커뮤니티" />
    </>
  );
};

export default WritePost;