/*
 * author : 박은지
 * description : 채팅방 목록 관리 훅
 */

import { useState, useEffect } from "react";
import { getChatRoomList } from "../../api/chat";
import type { ChatRoom } from "../../api/chat";

export const useChatRoomList = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChatRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getChatRoomList();
      setChatRooms(response.success);
    } catch (err) {
      setError("채팅방 목록을 불러오는데 실패했습니다.");
      console.error("채팅방 목록 조회 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  return {
    chatRooms,
    loading,
    error,
    refetch: fetchChatRooms,
  };
};
