import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DetailIntro from "./DetailIntro";

export default function MyProfileUI() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("내 피드");

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-white">
      {/* Header */}
      <div className="relative flex items-center justify-between p-4">
        <button className="text-2xl" onClick={() => navigate("/mypage")}>
          &#x25C0;
        </button>
        <p className="absolute left-1/2 -translate-x-1/2 text-lg font-medium">
          jeha0714
        </p>
      </div>

      {/* Profile Section */}
      <div className="p-4">
        <div className="mb-4 flex items-center justify-around">
          {/* Profile Image */}
          <div className="h-22 w-22 rounded-full bg-black sm:h-28 sm:w-28"></div>

          {/* Stats */}
          <div className="flex space-x-8">
            <div className="text-center">
              <div className="text-lg font-semibold">3</div>
              <div className="text-sm text-gray-600">포스트</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">3</div>
              <div className="text-sm text-gray-600">팔로워</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">3</div>
              <div className="text-sm text-gray-600">팔로잉</div>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="mb-4">
          <div className="flex flex-row items-end gap-2">
            <h2 className="mb-1 text-2xl font-semibold">재하</h2>
            <p className="mb-1 text-sm text-gray-600">TESL 전공 • 24학번</p>
          </div>
          <p className="text-sm text-gray-600">안녕하세요!</p>
          <p className="text-sm text-gray-600">저는 뭐가 될 수 있을까요?</p>
        </div>

        {/* Profile Edit Button */}
        <button
          className="mb-4 w-full rounded-lg bg-gray-200 px-4 py-2 font-medium text-black"
          onClick={() => navigate("/mypage/myprofile/modify")}
        >
          프로필 수정
        </button>

        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            className={`flex-1 border-b-2 py-3 text-center font-medium ${
              activeTab === "내 피드"
                ? "border-black text-black"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab("내 피드")}
          >
            내 피드
          </button>
          <button
            className={`flex-1 border-b-2 py-3 text-center font-medium ${
              activeTab === "상세 소개"
                ? "border-black text-black"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab("상세 소개")}
          >
            상세 소개
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        {activeTab === "내 피드" && (
          <div className="py-8 text-center">
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
          </div>
        )}

        {activeTab === "상세 소개" && <DetailIntro />}
      </div>
    </div>
  );
}
