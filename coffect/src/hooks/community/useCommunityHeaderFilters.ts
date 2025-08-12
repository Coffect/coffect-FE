import { useCallback } from "react";
import { useCommunityStore } from "@/store/community/communityStore";

export const useCommunityHeaderFilters = () => {
  const {
    sortOrder,
    isFilterModalOpen,
    setSortOrder,
    openFilterModal,
    closeFilterModal,
  } = useCommunityStore();

  const handleFilterClick = useCallback(() => {
    if (isFilterModalOpen) {
      closeFilterModal();
    } else {
      openFilterModal();
    }
  }, [isFilterModalOpen, openFilterModal, closeFilterModal]);

  const handleLatestClick = useCallback(() => {
    setSortOrder("createdAt");
  }, [setSortOrder]);

  const handlePopularClick = useCallback(() => {
    setSortOrder("likeCount");
  }, [setSortOrder]);

  // 현재 활성화된 필터/정렬 버튼의 상태를 반환합니다.
  const activeFilter = isFilterModalOpen
    ? "filter"
    : sortOrder === "createdAt"
      ? "latest"
      : "popular";

  return {
    activeFilter,
    handleFilterClick,
    handleLatestClick,
    handlePopularClick,
  };
};
