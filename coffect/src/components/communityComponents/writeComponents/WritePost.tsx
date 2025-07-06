/* author : 강신욱
description : 글 작성을 관리하는 컴포넌트입니다. 
*/

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavbar from "../../shareComponents/BottomNavbar";
import ChipGroup from "../common/ChipGroup";

const WritePost: React.FC = () => {
  /**
   * postType : 글의 종류
   * topic : 글의 주제
   * title : 글의 제목
   * content : 글의 내용
   * isFormValid : 제목과 내용이 비어있지 않은지 확인하는 상태
   */
  const navigate = useNavigate();
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

  /***** 뒤로가기 버튼 클릭 시 작성 중인 글의 상태를 초기화하고 커뮤니티 페이지로 이동하는 로직입니다.  ******/
  const handleBackClick = () => {
    setPostType("");
    setTopic("");
    setTitle("");
    setContent("");
    navigate("/community");
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between p-4">
        <button onClick={handleBackClick}>&lt;</button>
        <h1 className="text-lg font-bold">글 작성하기</h1>
        <div />
      </header>
      <main className="flex-grow p-4">
        <ChipGroup
          title=""
          options={["아티클", "팀원 모집", "질문"]}
          selectedOption={postType}
          onSelect={setPostType}
        />
        <input
          type="text"
          placeholder="제목을 입력하세요"
          className="mb-4 w-full border-b p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="오늘은 어떤 글을 써볼까요?"
          className="h-55 w-full rounded p-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="mt-4 mb-2 flex items-center space-x-4 border-b pb-2">
          <button className="rounded px-1 text-sm">사진</button>
          <button className="rounded px-1 text-sm">URL</button>
        </div>
        <ChipGroup
          title="글 주제"
          options={[
            "프로덕트",
            "개발",
            "디자인",
            "기획",
            "인사이트",
            "취업",
            "창업",
            "학교",
          ]}
          selectedOption={topic}
          onSelect={handleTopicSelect}
        />
        <button
          className={`mt-6 w-full rounded-lg py-3 text-white ${
            isFormValid ? "bg-blue-500" : "cursor-not-allowed bg-gray-400"
          }`}
          disabled={!isFormValid}
        >
          업로드
        </button>
      </main>
      <BottomNavbar activeLabel="커뮤니티" />
    </div>
  );
};

export default WritePost;
