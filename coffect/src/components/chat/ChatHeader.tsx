/*
 * author : 앨리스/박은지
 * description : 채팅방 상단 헤더
 */

import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import ExampleProfile from "../../assets/icon/chat/ExampleProfile.png";

interface ChatHeaderProps {
  username: string;
  userId: string;
}

const ChatHeader = ({ username, userId }: ChatHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center border-b border-[var(--gray-10)] bg-[var(--white)] px-4 pt-6 pb-2">
      <button className="mr-2 text-2xl" onClick={() => navigate("/chat")}>
        <ChevronLeft />
      </button>
      <div className="flex flex-1 flex-col items-center">
        <span className="text-base font-extrabold">{username}</span>
      </div>
      <div
        className="ml-2 h-8 w-8 cursor-pointer overflow-hidden rounded-full border-1 border-[var(--gray-80)] p-[1px]"
        onClick={() => navigate(`/userpage/${userId}`)}
      >
        <img
          src={ExampleProfile}
          alt="프로필"
          className="h-full w-full rounded-full object-cover"
        />
      </div>
    </div>
  );
};

export default ChatHeader;
