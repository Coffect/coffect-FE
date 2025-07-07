// author : 앨리스/박은지
// description : 채팅방 목록 페이지
// 데이터가 필요한 작업이므로 임시 하드 코딩

import BottomNavbar from "../components/shareComponents/BottomNavbar";
import { useNavigate } from "react-router-dom";

const chatList = [
  {
    id: 1,
    name: "김하은",
    job: "TESL전공",
    message: "그럼 거기서 2시에 보시죠!",
    time: "2m",
    unread: true,
  },
  {
    id: 2,
    name: "김하은",
    job: "TESL전공",
    message: "넵 좋습니다!",
    time: "2m",
    unread: false,
  },
  {
    id: 3,
    name: "김하은",
    job: "TESL전공",
    message: "상상님이 제안을 수락했어요!",
    time: "2m",
    unread: false,
  },
];

const Chat = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-10 pb-2">
        <span className="text-2xl font-bold">chats</span>
      </div>
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2 pb-20">
        {chatList.map((chat) => (
          <div
            key={chat.id}
            className="flex cursor-pointer items-start px-3 py-3 hover:bg-gray-100"
            onClick={() => navigate(`/chat/${chat.id}`)}
          >
            {/* 아바타(임시) */}
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gray-300">
              {chat.unread && (
                <span className="absolute top-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-red-500"></span>
              )}
            </div>
            {/* 채팅 정보 */}
            <div className="ml-3 flex flex-1 flex-col">
              <div className="flex items-center">
                <span className="mr-1 text-base font-bold">{chat.name}</span>
                <span className="text-xs font-medium text-gray-400">
                  {chat.job}
                </span>
              </div>
              <span className="text-sm text-gray-500">{chat.message}</span>
            </div>
            {/* 시간 */}
            <div className="ml-2">
              <span className="text-xs text-gray-400">{chat.time}</span>
            </div>
          </div>
        ))}
      </div>
      <BottomNavbar activeLabel="채팅" />
    </div>
  );
};

export default Chat;
