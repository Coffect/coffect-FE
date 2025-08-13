/*
 * author : 박은지
 * description : 채팅방 목록 관리 커스텀 훅
 */

import { useState, useEffect, useCallback } from "react";
import { getChatRoomList } from "../../api/chat";
import type { ChatRoom } from "../../types/chat";

interface UseChatRoomsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useChatRooms = ({
  autoRefresh = false,
  refreshInterval = 30000, // 30초마다 자동 새로고침
}: UseChatRoomsOptions = {}) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 채팅방 목록 조회
  const loadChatRooms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getChatRoomList();
      setChatRooms(response.success);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { error?: { reason?: string } } };
      };
      const errorMessage =
        error.response?.data?.error?.reason ||
        "채팅방 목록 조회에 실패했습니다.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    loadChatRooms();
  }, [loadChatRooms]);

  // 자동 새로고침
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadChatRooms();
    }, refreshInterval);

    return () => {
      clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval, loadChatRooms]);

  // 채팅방 목록 정렬 (최근 메시지 순)
  const sortedChatRooms = [...chatRooms].sort((a, b) => {
    // 시간순 정렬 (최신 메시지가 위로)
    const timeA = new Date(a.lastMessageTime ?? 0).getTime();
    const timeB = new Date(b.lastMessageTime ?? 0).getTime();
    return timeB - timeA;
  });

  return {
    chatRooms: sortedChatRooms,
    isLoading,
    error,
    loadChatRooms,
  };
};
