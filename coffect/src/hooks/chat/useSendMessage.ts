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

        console.log("API 호출 시작 - sendMessage:", { chatRoomId, message });
        const response: SendMessageResponse = await sendMessage(
          chatRoomId,
          message,
        );
        console.log("API 응답:", response);
        onSuccess?.(response.success);
        return true; // 성공 시 true 반환
      } catch (err: unknown) {
        const error = err as {
          response?: {
            data?: { error?: { reason?: string } };
            status?: number;
            statusText?: string;
            headers?: Record<string, string>;
          };
        };

        console.error("서버 응답 상세:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          dataString: JSON.stringify(error.response?.data, null, 2),
          headers: error.response?.headers,
          fullError: err,
        });

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
