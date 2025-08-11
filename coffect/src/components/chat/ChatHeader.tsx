/*
 * author : 앨리스/박은지
 * description : 채팅방 헤더
 */

import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ExampleProfile from "../../assets/icon/chat/ExampleProfile.png";
import type { ChatUser } from "./hooks/useChatUser";

interface ChatHeaderProps {
  user: ChatUser;
}

export const ChatHeader = ({ user }: ChatHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center border-b border-[var(--gray-10)] bg-[var(--white)] px-4 pt-6 pb-3">
      <button className="mr-2 text-2xl" onClick={() => navigate("/chat")}>
        <ChevronLeft />
      </button>
      <div className="flex flex-1 flex-col items-center">
        <span className="text-[18px] font-semibold">{user.username}</span>
      </div>
      <div
        className="ml-2 h-8 w-8 cursor-pointer overflow-hidden rounded-full bg-transparent"
        onClick={() => navigate("/userpage/1")}
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
