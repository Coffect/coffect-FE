/*
 * author : 앨리스/박은지
 * description : 채팅방 목록 페이지
 * API를 통한 채팅방 목록 조회 및 표시
 */

import BottomNavbar from "../components/shareComponents/BottomNavbar";
import { useNavigate } from "react-router-dom";
import EmptyChatList from "../assets/icon/chat/EmptyChatList.png";
import ChatRoomList from "../components/chat/ChatRoomList";

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
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          <span className="mb-2 text-center text-[20px] font-bold text-[var(--gray-90)]">
            서버 연결 오류
          </span>
          <span className="mb-4 text-center text-[16px] text-[var(--gray-50)]">
            {error}
          </span>
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-[var(--primary)] px-4 py-2 text-white hover:bg-[var(--primary-dark)]"
          >
            다시 시도
          </button>
        </div>
        <BottomNavbar activeLabel="채팅" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-[var(--white)]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-8 pb-5">
        <span className="ml-2 text-2xl font-bold text-[var(--gray-90)]">
          채팅
        </span>
      </div>
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2 pb-20">
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
          <ChatRoomList
            chatRooms={chatRooms}
            onChatRoomSelect={(chatRoom) => {
              navigate(`/chat/${chatRoom.chatroomId}`);
            }}
            showEmptyState={false}
          />
        )}
      </div>
      <BottomNavbar activeLabel="채팅" />
    </div>
  );
};

export default Chat;
