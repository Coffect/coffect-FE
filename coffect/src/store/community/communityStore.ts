import { create } from "zustand";

// 스토어에서 관리할 상태(state)의 타입 정의
interface CommunityState {
  sortOrder: "createdAt" | "likeCount";
  filters: {
    type: string | null;
    subject: number[] | null;
  };
  isFilterModalOpen: boolean;
}

// 스토어에서 사용할 액션(action)의 타입 정의
interface CommunityActions {
  setSortOrder: (order: CommunityState["sortOrder"]) => void;
  setFilters: (newFilters: Partial<CommunityState["filters"]>) => void;
  resetFilters: () => void;
  openFilterModal: () => void;
  closeFilterModal: () => void;
}

// Zustand 스토어 생성
export const useCommunityStore = create<CommunityState & CommunityActions>(
  (set) => ({
    // 초기 상태 값
    sortOrder: "createdAt",
    filters: {
      type: null,
      subject: null,
    },
    isFilterModalOpen: false,

    // 액션 구현
    setSortOrder: (order) => set({ sortOrder: order }),
    setFilters: (newFilters) =>
      set((state) => ({
        filters: { ...state.filters, ...newFilters },
      })),
    resetFilters: () => set({ filters: { type: null, subject: null } }),
    openFilterModal: () => set({ isFilterModalOpen: true }),
    closeFilterModal: () => set({ isFilterModalOpen: false }),
  }),
);
