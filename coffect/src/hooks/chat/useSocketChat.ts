/*
 * author : 박은지
 * description : Socket.IO 실시간 채팅 훅
 */

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { ChatMessage } from "../../api/chat";

interface UseSocketChatProps {
  chatRoomId: string;
  onNewMessage: (message: ChatMessage) => void;
  onMessageRead: (messageId: string) => void;
  onUserTyping: (userId: number, isTyping: boolean) => void;
}

export const useSocketChat = ({
  chatRoomId,
  onNewMessage,
  onMessageRead,
  onUserTyping,
}: UseSocketChatProps) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Socket.IO 연결
    socketRef.current = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:3001",
      {
        query: { chatRoomId },
      },
    );

    const socket = socketRef.current;

    // 채팅방 입장
    socket.emit("join-room", { chatRoomId });

    // 새 메시지 수신
    socket.on("new-message", (message: ChatMessage) => {
      onNewMessage(message);
    });

    // 메시지 읽음 상태 업데이트
    socket.on("message-read", ({ messageId }: { messageId: string }) => {
      onMessageRead(messageId);
    });

    // 사용자 타이핑 상태
    socket.on(
      "user-typing",
      ({ userId, isTyping }: { userId: number; isTyping: boolean }) => {
        onUserTyping(userId, isTyping);
      },
    );

    // 연결 해제
    return () => {
      socket.disconnect();
    };
  }, [chatRoomId, onNewMessage, onMessageRead, onUserTyping]);

  // 메시지 전송
  const sendMessage = (message: string) => {
    if (socketRef.current) {
      socketRef.current.emit("send-message", {
        chatRoomId,
        message,
      });
    }
  };

  // 타이핑 상태 전송
  const sendTypingStatus = (isTyping: boolean) => {
    if (socketRef.current) {
      socketRef.current.emit("typing", {
        chatRoomId,
        isTyping,
      });
    }
  };

  // 메시지 읽음 상태 전송
  const sendReadStatus = (messageId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("read-message", {
        chatRoomId,
        messageId,
      });
    }
  };

  return {
    sendMessage,
    sendTypingStatus,
    sendReadStatus,
  };
};
