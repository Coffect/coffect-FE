/*
 * description : 채팅방 훅 (API 연동)
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import useCurrentTime from "./useCurrentTime";
import useHandleSend from "./useHandleSend";
import { useSendMessage } from "../../../hooks/chat";
import { getChatMessages } from "../../../api/chat";
import type { Message, ChatMessage } from "../../../types/chat";

interface Schedule {
  date: string | Date;
  time: string;
  place?: string;
  alert?: string | null;
}

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

  // 현재 사용자 정보 가져오기
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const { getProfile } = await import("../../../api/profile");
        const response = await getProfile();
        if (response.success) {
          setCurrentUserId(response.success.userInfo.userId);
        }
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
      }
    };
    fetchUserId();
  }, []);

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
          mine: currentUserId ? msg.userId === currentUserId : false,
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
  }, [apiMessages, currentUserId]);

  const [inputValue, setInputValue] = useState("");

  // 생성된 Object URL 추적
  const createdUrlsRef = useRef<Set<string>>(new Set());

  const handleSend = useHandleSend({
    chatRoomId: chatRoomId || "",
    messages,
    setMessages,
    setInputValue,
    getCurrentTime,
    onError: (error) => {
      console.error("메시지 전송 오류:", error);
    },
    onSuccess: () => {
      // 메시지 전송 성공 후 목록 새로고침
      refetch();
    },
  });

  const handleImageSend = (file: File) => {
    const url = URL.createObjectURL(file);
    createdUrlsRef.current.add(url);
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

  // 언마운트 시 생성된 모든 URL 정리
  useEffect(() => {
    const urls = createdUrlsRef.current;
    return () => {
      // 언마운트 시 생성된 모든 URL 정리
      urls.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // 이미 해제된 URL 무시
        }
      });
    };
  }, []);

  return {
    messages,
    inputValue,
    setInputValue,
    schedule,
    loading,
    error,
    refetch,
    handleSend,
    sendLoading,
    sendError,
    handleImageSend,
  };
};
