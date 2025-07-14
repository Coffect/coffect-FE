// author : 앨리스/박은지
// description : 채팅방 목록 페이지
// 데이터가 필요한 작업이므로 임시 하드 코딩, ChatList가 없을 시 UI도 구현되어 있음

import BottomNavbar from "../components/shareComponents/BottomNavbar";
import { useNavigate } from "react-router-dom";
import { Bell, Mail } from "lucide-react";

const chatList = [
  {
    id: 1,
    name: "김하은",
    job: "디자인테크놀로지학과 21학번",
    message: "네 그럼 거기서 2시에 봅시다!",
    time: "지금",
    unread: true,
  },
  {
    id: 2,
    name: "김가영",
    job: "시각디자인학과",
    message: "넵",
    time: "20분 전",
    unread: false,
  },
  {
    id: 3,
    name: "홍길동",
    job: "컴퓨터공학과",
    message: "흠....",
    time: "1시간 전",
    unread: false,
  },
  {
    id: 4,
    name: "김정우",
    job: "천문학과",
    message: "알겠습니다 ㅠㅠ",
    time: "1시간 전",
    unread: false,
  },
];

const Chat = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-full w-full flex-col bg-white pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-10 pb-2">
        <span className="text-2xl font-bold">채팅</span>
        <div className="relative">
          <Bell size={24} className="text-gray-700" />
          <span className="absolute -top-0.5 -right-0.5 h-1 w-1 rounded-full bg-[rgba(255,53,53,1)]"></span>
        </div>
      </div>
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2 pb-20">
        {/* 메시지 없을 때 */}
        {chatList.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center pt-24">
            <span className="mb-2 text-lg font-bold">
              아직 시작된 대화가 없어요!
            </span>
            <span className="mb-6 text-sm text-gray-500">
              지금 바로 추천 카드를 통해
              <br />
              커피챗을 제안해보세요!
            </span>

            <div className="mt-2 flex flex-col items-center">
              <Mail size={80} />
            </div>
          </div>
        ) : (
          chatList.map((chat) => (
            <div
              key={chat.id}
              className="flex cursor-pointer items-start px-3 py-5 hover:bg-gray-100"
              onClick={() => navigate(`/chat/${chat.id}`)}
            >
              {/* 임시 프로필 */}
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gray-300">
                {chat.unread && (
                  <span className="absolute top-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[rgba(255,53,53,1)]"></span>
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
                <div className="flex items-center justify-between">
                  <span className="text-s py-2 text-gray-500">
                    {chat.message}
                  </span>
                  <span className="ml-2 text-xs text-gray-400">
                    {chat.time}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <BottomNavbar activeLabel="채팅" />
    </div>
  );
};

export default Chat;
