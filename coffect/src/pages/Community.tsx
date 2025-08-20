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
import { useGetCommunityPostsQuery } from "@/hooks/community/query/useGetCommunityPostsQuery";
import { useGetThreadLatestQuery } from "@/hooks/community/query/useGetThreadLatestQuery";
import { useCommunityStore } from "@/store/community/communityStore";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api/profile";
import type { profileType } from "@/types/mypage/profile";

const Community = () => {
  const [activeQuery, setActiveQuery] = useState<"latest" | "filtered">(
    "latest",
  );
  // --- Zustand 스토어에서 상태 및 액션 가져오기 ---
  const {
    sortOrder,
    filters,
    isFilterModalOpen,
    resetFilters: resetStoreFilters,
    closeFilterModal,
    setFilters,
  } = useCommunityStore();

  // --- 내 프로필 정보 가져오기 ---
  const { data: myProfile } = useQuery<profileType>({
    queryKey: ["myProfile"],
    queryFn: getProfile,
  });
  const myUserId = myProfile?.success?.userInfo.userId;

  // --- 데이터 페칭 ---
  const latestQuery = useGetThreadLatestQuery({
    enabled: activeQuery === "latest",
  });

  const filteredQuery = useGetCommunityPostsQuery(
    {
      orderBy: sortOrder,
      type: filters.type || undefined,
      threadSubject: filters.subject,
    },
    { enabled: activeQuery === "filtered" },
  );

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = activeQuery === "latest" ? latestQuery : filteredQuery;

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

  const handleApplyFilters = (newFilters: {
    type: string | null;
    subject: number[] | null;
  }) => {
    setFilters(newFilters);
    setActiveQuery("filtered");
    closeFilterModal();
  };

  const handleReset = () => {
    resetStoreFilters();
    setActiveQuery("latest");
    closeFilterModal();
  };

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
        ) : posts.length > 0 ? (
          <>
            <FeedList posts={posts} myUserId={myUserId} />
            <div ref={ref} style={{ height: "1px" }} />
            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <FeedListSkeleton count={1} />
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
            <p className="text-lg font-bold">아직 게시글이 없어요!</p>
            <p className="mt-2 text-sm">다른 필터 조건을 선택해 보세요.</p>
          </div>
        )}
      </main>

      <FilterModal
        isVisible={isFilterModalOpen}
        onClose={closeFilterModal}
        onApply={handleApplyFilters}
        onReset={handleReset}
        selectedType={filters.type}
        selectedSubject={filters.subject}
      />

      <BottomNavbar activeLabel="커뮤니티" />
      <FloatingWriteButton />
      <UploadSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
};

export default Community;
