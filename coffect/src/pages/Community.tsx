import { useEffect, useState } from "react";
import Header from "../components/communityComponents/Header";
import FeedList from "../components/communityComponents/feed/FeedList";
import FilterModal from "../components/communityComponents/bottomSeat/FilterModal";
import BottomNavbar from "../components/shareComponents/BottomNavbar";
import { Post, generateDummyPosts } from "../data/communityDummyData";

// 필터 타입 정의
interface Filters {
  type: string | null;
  topic: string | null;
}

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState<Filters>({ type: null, topic: null });

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

  return (
    <div className="flex h-full flex-col bg-gray-100">
      <Header openModal={openModal} />

      {/* 피드부분 */}
      <main className="flex-1 overflow-y-auto bg-white">
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
    </div>
  );
};

export default Community;
