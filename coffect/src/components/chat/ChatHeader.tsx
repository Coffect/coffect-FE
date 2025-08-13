/*
 * author : 앨리스/박은지
 * description : 채팅방 헤더
 */

import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

interface ChatHeaderProps {
  username: string;
  profileImage?: string;
  onProfileClick: () => void;
}

const ChatHeader = ({
  username,
  profileImage,
  onProfileClick,
}: ChatHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center border-b border-[var(--gray-10)] bg-[var(--white)] px-4 pt-6 pb-3">
      <button className="mr-2 text-2xl" onClick={() => navigate("/chat")}>
        <ChevronLeft />
      </button>
      <div className="flex flex-1 flex-col items-center">
        <span className="text-[18px] font-semibold">{username}</span>
      </div>
      <div
        className="ml-2 h-8 w-8 cursor-pointer overflow-hidden rounded-full bg-[var(--gray-10)]"
        onClick={onProfileClick}
      >
        {profileImage && (
          <img
            src={profileImage}
            alt="프로필"
            className="h-full w-full rounded-full object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
