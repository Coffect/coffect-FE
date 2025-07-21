/**
 * @author 강신욱
 * @description 커뮤니티 메인 페이지 컴포넌트입니다.
 * @role : 컨트롤러 및 UI 조합. 
            useCommunityData에서 데이터 관련 로직
            useCommunityFilter에서 모달 UI 로직을 가져와 
            각 UI 컴포넌트(FeedList, FilterModal 등)에 연결하는 역할을 합니다. 
            즉, UI 구조에만 집중합니다.
 *
 * 이 컴포넌트의 주요 역할:
 * 1. 데이터 로직(useCommunityData)과 필터 UI 상태 로직(useCommunityFilter)을 결합합니다.
 * 2. 페이지의 전체적인 레이아웃(Header, FeedList, BottomNavbar 등)을 구성합니다.
 * 3. FilterModal의 열고 닫힘 상태를 관리하고, 필터 적용 로직을 트리거합니다.
 *
 * 데이터 fetching, 상태 관리 등 복잡한 로직은 모두 custom hook으로 분리되어 있어,
 * 이 컴포넌트는 UI 구조와 사용자 인터랙션 처리에만 집중합니다.
 */

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// UI 컴포넌트
import Header from "../components/communityComponents/Header";
import FeedList from "../components/communityComponents/feed/FeedList";
import FilterModal from "../components/communityComponents/BottomSeatFilter/FilterModal";
import BottomNavbar from "../components/shareComponents/BottomNavbar";
import FloatingWriteButton from "../components/communityComponents/FloatingWriteButton";
import UploadSuccessModal from "../components/communityComponents/writeComponents/UploadSuccessModal";

// Custom Hooks
import { useCommunityFilter } from "../hooks/community/useCommunityFilter";
import { useCommunityData } from "../hooks/community/useCommunityData";

const Community = () => {
  // --- 데이터 로직 --- //
  // useCommunityData 훅을 통해 게시글 데이터, 로딩 상태, 필터 적용 함수를 가져옵니다.
  const { posts, loading, activeFilters, applyFilters } = useCommunityData();

  // --- 필터 모달 UI 상태 로직 --- //
  // useCommunityFilter 훅은 모달이 열렸을 때 사용자가 선택하는 임시 필터 상태를 관리합니다.
  const {
    selectedType,
    selectedTopic,
    handleTypeSelect,
    handleTopicSelect,
    handleReset,
    filters: modalFilters, // 현재 모달에서 선택된 필터 값
  } = useCommunityFilter({ initialFilters: activeFilters });

  // --- UI 상태 --- //
  // 필터 모달의 표시 여부를 관리하는 상태입니다.
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 글 작성 완료 후 보여지는 성공 모달의 상태입니다.
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // 글 작성 페이지에서 돌아왔을 때 성공 모달을 표시하기 위한 로직입니다.
  useEffect(() => {
    if (location.state?.showSuccessModal) {
      setIsSuccessModalOpen(true);
      // 모달을 보여준 후에는 state를 초기화하여, 페이지 재방문시 모달이 다시 뜨지 않도록 합니다.
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // 모달을 열고 닫는 함수
  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  /**
   * "필터 적용하기" 버튼 클릭 시 실행되는 핸들러입니다.
   * 모달에서 선택된 필터(modalFilters)를 useCommunityData 훅의 applyFilters 함수에 전달하여
   * 실제 데이터 필터링을 트리거합니다.
   */
  const handleApplyFilters = () => {
    applyFilters(modalFilters);
    closeModal(); // 필터 적용 후 모달을 닫습니다.
  };

  // 성공 모달의 "게시글 보기" 버튼 클릭 핸들러
  const handleViewPost = () => {
    setIsSuccessModalOpen(false);
    // TODO: 작성된 게시글 상세 페이지로 이동하는 로직 추가
  };

  return (
    <div className="relative flex h-full flex-col bg-white">
      <Header openModal={openModal} />

      <main className="flex-1 overflow-y-auto bg-white pb-20">
        {/* 로딩 중일 때와 아닐 때를 구분하여 UI를 표시합니다. */}
        {loading ? (
          <div className="flex h-full items-center justify-center">
            로딩 중...
          </div>
        ) : (
          <FeedList posts={posts} />
        )}
      </main>

      {/* 필터 모달 컴포넌트 */}
      <FilterModal
        isVisible={isModalVisible}
        onClose={closeModal}
        onApply={handleApplyFilters} // 필터 적용 함수 연결
        onReset={handleReset} // 초기화 함수 연결
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
