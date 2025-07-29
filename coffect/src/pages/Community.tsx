/**
 * @author 강신욱
 * @description 커뮤니티 메인 페이지 컴포넌트입니다.
 * @role : 컨트롤러 및 UI 조립.
 *         `useCommunityFeed` 훅을 사용하여 데이터 로직을 위임하고,
 *         `useCommunityFilter` 훅으로 필터 모달의 UI 상태를 관리합니다.
 *         이 컴포넌트는 페이지의 전체적인 레이아웃과 데이터-UI 연결에만 집중합니다.
 */

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/communityComponents/Header";
import FeedList from "@/components/communityComponents/feed/FeedList";
import FilterModal from "@/components/communityComponents/BottomSeatFilter/FilterModal";
import BottomNavbar from "@/components/shareComponents/BottomNavbar";
import FloatingWriteButton from "@/components/communityComponents/FloatingWriteButton";
import UploadSuccessModal from "@/components/communityComponents/writeComponents/SuccessModal/UploadSuccessModal";

// --- Custom Hooks ---
import { useCommunityFilter } from "../hooks/community/useCommunityFilter";
import useCommunityFeed from "../hooks/community/useCommunityFeed";

// --- 상태 관리 ---
const Community = () => {
  // 실제 적용된 필터 상태를 Community 페이지에서 직접 관리합니다.
  const [activeFilters, setActiveFilters] = useState<{
    type: string | null;
    topic: string | null;
  }>({
    type: null,
    topic: null,
  });

  // activeFilters 상태를 인자로 넘겨주어, 필터가 변경될 때마다 훅이 자동으로 데이터를 다시 가져옵니다.
  const { posts, isLoading, error } = useCommunityFeed(activeFilters);

  // 필터 모달 내의 임시 선택 상태를 관리하는 훅입니다.
  const {
    selectedType,
    selectedTopic,
    handleTypeSelect,
    handleTopicSelect,
    handleReset,
    filters: modalFilters, // 모달에서 "적용하기"를 누르기 전까지의 임시 필터 값
  } = useCommunityFilter({ initialFilters: activeFilters });

  // 모달의 표시 여부를 관리하는 상태입니다.
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 글 작성 완료 후 보여지는 성공 모달의 상태입니다.
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // --- 로직 ---
  // 글 작성 페이지에서 돌아왔을 때 성공 모달을 표시하기 위한 로직입니다.
  useEffect(() => {
    if (location.state?.showSuccessModal) {
      setIsSuccessModalOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // 모달을 열고 닫는 함수
  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  /**
   * "필터 적용하기" 버튼 클릭 시 실행되는 핸들러입니다.
   * 모달의 임시 필터 값(modalFilters)으로 실제 필터 상태(activeFilters)를 업데이트합니다.
   * activeFilters가 변경되면, useCommunityFeed 훅이 이를 감지하고 데이터를 자동으로 새로고침합니다.
   */
  const handleApplyFilters = () => {
    setActiveFilters(modalFilters);
    closeModal();
  };

  // 성공 모달의 "게시글 보기" 버튼 클릭 핸들러
  const handleViewPost = () => {
    setIsSuccessModalOpen(false);
    // TODO: 작성된 게시글 상세 페이지로 이동하는 로직 추가
  };

  // --- 렌더링 ---
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        게시글을 불러오는 중 오류가 발생했습니다: {error.message}
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col bg-white">
      <Header openModal={openModal} />

      <main className="flex-1 overflow-y-auto bg-white pb-20">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            로딩 중...
          </div>
        ) : (
          <FeedList posts={posts} />
        )}
      </main>

      <FilterModal
        isVisible={isModalVisible}
        onClose={closeModal}
        onApply={handleApplyFilters}
        onReset={handleReset}
        selectedType={selectedType}
        selectedTopic={selectedTopic}
        onTypeSelect={handleTypeSelect}
        onTopicSelect={handleTopicSelect}
      />

      <BottomNavbar activeLabel="커뮤니티" />
      <FloatingWriteButton />
      <UploadSuccessModal
        isOpen={isSuccessModalOpen}
        onViewPost={handleViewPost}
      />
    </div>
  );
};

export default Community;
