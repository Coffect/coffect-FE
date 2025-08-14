/*
 * author : 앨리스/박은지
 * description : 메시지 전송 핸들러
 * 메시지 전송 시 소켓을 통한 전송
 */
import { useCallback } from "react";
import { useSendMessage } from "../../../hooks/chat";

interface UseHandleSendProps {
  chatRoomId: string;
  setInputValue: (value: string) => void;
  onError?: (error: string) => void;
  onSuccess?: () => void; // 메시지 전송 성공 시 콜백
}

const useHandleSend = ({
  chatRoomId,
  setInputValue,
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
      if (!msg.trim() || !chatRoomId || chatRoomId === "") {
        if (import.meta.env.MODE === "development") {
          console.error("유효하지 않은 chatRoomId:", chatRoomId);
        }
        return;
      }

      // 입력값 초기화
      setInputValue("");

      // 소켓을 통한 메시지 전송 (서버에서 receive 이벤트로 받아서 UI 업데이트)
      const success = await sendMessage(msg);

      if (success) {
        // 성공 시 콜백 실행
        onSuccess?.();
      } else {
        // 실패 시 입력값 복원
        setInputValue(msg);
      }
    },
    [setInputValue, sendMessage, onSuccess, chatRoomId],
  );

  return {
    handleSend,
    sending,
    error,
  };
};

export default useHandleSend;
