/*
 * author : 박은지
 * description : 채팅방 목록 컴포넌트
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { useChatRooms } from "../../hooks/chat";
import type { ChatRoomWithUser } from "../../types/chat";

interface ChatRoomItemProps {
  chatRoom: ChatRoomWithUser;
  onClick: (chatRoom: ChatRoomWithUser) => void;
}

const ChatRoomItem: React.FC<ChatRoomItemProps> = ({ chatRoom, onClick }) => {
  return (
    <div
      className="flex cursor-pointer items-center border-b border-gray-200 p-4 transition-colors hover:bg-gray-50"
      onClick={() => onClick(chatRoom)}
    >
      {/* 프로필 이미지 */}
      <div className="mr-4 h-12 w-12 flex-shrink-0 rounded-full bg-gray-300">
        {/* 프로필 이미지가 있으면 여기에 표시 */}
      </div>

      {/* 채팅방 정보 */}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="truncate text-sm font-medium text-gray-900">
            {chatRoom.userInfo?.name || `사용자 ${chatRoom.userId}`}
          </h3>
          <span className="text-xs text-gray-500">
            {/* 마지막 메시지 시간 표시 */}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className="truncate text-sm text-gray-600">
            {chatRoom.lastMessage || "메시지가 없습니다."}
          </p>

          {/* 읽지 않은 메시지 표시 */}
          {chatRoom.hasUnreadMessages && (
            <div className="ml-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
          )}
        </div>
      </div>
    </div>
  );
};

interface ChatRoomListProps {
  onChatRoomSelect?: (chatRoom: ChatRoomWithUser) => void;
  showEmptyState?: boolean;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({
  onChatRoomSelect,
  showEmptyState = true,
}) => {
  const navigate = useNavigate();
  const { chatRooms, isLoading, error } = useChatRooms();

  const handleChatRoomClick = (chatRoom: ChatRoomWithUser) => {
    onChatRoomSelect?.(chatRoom);
    navigate(`/chat/${chatRoom.chatRoomId}`, {
      state: { chatRoom },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">채팅방 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">오류: {error}</div>
      </div>
    );
  }

  if (chatRooms.length === 0 && showEmptyState) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          채팅방이 없습니다
        </h3>
        <p className="mb-4 text-gray-500">새로운 대화를 시작해보세요!</p>
        <button
          className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          onClick={() => navigate("/home")} // 홈으로 이동하여 새로운 채팅 시작
        >
          새로운 채팅 시작
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* 헤더 */}
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">채팅</h2>
        </div>
      </div>

      {/* 채팅방 목록 */}
      <div className="divide-y divide-gray-200">
        {chatRooms.map((chatRoom) => (
          <ChatRoomItem
            key={chatRoom.chatRoomId}
            chatRoom={chatRoom}
            onClick={handleChatRoomClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatRoomList;
