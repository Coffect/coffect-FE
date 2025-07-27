/*
author : 강신욱
description : 커뮤니티 페이지에 대한 컴포넌트입니다.
            커뮤니티 상단 헤더, 피드 리스트, 필터 모달, 바텀 네비게이션을 포함합니다.
*/

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/communityComponents/Header";
import FeedList from "@/components/communityComponents/feed/FeedList";
import FilterModal from "@/components/communityComponents/BottomSeat/FilterModal";
import BottomNavbar from "@/components/shareComponents/BottomNavbar";
import { type Post, generateDummyPosts } from "@/data/communityDummyData";
import FloatingWriteButton from "@/components/communityComponents/FloatingWriteButton";
import UploadSuccessModal from "@/components/communityComponents/writeComponents/UploadSuccessModal";

// 필터 타입 정의
interface Filters {
  type: string | null;
  topic: string | null;
}

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState<Filters>({ type: null, topic: null });
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.showSuccessModal) {
      setIsSuccessModalOpen(true);
      // 모달을 보여준 후에는 state를 초기화하여, 페이지 재방문시 모달이 다시 뜨지 않도록 합니다.
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  // 필터 적용 핸들러
  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    closeModal();
  };

  useEffect(() => {
    // 필터가 변경될 때마다 데이터를 새로 로딩
    const fetchPosts = async () => {
      console.log("filters:", filters);
      // 실제 API 호출 로직으로 대체해야 합니다.
      // 예: const fetchedPosts = await api.getPosts({ page: 1, filters });
      const dummyPosts: Post[] = generateDummyPosts(filters);
      setPosts(dummyPosts);
    };

    fetchPosts();
  }, [filters]); // filters가 변경될 때마다 useEffect 실행

  const handleViewPost = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <div className="relative flex h-full flex-col bg-white">
      <Header openModal={openModal} />

      {/* 피드부분 */}
      <main className="flex-1 overflow-y-auto bg-white pb-20">
        <FeedList posts={posts} />
      </main>

      {/* 바텀시트 모달 */}
      <FilterModal
        isVisible={isModalVisible}
        onClose={closeModal}
        onApply={handleApplyFilters}
        initialFilters={filters}
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
