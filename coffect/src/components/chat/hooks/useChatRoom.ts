/*
<<<<<<< HEAD
 * description : 채팅방 훅 (API 연동)
 */

import { useState, useEffect, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import useCurrentTime from "./useCurrentTime";
import useHandleSend from "./useHandleSend";
import { useSendMessage } from "../../../hooks/chat";
import { getChatMessages } from "../../../api/chat";
import type { Message, ChatMessage } from "../../../types/chat";
=======
 * description : 채팅방 훅 (임시 데이터)
 */

import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useCurrentTime from "./useCurrentTime";
import useHandleSend from "./useHandleSend";
import type { Message } from "../../../types/chat";
>>>>>>> e7d72dc2eef7a259af3bb14cb4fd1d94cac50a82

interface Schedule {
  date: string | Date;
  time: string;
  place?: string;
  alert?: string | null;
}

<<<<<<< HEAD
// 메시지 조회를 위한 간단한 훅
const useChatMessages = (chatRoomId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!chatRoomId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await getChatMessages(chatRoomId);
      setMessages(response.success || []);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { error?: { reason?: string } } };
      };
      const errorMessage =
        error.response?.data?.error?.reason ||
        "메시지를 불러오는데 실패했습니다.";
      setError(errorMessage);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [chatRoomId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    loading,
    error,
    refetch: fetchMessages,
  };
};

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
  const { sending: sendLoading, error: sendError } = useSendMessage(
    chatRoomId || "",
  );

=======
interface User {
  id: string;
  username: string;
  info: string;
  interests: string[];
}

export const useChatRoom = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const getCurrentTime = useCurrentTime();

>>>>>>> e7d72dc2eef7a259af3bb14cb4fd1d94cac50a82
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

<<<<<<< HEAD
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

  const handleSend = useHandleSend({
    chatRoomId: chatRoomId || "",
=======
  // 메시지 배열
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "text",
      text: "안녕하세요!",
      time: "오전 11:47",
      mine: false,
    },
    {
      id: 2,
      type: "text",
      text: "꼭 한번 커피챗 해보고 싶어서 제안\n드렸습니다 :)",
      time: "오전 11:47",
      mine: false,
    },
    {
      id: 3,
      type: "text",
      text: "안녕하세요!",
      time: "오전 11:47",
      mine: true,
    },
    {
      id: 4,
      type: "text",
      text: "네 좋아요!\n이번주에 시간 언제 가능하세요?",
      time: "오전 11:47",
      mine: true,
    },
    {
      id: 5,
      type: "text",
      text: "목요일 두시 공강이신걸로 아는데\n그때 어떠세요??",
      time: "오전 11:48",
      mine: false,
    },
    {
      id: 6,
      type: "text",
      text: "좋습니다!\n정문 앞 스벅에서 만나요!!",
      time: "오전 11:49",
      mine: true,
    },
    {
      id: 7,
      type: "text",
      text: "네 그럼 거기서 2시에 봅시다!",
      time: "오전 11:49",
      mine: false,
    },
  ]);

  const [inputValue, setInputValue] = useState("");

  const handleSend = useHandleSend(
>>>>>>> e7d72dc2eef7a259af3bb14cb4fd1d94cac50a82
    messages,
    setMessages,
    setInputValue,
    getCurrentTime,
<<<<<<< HEAD
    onError: (error) => {
      console.error("메시지 전송 오류:", error);
    },
    onSuccess: () => {
      // 메시지 전송 성공 후 목록 새로고침
      refetch();
    },
  });
=======
  );
>>>>>>> e7d72dc2eef7a259af3bb14cb4fd1d94cac50a82

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

<<<<<<< HEAD
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
=======
  const user: User = {
    id: id || "coffect",
    username: "김라떼",
    info: "이런 주제에 관심 있어요!",
    interests: ["디자인", "개발", "경영", "글쓰기"],
  };
>>>>>>> e7d72dc2eef7a259af3bb14cb4fd1d94cac50a82

  return {
    messages,
    inputValue,
    setInputValue,
    schedule,
<<<<<<< HEAD
    loading,
    error,
    refetch,
    handleSend,
    sendLoading,
    sendError,
=======
    user,
    handleSend,
>>>>>>> e7d72dc2eef7a259af3bb14cb4fd1d94cac50a82
    handleImageSend,
  };
};
