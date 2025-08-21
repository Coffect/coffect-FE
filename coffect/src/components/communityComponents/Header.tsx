import FilterIcon from "../../assets/icon/community/FilterIcon.png";
import { useCommunityStore } from "@/store/community/communityStore";

const buttonStyle =
  "flex h-[65%] w-[20%] items-center justify-center rounded-lg border border-[var(--gray-30)] text-[16px] text-[var(--gray-60)] font-md ";
const containerStyle = "flex items-center";
const activeButtonStyle =
  "bg-[var(--gray-70)] text-white font-semibold border-none";

interface HeaderProps {
  isFilterModalOpen: boolean;
  openFilterModal: () => void;
  closeFilterModal: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isFilterModalOpen,
  openFilterModal,
  closeFilterModal,
}) => {
  const { sortOrder, setSortOrder, setActiveQuery } = useCommunityStore();

  const handleFilterClick = () => {
    if (isFilterModalOpen) closeFilterModal();
    else openFilterModal();
  };

  const handleLatestClick = () => {
    setSortOrder("createdAt");
    setActiveQuery("latest");
  };

  const handlePopularClick = () => {
    setSortOrder("likeCount");
    setActiveQuery("filtered");
  };

  return (
    <div className="sticky top-0 z-10 flex h-[15%] max-h-[120px] w-full flex-col border-b-[var(--gray-70)] bg-white">
      <div className="flex h-full w-full flex-col">
        <div className={`${containerStyle} h-[50%] justify-between p-6`}>
          <div className="text-2xl font-bold text-black">커뮤니티</div>
        </div>

        <div className={`${containerStyle} h-[50%] justify-start gap-1 px-6`}>
          <button
            onClick={handleFilterClick}
            className={`flex h-[65%] w-[12%] items-center justify-center rounded-lg border border-[var(--gray-30)] text-sm ${
              isFilterModalOpen ? activeButtonStyle : "text-[var(--gray-60)]"
            }`}
          >
            <img
              src={FilterIcon}
              alt="Filter Icon"
              className="h-6 w-6"
              style={{
                filter: isFilterModalOpen ? "brightness(0) invert(1)" : "none",
              }}
            />
          </button>
          <button
            onClick={handleLatestClick}
            className={`${buttonStyle} ${
              sortOrder === "createdAt" ? activeButtonStyle : ""
            }`}
          >
            최신순
          </button>
          <button
            onClick={handlePopularClick}
            className={`${buttonStyle} ${
              sortOrder === "likeCount" ? activeButtonStyle : ""
            }`}
          >
            인기순
          </button>
        </div>
      </div>
      <div className="h-[7.3%] min-h-[6px] w-full bg-[var(--gray-5)]"></div>
    </div>
  );
};

export default Header;
