/*
 * author : 박은지
 * description : 채팅방 목록 컴포넌트
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import type { ChatRoomWithUser } from "../../types/chat";

interface ChatRoomItemProps {
  chatRoom: ChatRoomWithUser;
  onClick: (chatRoom: ChatRoomWithUser) => void;
}

const ChatRoomItem: React.FC<ChatRoomItemProps> = ({ chatRoom, onClick }) => {
  return (
    <div
      className="mb-2 flex cursor-pointer items-start border-b border-[var(--gray-10)] px-3 py-4 hover:bg-[var(--gray-5)]"
      onClick={() => onClick(chatRoom)}
    >
      {/* 프로필 */}
      <div className="relative flex h-13 w-13 items-center justify-center rounded-full bg-[var(--gray-20)]">
        {chatRoom.userInfo?.profileImage ? (
          <img
            src={chatRoom.userInfo.profileImage}
            alt={`${chatRoom.userInfo.name} 프로필`}
            className="h-full w-full rounded-full object-cover"
            onError={(e) => {
              // 이미지 로드 실패 시 기본 배경색 유지
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-[var(--gray-50)]">
            {chatRoom.userInfo?.name?.charAt(0) || "?"}
          </div>
        )}
        {!chatRoom.check && (
          <span className="absolute -top-0 -right-1 h-4 w-4 rounded-full border-2 border-[var(--white)] bg-[var(--noti)]"></span>
        )}
      </div>
      {/* 채팅 정보 */}
      <div className="ml-3 flex min-w-0 flex-1 flex-col">
        <div className="flex min-w-0 items-center">
          <span className="mr-2 flex-shrink-0 text-lg font-bold whitespace-nowrap text-[var(--gray-90)]">
            {chatRoom.userInfo?.name}
          </span>
          <span className="min-w-0 flex-1 truncate overflow-hidden text-sm font-medium text-ellipsis whitespace-nowrap text-[var(--gray-50)]">
            {chatRoom.userInfo?.major}
          </span>
        </div>
        <div className="flex min-w-0 items-center justify-between">
          <span className="text-s min-w-0 flex-1 truncate overflow-hidden py-1 text-ellipsis whitespace-nowrap text-[var(--gray-70)]">
            {chatRoom.lastMessage}
          </span>
          <span className="ml-2 flex-shrink-0 truncate overflow-hidden text-sm text-ellipsis whitespace-nowrap text-[var(--gray-40)]">
            방금 전
          </span>
        </div>
      </div>
    </div>
  );
};

interface ChatRoomListProps {
  chatRooms: ChatRoomWithUser[];
  onChatRoomSelect?: (chatRoom: ChatRoomWithUser) => void;
  showEmptyState?: boolean;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({
  chatRooms,
  onChatRoomSelect,
  showEmptyState = true,
}) => {
  const navigate = useNavigate();

  const handleChatRoomClick = (chatRoom: ChatRoomWithUser) => {
    onChatRoomSelect?.(chatRoom);
    navigate(`/chat/${chatRoom.chatroomId}`, {
      state: { chatRoom },
    });
  };

  if (chatRooms.length === 0 && showEmptyState) {
    return (
      <div className="flex h-full flex-col items-center justify-center pt-24">
        <span className="mb-2 text-[20px] font-bold text-[var(--gray-90)]">
          아직 시작된 대화가 없어요!
        </span>
        <span className="mb-2 text-[16px] font-medium text-[var(--gray-50)]">
          지금 바로 추천 카드를 통해
          <br />
          커피챗을 제안해보세요!
        </span>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[var(--gray-10)]">
      {chatRooms.map((chatRoom, index) => (
        <ChatRoomItem
          key={chatRoom.chatroomId || `chat-${chatRoom.userId}-${index}`}
          chatRoom={chatRoom}
          onClick={handleChatRoomClick}
        />
      ))}
    </div>
  );
};

export default ChatRoomList;
