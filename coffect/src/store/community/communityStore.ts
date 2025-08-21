import { create } from "zustand";

interface CommunityState {
  sortOrder: "createdAt" | "likeCount";
  filters: {
    type: string | null;
    subject: number[] | null;
  };
  isFilterModalOpen: boolean;
  activeQuery: "latest" | "filtered";
}

interface CommunityActions {
  setSortOrder: (order: CommunityState["sortOrder"]) => void;
  setFilters: (newFilters: Partial<CommunityState["filters"]>) => void;
  resetFilters: () => void;
  openFilterModal: () => void;
  closeFilterModal: () => void;
  setActiveQuery: (query: CommunityState["activeQuery"]) => void;
}

export const useCommunityStore = create<CommunityState & CommunityActions>(
  (set) => ({
    sortOrder: "createdAt",
    filters: {
      type: "",
      subject: [],
    },
    isFilterModalOpen: false,
    activeQuery: "latest",

    setSortOrder: (order) => set({ sortOrder: order }),
    setFilters: (newFilters) =>
      set((state) => ({
        filters: { ...state.filters, ...newFilters },
      })),
    resetFilters: () =>
      set({
        filters: { type: "", subject: [] },
        sortOrder: "createdAt",
        activeQuery: "latest",
      }),

    openFilterModal: () => set({ isFilterModalOpen: true }),
    closeFilterModal: () => set({ isFilterModalOpen: false }),
    setActiveQuery: (query) => set({ activeQuery: query }),
  }),
);
