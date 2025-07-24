/*
  author      : 이희선
  description : 홈 메인 페이지(메시지 베너 + 추천 카테고리)입니다.
*/

import BottomNavbar from "../components/shareComponents/BottomNavbar";
import TopNavbar from "../components/Home/TopNavbar";
import CoffeeBanner from "../components/Home/CoffeeSuggestBanner";
import CoffeeCategoryGrid from "../components/Home/CoffeeCategoryGrid";
import ProfileModal from "../components/Home/ProfileModal";
import { useState, useEffect } from "react";

const Home = () => {
  const [showModal, setShowModal] = useState(false); // 프로필 작성 유도 모달 여부

  // 최초 접속 시 localStorage 체크 →프로필 작성 유도 모달 한 번만 보여줌
  useEffect(() => {
    const hasSeen = localStorage.getItem("hasSeenProfileModal");
    if (!hasSeen) {
      setShowModal(true);
      localStorage.setItem("hasSeenProfileModal", "true");
    }
  }, []);

  return (
    <div className="relative mx-auto flex h-full w-full flex-col overflow-x-hidden overflow-y-auto bg-[var(--gray-5)]">
      {/* 프로필 작성 유도 모달 */}
      <ProfileModal isOpen={showModal} onClose={() => setShowModal(false)} />

      {/* 상단 네비게이션  */}
      <div className="flex">
        <TopNavbar pageType="home" />
      </div>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 items-center overflow-auto px-[1rem] pb-20">
        {/* 추천 배너 슬라이드 */}
        <CoffeeBanner />

        {/* 추천 기준 선택 or 추천 프로필 보기 */}
        <CoffeeCategoryGrid />
      </main>

      {/* 하단 네비게이션 (고정 위치) */}
      <div className="flex w-full">
        <BottomNavbar activeLabel="홈" />
      </div>
    </div>
  );
};

export default Home;
