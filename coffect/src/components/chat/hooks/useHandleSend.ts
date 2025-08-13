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
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  setInputValue: (value: string) => void;
  getCurrentTime: () => string;
  onError?: (error: string) => void;
  onSuccess?: () => void; // 메시지 전송 성공 시 콜백
}

const useHandleSend = ({
  chatRoomId,
  setMessages,
  setInputValue,
  getCurrentTime,
  onError,
  onSuccess,
}: UseHandleSendProps) => {
  const { sendMessage, sending, error } = useSendMessage(chatRoomId, {
    onSuccess: undefined, // handleSend 내부에서 처리
    onError: (errorMessage: string) => {
      onError?.(errorMessage);
    },
  });

  const handleSend = useCallback(
    async (msg: string) => {
      console.log("handleSend 호출됨:", { msg, chatRoomId });

      if (!msg.trim() || !chatRoomId || chatRoomId === "") {
        console.error("유효하지 않은 chatRoomId:", chatRoomId);
        return;
      }

      const tempId = Date.now();
      // 먼저 로컬에 메시지 추가 (낙관적 업데이트)
      const tempMessage: Message = {
        id: tempId, // 임시 ID
        type: "text",
        text: msg,
        time: getCurrentTime(),
        mine: true,
      };

      console.log("낙관적 업데이트 - 메시지 추가:", tempMessage);
      setMessages((prevMessages: Message[]) => [...prevMessages, tempMessage]);
      setInputValue("");

      // API로 메시지 전송
      console.log("API 호출 시작...");
      const success = await sendMessage(msg);
      console.log("API 호출 결과:", success);

      if (success) {
        // 성공 시 콜백 실행
        console.log("메시지 전송 성공");
        onSuccess?.();
      } else {
        // 실패 시 로컬 메시지 제거
        console.log("메시지 전송 실패 - 롤백");
        setMessages((prevMessages: Message[]) =>
          prevMessages.filter((m: Message) => m.id !== tempId),
        );
        setInputValue(msg); // 입력값 복원
      }
    },
    [
      setMessages,
      setInputValue,
      getCurrentTime,
      sendMessage,
      onSuccess,
      chatRoomId,
    ],
  );

  return {
    handleSend,
    sending,
    error,
  };
};

export default useHandleSend;
