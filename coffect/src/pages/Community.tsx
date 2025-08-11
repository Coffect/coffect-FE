/**
 * @author 강신욱
 * @description 커뮤니티 메인 페이지 컴포넌트입니다.
 * @version 1.4.0
 * @date 2025-08-11
 * @remarks
 * - 1.1.0: 최신순 게시글을 무한 스크롤로 불러오도록 수정
 * - 1.2.0: 초기 로딩 시 스켈레톤 UI 적용
 * - 1.3.0: useState를 Zustand 스토어로 리팩터링
 * - 1.4.0: 통합 쿼리 훅(useGetCommunityPostsQuery) 적용 및 정렬 기능 추가
 */

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";

// --- 컴포넌트 ---
import Header from "@/components/communityComponents/Header";
import FeedList from "@/components/communityComponents/feed/FeedList";
import FeedListSkeleton from "@/components/communityComponents/feed/FeedListSkeleton";
import FilterModal from "@/components/communityComponents/BottomSeatFilter/FilterModal";
import BottomNavbar from "@/components/shareComponents/BottomNavbar";
import FloatingWriteButton from "@/components/communityComponents/FloatingWriteButton";
import UploadSuccessModal from "@/components/communityComponents/writeComponents/SuccessModal/UploadSuccessModal";

// --- 훅 & 스토어 ---
import { useGetCommunityPostsQuery } from "@/hooks/community/query/useGetCommunityPostsQuery"; // 통합 쿼리 훅 임포트
import { useCommunityStore } from "@/store/community/communityStore";

const Community = () => {
  // --- Zustand 스토어에서 상태 및 액션 가져오기 ---
  const {
    sortOrder,
    filters,
    isFilterModalOpen,
    resetFilters,
    closeFilterModal,
    setFilters,
  } = useCommunityStore();

  // --- 데이터 페칭 ---
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCommunityPostsQuery(
    {
      orderBy: sortOrder, // 스토어의 sortOrder 사용
      type: filters.type || undefined, // 필터 타입
      threadSubject: filters.subject,
    },
    { enabled: true }, // 항상 활성화 (queryKey 변경 시 재실행)
  );

  // --- 무한 스크롤 로직 ---
  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // --- 글 작성 완료 모달 관련 로직 ---
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.showSuccessModal) {
      setIsSuccessModalOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // --- 렌더링 데이터 준비 ---
  const posts = data?.pages.flatMap((page) => page.success?.thread || []) || [];

  // --- 렌더링 ---
  if (error) {
    return (
      <div className="relative flex h-full flex-col bg-white">
        <Header openModal={useCommunityStore.getState().openFilterModal} />{" "}
        {/* 스토어 액션 직접 연결 */}
        <div className="flex flex-1 items-center justify-center">
          게시글을 불러오는 중 오류가 발생했습니다: {error.message}
        </div>
        <BottomNavbar activeLabel="커뮤니티" />
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col bg-white">
      <Header openModal={useCommunityStore.getState().openFilterModal} />

      <main className="flex-1 overflow-y-auto bg-white pb-20">
        {isLoading ? (
          <FeedListSkeleton />
        ) : (
          <>
            <FeedList posts={posts} />
            <div ref={ref} style={{ height: "1px" }} />
            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <FeedListSkeleton count={1} />
              </div>
            )}
          </>
        )}
      </main>

      <FilterModal
        isVisible={isFilterModalOpen}
        onClose={closeFilterModal}
        onApply={closeFilterModal} // 필터는 즉시 적용되므로, 적용 버튼은 모달을 닫기만 함
        onReset={resetFilters}
        selectedType={filters.type}
        selectedSubject={filters.subject}
        onTypeSelect={(option) => setFilters({ type: option.value })}
        onSubjectSelect={(option) => setFilters({ subject: [option.id] })}
      />

      <BottomNavbar activeLabel="커뮤니티" />
      <FloatingWriteButton />
      <UploadSuccessModal
        isOpen={isSuccessModalOpen}
        onViewPost={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
};

export default Community;
