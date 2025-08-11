/*
 * author : 앨리스/박은지
 * description : 메시지 전송 핸들러
 * 메시지 전송 시 현재 시간 및 메시지 내용 추가
 */

import type { Dispatch, SetStateAction } from "react";
import type { Message } from "../../../types/chat";

type UseHandleSend = (
  messages: Message[],
  setMessages: Dispatch<SetStateAction<Message[]>>,
  setInputValue: Dispatch<SetStateAction<string>>,
  getCurrentTime: () => string,
) => (msg: string) => void;

const useHandleSend: UseHandleSend = (
  messages,
  setMessages,
  setInputValue,
  getCurrentTime,
) => {
  return (msg: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: messages.length + 1,
        type: "text",
        text: msg,
        time: getCurrentTime(),
        mine: true,
      },
    ]);
    setInputValue("");
  };
};

export default useHandleSend;
