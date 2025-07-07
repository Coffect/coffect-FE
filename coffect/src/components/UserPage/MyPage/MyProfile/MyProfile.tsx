/*
author : 재하
description : 마이페이지 내 프로필 및 피드/상세소개 탭을 출력하는 컴포넌트입니다.
*/
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DetailIntro from "./DetailIntro";

export default function MyProfileUI() {
  /*
  사용자의 마이페이지 프로필 화면을 렌더링하며, 탭에 따라 피드 또는 상세 소개를 보여줍니다.
  */
  const navigate = useNavigate();
  // 현재 활성화된 탭 상태 ("내 피드" 또는 "상세 소개")
  const [activeTab, setActiveTab] = useState("내 피드");

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-white">
      {/* Header: 뒤로가기 버튼과 사용자 닉네임 */}
      <div className="relative flex items-center justify-between p-4">
        <button className="text-2xl" onClick={() => navigate("/mypage")}>
          &#x25C0;
        </button>
        <p className="absolute left-1/2 -translate-x-1/2 text-lg font-medium">
          jeha0714
        </p>
      </div>

      {/* Profile Section: 프로필 이미지와 통계 정보 */}
      <div className="p-4">
        <div className="mb-4 flex items-center justify-around">
          {/* Profile Image: 사용자 프로필 이미지 자리 */}
          <div className="h-22 w-22 rounded-full bg-black sm:h-28 sm:w-28"></div>

          {/* Stats: 포스트/팔로워/팔로잉 수 */}
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

        {/* Profile Info: 사용자 이름, 전공, 학번, 자기소개 */}
        <div className="mb-4">
          <div className="flex flex-row items-end gap-2">
            <h2 className="mb-1 text-2xl font-semibold">재하</h2>
            <p className="mb-1 text-sm text-gray-600">TESL 전공 • 24학번</p>
          </div>
          <p className="text-sm text-gray-600">안녕하세요!</p>
          <p className="text-sm text-gray-600">저는 뭐가 될 수 있을까요?</p>
        </div>

        {/* Profile Edit Button: 프로필 수정 페이지로 이동 */}
        <button
          className="mb-4 w-full rounded-lg bg-gray-200 px-4 py-2 font-medium text-black"
          onClick={() => navigate("/mypage/myprofile/modify")}
        >
          프로필 수정
        </button>

        {/* Tab Navigation: 내 피드/상세 소개 탭 전환 */}
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

      {/* Content Area: 탭에 따라 내용 분기 */}
      <div className="p-4">
        {/* 내 피드 탭이 활성화된 경우 피드 내용 출력 */}
        {activeTab === "내 피드" && (
          <div className="py-8 text-center">
            {/* 실제 피드 데이터가 들어갈 자리 (현재는 더미 텍스트) */}
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

        {/* 상세 소개 탭이 활성화된 경우 상세 소개 컴포넌트 출력 */}
        {activeTab === "상세 소개" && <DetailIntro />}
      </div>
    </div>
  );
}
