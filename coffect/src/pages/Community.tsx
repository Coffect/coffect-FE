import { useEffect, useState } from "react";
import Header from "../components/communityComponents/Header";
import FeedList from "../components/communityComponents/feed/FeedList";
import FilterModal from "../components/communityComponents/bottomSeat/FilterModal";
import BottomNavbar from "../components/shareComponents/BottomNavbar";

// Post ( 피드 API 호출 ) 타입 정의
interface Post {
  id: number;
  user: {
    profileImage: string;
    nickname: string;
  };
  image: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
}

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
      const dummyPosts: Post[] = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        user: {
          profileImage: `https://randomuser.me/api/portraits/men/${i}.jpg`,
          nickname: `user_${i + 1}_${filters.type || "all"}`,
        },
        image: `https://picsum.photos/400/300?random=${i + 1}`,
        title: `[${filters.topic || "전체"}] 게시물 제목 ${i + 1}`,
        content: `이것은 게시물 내용입니다. 필터: ${filters.type}, ${filters.topic}`,
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 50),
      }));
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
      <BottomNavbar />
    </div>
  );
};

export default Community;
