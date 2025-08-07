/*
 * author : 박은지
 * description : 채팅방 메시지 관리 훅
 */

import { useState, useEffect } from "react";
import { getChatMessages } from "../../api/chat";
import type { ChatMessage } from "../../api/chat";

export const useChatMessages = (chatRoomId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    if (!chatRoomId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await getChatMessages(chatRoomId);
      setMessages(response.success);
    } catch (err) {
      setError("메시지를 불러오는데 실패했습니다.");
      console.error("메시지 조회 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [chatRoomId]);

  return {
    messages,
    loading,
    error,
    refetch: fetchMessages,
  };
};
