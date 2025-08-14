/*
 * author : 박은지
 * description : 메시지 전송 관리 커스텀 훅
 */

import { useState, useCallback } from "react";
import { sendMessage } from "../../api/chat";

interface UseSendMessageOptions {
  onSuccess?: (messageId: string) => void;
  onError?: (error: string) => void;
}

export const useSendMessage = (
  chatRoomId: string,
  options: UseSendMessageOptions = {},
) => {
  const { onSuccess, onError } = options;
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessageHandler = useCallback(
    async (message: string) => {
      console.log("sendMessageHandler 호출됨:", { chatRoomId, message });

      if (!chatRoomId || chatRoomId === "" || !message.trim()) {
        const errorMsg =
          !chatRoomId || chatRoomId === ""
            ? "채팅방 ID가 유효하지 않습니다."
            : "메시지를 입력해주세요.";
        setError(errorMsg);
        console.error("sendMessage 호출 실패:", { chatRoomId, message });
        return false;
      }

      try {
        setSending(true);
        setError(null);

        // 소켓을 통한 메시지 전송
        sendMessage(chatRoomId, message);

        onSuccess?.("success");
        return true; // 성공 시 true 반환
      } catch (err: unknown) {
        console.error("메시지 전송 오류:", err);
        const errorMessage = "메시지 전송에 실패했습니다.";
        setError(errorMessage);
        onError?.(errorMessage);
        return false; // 실패 시 false 반환
      } finally {
        setSending(false);
      }
    },
    [chatRoomId, onSuccess, onError],
  );

  return {
    sendMessage: sendMessageHandler,
    sending,
    error,
    clearError: () => setError(null),
  };
};
