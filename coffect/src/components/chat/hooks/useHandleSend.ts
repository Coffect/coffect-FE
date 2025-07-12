// author : 앨리스/박은지
// description : 메시지 전송 핸들러
// 메시지 전송 시 현재 시간 및 메시지 내용 추가

import type { Dispatch, SetStateAction } from "react";

interface Message {
  id: number;
  text: string;
  time: string;
  mine: boolean;
}

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
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        text: msg,
        time: getCurrentTime(),
        mine: true,
      },
    ]);
    setInputValue("");
  };
};

export default useHandleSend;
