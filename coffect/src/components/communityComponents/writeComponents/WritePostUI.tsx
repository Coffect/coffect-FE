/* author : 강신욱
description : 글 작성 페이지의 UI를 담당하는 프레젠테이션 컴포넌트입니다.
*/
import React from "react";
import ChipGroup from "../common/ChipGroup";
import type { WritePostUIProps } from "../../../types/writePostTypes";
//** 수정 사항 : Image와 Link icon이 디자인과 같지 않습니다.
import { ChevronLeft, Image, Link } from "lucide-react";

const WritePostUI: React.FC<WritePostUIProps> = ({
  postType,
  setPostType,
  topic,
  handleTopicSelect,
  title,
  setTitle,
  content,
  setContent,
  isFormValid,
  handleBackClick,
  onUpload,
}) => {
  return (
    <div className="flex h-screen flex-col bg-white">
      <header className="flex items-center justify-between p-4">
        <button onClick={handleBackClick}>
          <ChevronLeft />
        </button>
        <h1 className="text-lg font-bold">글 작성하기</h1>
        <button
          className={`rounded font-bold ${isFormValid ? "text-[#ff8126]" : "cursor-not-allowed text-gray-300"}`}
          disabled={!isFormValid}
          onClick={onUpload}
        >
          완료
        </button>
      </header>
      <main className="flex-grow">
        <div className="px-4">
          <input
            type="text"
            placeholder="제목을 입력하세요"
            className="mb-3 w-full text-xl font-bold placeholder:text-xl placeholder:font-bold placeholder:text-[#121212] focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4 h-[0.8px] w-full bg-[#acacac]"></div>

        <div className="px-4">
          <textarea
            placeholder="오늘은 어떤 글을 써볼까요?"
            className="h-55 w-full rounded focus:outline-none"
            value={content}
            onChange={(e) => setContent(() => e.target.value)}
          />
          <div className="mt-4 mb-2 flex items-center space-x-4 pb-2">
            <button className="rounded px-1 text-sm">
              <Image />
            </button>
            <button className="rounded px-1 text-sm">
              <Link />
            </button>
          </div>
        </div>
        <div className="mb-4 h-[0.8px] w-full bg-[#acacac]"></div>

        <div>
          <div className="px-4 pt-4">
            <ChipGroup
              title="글 종류"
              options={[
                "아티클 ✍🏻",
                "팀원 모집 👬",
                "질문 👤",
                "도움 필요 🤩",
                "후기글 ☕",
                "팁 공유 📌",
              ]}
              selectedOption={postType}
              onSelect={setPostType}
            />
            <div className="pt-4">
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
                  "기타",
                ]}
                selectedOption={topic}
                onSelect={handleTopicSelect}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WritePostUI;
