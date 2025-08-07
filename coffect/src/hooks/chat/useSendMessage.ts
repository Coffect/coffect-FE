/*
 * author : 박은지
 * description : 메시지 전송 관리 훅
 */

import { useState } from "react";
import { sendMessage } from "../../api/chat";

export const useSendMessage = (chatRoomId: string) => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessageHandler = async (message: string) => {
    if (!chatRoomId || !message.trim()) return;
    
    try {
      setSending(true);
      setError(null);
      await sendMessage(chatRoomId, message);
      return true; // 성공 시 true 반환
    } catch (err) {
      setError("메시지 전송에 실패했습니다.");
      console.error("메시지 전송 오류:", err);
      return false; // 실패 시 false 반환
    } finally {
      setSending(false);
    }
  };

  return {
    sendMessage: sendMessageHandler,
    sending,
    error,
  };
};
