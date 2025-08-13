/*
 * author : 박은지
 * description : 메시지 전송 관리 커스텀 훅
 */

import { useState, useCallback } from "react";
import { sendMessage } from "../../api/chat";
import type { SendMessageResponse } from "../../types/chat";

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
      if (!chatRoomId || !message.trim()) {
        setError("메시지를 입력해주세요.");
        return false;
      }

      try {
        setSending(true);
        setError(null);

        const response: SendMessageResponse = await sendMessage(
          chatRoomId,
          message,
        );
        onSuccess?.(response.success);
        return true; // 성공 시 true 반환
      } catch (err: unknown) {
        const error = err as {
          response?: { data?: { error?: { reason?: string } } };
        };
        const errorMessage =
          error.response?.data?.error?.reason || "메시지 전송에 실패했습니다.";
        setError(errorMessage);
        onError?.(errorMessage);
        console.error("메시지 전송 오류:", err);
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
