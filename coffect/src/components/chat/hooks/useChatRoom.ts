/*
 * description : 채팅방 훅 (API 연동)
 */

import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import useCurrentTime from "./useCurrentTime";
import useHandleSend from "./useHandleSend";
import { useChatMessages, useSendMessage } from "../../../hooks/chat";
import type { Message } from "../../../types/chat";

interface Schedule {
  date: string | Date;
  time: string;
  place?: string;
  alert?: string | null;
}

export const useChatRoom = () => {
  const location = useLocation();
  const { id: chatRoomId } = useParams<{ id: string }>();
  const getCurrentTime = useCurrentTime();

  // API로 메시지 조회
  const {
    messages: apiMessages,
    loading,
    error,
    refetch,
  } = useChatMessages(chatRoomId || "");

  // 메시지 전송 훅
  const { sendMessage, sending: sendLoading, error: sendError } = useSendMessage(chatRoomId || "");

  // 일정 정보 (전달받은 일정이 있으면 표시)
  const [schedule] = useState<Schedule | null>(() => {
    if (location.state?.schedule) {
      return {
        date: location.state.schedule.date,
        time: location.state.schedule.time,
        place: location.state.schedule.place || "",
        alert: location.state.schedule.alert || null,
      };
    }
    return null;
  });

  // API 메시지를 내부 Message 타입으로 변환
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (apiMessages.length > 0) {
      const convertedMessages: Message[] = apiMessages.map((msg) => {
        const baseMessage = {
          id: parseInt(msg.id),
          time: new Date(msg.createdAt).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          mine: msg.userId === 1, // 임시로 userId가 1이면 내 메시지로 처리
        };

        if (msg.isPhoto) {
          return {
            ...baseMessage,
            type: "image" as const,
            imageUrl: msg.messageBody, // 이미지 URL로 사용
          };
        } else {
          return {
            ...baseMessage,
            type: "text" as const,
            text: msg.messageBody,
          };
        }
      });
      setMessages(convertedMessages);
    }
  }, [apiMessages]);

  const [inputValue, setInputValue] = useState("");

  // API를 사용한 메시지 전송 핸들러
  const handleSendMessage = async (message: string) => {
    const success = await sendMessage(message);
    if (success) {
      setInputValue("");
      // 메시지 전송 성공 후 목록 새로고침
      refetch();
    }
  };

  const handleSend = useHandleSend(
    messages,
    setMessages,
    setInputValue,
    getCurrentTime,
  );

  const handleImageSend = (file: File) => {
    const url = URL.createObjectURL(file);
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: "image",
        imageUrl: url,
        mine: true,
        time: getCurrentTime(),
      },
    ]);
  };

  // 컴포넌트 언마운트 시 모든 이미지 URL 정리
  useEffect(() => {
    return () => {
      messages.forEach((message) => {
        if (message.type === "image" && message.imageUrl) {
          URL.revokeObjectURL(message.imageUrl);
        }
      });
    };
  }, [messages]);

  return {
    messages,
    inputValue,
    setInputValue,
    schedule,
    loading,
    error,
    refetch,
    handleSend,
    handleSendMessage, // API 전송 핸들러 추가
    sendLoading,
    sendError,
    handleImageSend,
  };
};
