/*
  author      : 이희선
  description : 홈 메인 페이지입니다.
*/

import BottomNavbar from "../components/shareComponents/BottomNavbar";
import TopNavbar from "../components/Home/TopNavbar";
import CoffeeBanner from "../components/Home/CoffeeSuggestBanner";
import CoffeeCategoryGrid from "../components/Home/CoffeeCategoryGrid";
import ProfileModal from "../components/Home/ProfileModal";
import ProfileFlip from "../components/Home/ProfileFlip";
import { useState, useEffect } from "react";

const Home = () => {
  const [showModal, setShowModal] = useState(false); // 프로필 작성 유도 모달 여부
  const [currentView, setCurrentView] = useState<"category" | "profile">(
    "category",
  ); // 뷰 선택 (카테고리/추천 프로필)

  // 최초 접속 시 localStorage 체크 →프로필 작성 유도 모달 한 번만 보여줌
  useEffect(() => {
    const hasSeen = localStorage.getItem("hasSeenProfileModal");
    if (!hasSeen) {
      setShowModal(true);
      localStorage.setItem("hasSeenProfileModal", "true");
    }
  }, []);

  return (
    <div className="relative mx-auto flex h-full w-full flex-col overflow-x-hidden overflow-y-auto bg-[#F5F5F5]">
      {/* 프로필 작성 유도 모달 */}
      <ProfileModal isOpen={showModal} onClose={() => setShowModal(false)} />

      {/* 상단 네비게이션  */}
      <div className="flex">
        <TopNavbar pageType="home" />
      </div>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 items-center overflow-y-auto px-[2vw]">
        {/* 추천 배너 슬라이드 */}
        <CoffeeBanner />

        {/* 추천 기준 선택 or 추천 프로필 보기 */}
        {currentView === "category" ? (
          <CoffeeCategoryGrid
            onCategoryClick={() => setCurrentView("profile")} // 클릭 시 추천 프로필 뷰로 전환
          />
        ) : (
          <ProfileFlip />
        )}
      </main>

      {/* 하단 네비게이션 (고정 위치) */}
      <div className="flex w-full">
        <BottomNavbar activeLabel="홈" />
      </div>
    </div>
  );
};

export default Home;
