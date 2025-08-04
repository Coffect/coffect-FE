// author : 앨리스/박은지
// description : 채팅방 목록 페이지
// 데이터가 필요한 작업이므로 임시 하드 코딩, ChatList가 없을 시 UI도 구현되어 있음

import BottomNavbar from "../components/shareComponents/BottomNavbar";
import { useNavigate } from "react-router-dom";
import EmptyChatList from "../assets/icon/chat/EmptyChatList.png";
import ExampleProfile from "../assets/icon/chat/ExampleProfile.png";

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
    <div className="flex h-full w-full flex-col bg-[var(--white)]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-8 pb-3">
        <span className="ml-2 text-2xl font-bold text-[var(--gray-90)]">
          채팅
        </span>
      </div>
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2 pb-20">
        {/* 메시지 없을 때 */}
        {chatList.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center pt-24">
            <span className="mb-2 text-lg font-bold text-[var(--gray-90)]">
              아직 시작된 대화가 없어요!
            </span>
            <span className="mb-6 text-sm text-[var(--gray-50)]">
              지금 바로 추천 카드를 통해
              <br />
              커피챗을 제안해보세요!
            </span>

            <div className="mt-2 flex flex-col items-center">
              <img
                src={EmptyChatList}
                alt="빈 채팅 목록"
                className="h-[100px] w-[100px]"
              />
            </div>
          </div>
        ) : (
          chatList.map((chat) => (
            <div
              key={chat.id}
              className="mb-2 flex cursor-pointer items-start border-b border-[var(--gray-10)] px-3 py-5 hover:bg-[var(--gray-5)]"
              onClick={() => navigate(`/chat/${chat.id}`)}
            >
              {/* 임시 프로필 */}
              <div className="relative flex h-13 w-13 items-center justify-center rounded-full bg-[var(--gray-20)]">
                <img
                  src={ExampleProfile}
                  alt="프로필"
                  className="h-full w-full object-cover"
                />
                {chat.unread && (
                  <span className="absolute -top-0 -right-1 h-4 w-4 rounded-full border-2 border-[var(--white)] bg-[var(--noti)]"></span>
                )}
              </div>
              {/* 채팅 정보 */}
              <div className="ml-3 flex min-w-0 flex-1 flex-col">
                <div className="flex min-w-0 items-center">
                  <span className="mr-2 flex-shrink-0 text-lg font-bold whitespace-nowrap text-[var(--gray-90)]">
                    {chat.name}
                  </span>
                  <span className="min-w-0 flex-1 truncate overflow-hidden text-sm font-medium text-ellipsis whitespace-nowrap text-[var(--gray-50)]">
                    {chat.job}
                  </span>
                </div>
                <div className="flex min-w-0 items-center justify-between">
                  <span className="text-s min-w-0 flex-1 truncate overflow-hidden py-1 text-ellipsis whitespace-nowrap text-[var(--gray-70)]">
                    {chat.message}
                  </span>
                  <span className="ml-2 flex-shrink-0 truncate overflow-hidden text-sm text-ellipsis whitespace-nowrap text-[var(--gray-40)]">
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
