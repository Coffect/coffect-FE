/*
 * author : 앨리스/박은지
 * description : 채팅방 목록 페이지
 * API를 통한 채팅방 목록 조회 및 표시
 */

import BottomNavbar from "../components/shareComponents/BottomNavbar";
import { useNavigate } from "react-router-dom";
import EmptyChatList from "../assets/icon/chat/EmptyChatList.png";
import { getRelativeTime } from "../utils/dateUtils";

import { useChatRooms } from "../hooks/chat";

const Chat = () => {
  const navigate = useNavigate();
  const { chatRooms, isLoading, error } = useChatRooms();

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col bg-[var(--white)]">
        <div className="flex items-center justify-between px-5 pt-8">
          <span className="ml-2 text-2xl font-bold text-[var(--gray-90)]">
            채팅
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <span className="text-[var(--gray-50)]">
            채팅방 목록을 불러오는 중...
          </span>
        </div>
        <BottomNavbar activeLabel="채팅" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full flex-col bg-[var(--white)]">
        <div className="flex items-center justify-between px-5 pt-8 pb-3">
          <span className="ml-2 text-2xl font-bold text-[var(--gray-90)]">
            채팅
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <span className="text-[var(--gray-50)]">{error}</span>
        </div>
        <BottomNavbar activeLabel="채팅" />
      </div>
    );
  }

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
        {chatRooms.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center pt-24">
            <span className="mb-2 text-[20px] font-bold text-[var(--gray-90)]">
              아직 시작된 대화가 없어요!
            </span>
            <span className="mb-2 text-[16px] font-medium text-[var(--gray-50)]">
              지금 바로 추천 카드를 통해
              <br />
              커피챗을 제안해보세요!
            </span>

            <div className="flex flex-col items-center">
              <img
                src={EmptyChatList}
                alt="빈 채팅 목록"
                className="h-[110px] w-[110px]"
              />
            </div>
          </div>
        ) : (
          chatRooms.map((chat, index) => (
            <div
              key={chat.chatroomId || `chat-${chat.userId}-${index}`}
              className="mb-2 flex cursor-pointer items-start border-b border-[var(--gray-10)] px-3 py-5 hover:bg-[var(--gray-5)]"
              onClick={() => {
                navigate(`/chat/${chat.chatroomId}`);
              }}
            >
              {/* 프로필 */}
              <div className="relative flex h-13 w-13 items-center justify-center rounded-full bg-[var(--gray-20)]">
                {chat.hasUnreadMessages && (
                  <span className="absolute -top-0 -right-1 h-4 w-4 rounded-full border-2 border-[var(--white)] bg-[var(--noti)]"></span>
                )}
              </div>
              {/* 채팅 정보 */}
              <div className="ml-3 flex min-w-0 flex-1 flex-col">
                <div className="flex min-w-0 items-center">
                  <span className="mr-2 flex-shrink-0 text-lg font-bold whitespace-nowrap text-[var(--gray-90)]">
                    {chat.userInfo?.name}
                  </span>
                  <span className="min-w-0 flex-1 truncate overflow-hidden text-sm font-medium text-ellipsis whitespace-nowrap text-[var(--gray-50)]">
                    {chat.userInfo?.major}
                  </span>
                </div>
                <div className="flex min-w-0 items-center justify-between">
                  <span className="text-s min-w-0 flex-1 truncate overflow-hidden py-1 text-ellipsis whitespace-nowrap text-[var(--gray-70)]">
                    {chat.lastMessage}
                  </span>
                  <span className="ml-2 flex-shrink-0 truncate overflow-hidden text-sm text-ellipsis whitespace-nowrap text-[var(--gray-40)]">
                    {chat.lastMessageTime
                      ? getRelativeTime(chat.lastMessageTime)
                      : "지금"}
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
