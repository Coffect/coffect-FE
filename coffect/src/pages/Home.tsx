// Home.tsx
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
import { useNavigate } from "react-router-dom";
// [ADD] iOS PWA 알림 버튼
import PushEnableButton from "@/components/Home/PushEnableButton";

// [ADD] 실행 환경 감지
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const nav = navigator as Navigator & { standalone?: boolean };
const isPWA =
  window.matchMedia?.("(display-mode: standalone)")?.matches === true ||
  nav.standalone === true;
const hasSW =
  "serviceWorker" in navigator && !!navigator.serviceWorker.controller;

const Home = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // 프로필 작성 유도 모달 여부

  //오전 9시 체크 함수
  const isExpired = (timeStr: string) => {
    const now = new Date();
    const saved = new Date(timeStr);
    const resetTime = new Date();
    resetTime.setHours(9, 0, 0, 0);
    return now > resetTime && saved < resetTime;
  };

  useEffect(() => {
    // 추천 카테고리 선택 여부 확인
    const selected = localStorage.getItem("coffeeCategorySelected");
    const expire = localStorage.getItem("coffeeCategoryExpire");

    if (selected && expire && !isExpired(expire)) {
      navigate("/home/cards");
      return;
    }

    localStorage.removeItem("coffeeCategorySelected");
    localStorage.removeItem("coffeeCategoryExpire");

    const hasSeen = localStorage.getItem("hasSeenProfileModal");
    if (!hasSeen) {
      setShowModal(true);
      localStorage.setItem("hasSeenProfileModal", "true");
    }
  }, [navigate]);

  return (
    <div className="relative mx-auto flex h-full w-full flex-col overflow-x-hidden overflow-y-auto bg-[var(--gray-5)]">
      <ProfileModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <div className="flex">
        <TopNavbar pageType="home" />
      </div>

      <main className="flex-1 items-center overflow-auto px-[1rem] pb-20">
        {/* [ADD] iOS PWA + SW 제어권 + 아직 권한 미허용일 때만 노출 */}
        {isIOS && isPWA && hasSW && Notification.permission !== "granted" && (
          <div className="mx-[5%] my-[3%]">
            <PushEnableButton />
          </div>
        )}

        {/* 추천 배너 슬라이드 */}
        <CoffeeBanner />

        {/* 추천 기준 선택 or 추천 프로필 보기 */}
        <CoffeeCategoryGrid />
      </main>

      <div className="flex w-full">
        <BottomNavbar activeLabel="홈" />
      </div>
    </div>
  );
};

export default Home;
