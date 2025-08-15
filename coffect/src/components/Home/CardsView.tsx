/*
  author      : 이희선
  description : 추천 프로필 카드 뷰 페이지(메시지베너+추천카드들)입니다.
*/

import BottomNavbar from "../shareComponents/BottomNavbar";
import TopNavbar from "./TopNavbar";
import CoffeeBanner from "./CoffeeSuggestBanner";
import ProfileModal from "./ProfileModal";
import ProfileFlip from "./ProfileFlip";
import { useState } from "react";
import Toast from "./Toast";

const CardsView = () => {
  const [showModal, setShowModal] = useState(false); // 프로필 작성 유도 모달 여부
  const [loading, setLoading] = useState(false); // 로딩 상태

  return (
    <div className="relative mx-auto flex h-full w-full flex-col overflow-x-hidden overflow-y-auto bg-[var(--gray-5)]">
      {/* 로딩 화면 */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 text-white">
          로딩 중...
        </div>
      )}

      {/* 프로필 작성 유도 모달 */}
      <ProfileModal isOpen={showModal} onClose={() => setShowModal(false)} />

      {/* 상단 네비게이션 */}
      <div className="flex">
        <TopNavbar pageType="home" />
      </div>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 items-center overflow-auto px-[1rem] pb-20">
        {/* 추천 배너 슬라이드 */}
        <CoffeeBanner />
        {/* 추천 프로필 카드들 */}
        <ProfileFlip onLoadingChange={setLoading} />
      </main>

      {/* 하단 네비게이션 */}
      <div className="flex w-full">
        <BottomNavbar activeLabel="홈" />
      </div>
      <Toast />
    </div>
  );
};

export default CardsView;
