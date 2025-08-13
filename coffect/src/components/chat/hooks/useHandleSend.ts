/*
 * author : 앨리스/박은지
 * description : 메시지 전송 핸들러
 * 메시지 전송 시 API 호출 및 로컬 상태 업데이트
 */
import { useCallback } from "react";
import { useSendMessage } from "../../../hooks/chat";
import type { Message } from "../../../types/chat";

interface UseHandleSendProps {
  chatRoomId: string;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  setInputValue: (value: string) => void;
  getCurrentTime: () => string;
  onError?: (error: string) => void;
  onSuccess?: () => void; // 메시지 전송 성공 시 콜백
}

const useHandleSend = ({
  chatRoomId,
  messages,
  setMessages,
  setInputValue,
  getCurrentTime,
  onError,
  onSuccess,
}: UseHandleSendProps) => {
  const { sendMessage, sending, error } = useSendMessage(chatRoomId, {
    onSuccess: (messageId: string) => {
      // API 성공 시 서버에서 반환된 messageId로 메시지 ID 업데이트
      const updatedMessages = messages.map((msg: Message) =>
        msg.id === Date.now() ? { ...msg, id: parseInt(messageId) } : msg,
      );
      setMessages(updatedMessages);
    },
    onError: (errorMessage: string) => {
      onError?.(errorMessage);
    },
  });

  const handleSend = useCallback(
    async (msg: string) => {
      if (!msg.trim()) return;

      // 먼저 로컬에 메시지 추가 (낙관적 업데이트)
      const tempMessage: Message = {
        id: Date.now(), // 임시 ID
        type: "text",
        text: msg,
        time: getCurrentTime(),
        mine: true,
      };

      setMessages([...messages, tempMessage]);
      setInputValue("");

      // API로 메시지 전송
      const success = await sendMessage(msg);

      if (success) {
        // 성공 시 콜백 실행
        onSuccess?.();
      } else {
        // 실패 시 로컬 메시지 제거
        setMessages(messages.filter((m) => m.id !== tempMessage.id));
        setInputValue(msg); // 입력값 복원
      }
    },
    [
      messages,
      setMessages,
      setInputValue,
      getCurrentTime,
      sendMessage,
      onSuccess,
    ],
  );

  return {
    handleSend,
    sending,
    error,
  };
};

export default useHandleSend;
