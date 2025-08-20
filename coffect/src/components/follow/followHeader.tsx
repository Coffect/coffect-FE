import { useNavigate } from "react-router-dom";
import BackIcon from "@/assets/icon/mypage/back.png";

interface FollowHeaderProps {
  follow: "Follower" | "Following";
  count?: number;
}

const FollowHeader = ({ follow, count }: FollowHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-4 py-3.25">
      <button
        onClick={() => navigate(-1)}
        className="pr-9 text-left text-3xl text-gray-600"
      >
        <img src={BackIcon} alt="뒤로가기" className="h-6 w-6" />
      </button>

      <h1 className="flex-1 items-center justify-center pr-15 text-center text-lg font-semibold text-[var(--gray-90)]">
        {follow === "Follower"
          ? `나의 팔로워 (${count})`
          : `나의 팔로잉 (${count})`}
      </h1>
    </header>
  );
};

export default FollowHeader;
