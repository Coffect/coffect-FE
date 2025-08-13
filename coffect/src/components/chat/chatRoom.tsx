/*
 * author : 앨리스/박은지
 * description : 채팅방 페이지
 * 채팅방 내부 메시지 영역, 팝업 모달 연결, 일정 정보 표시
 */

import { useMemo, useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import usePreventZoom from "./hooks/usePreventZoom";
import useModal from "./hooks/useModal";
import RequestModal from "./RequestModal";
import ChatInputBox from "./ChatInputBox";
import ChatHeader from "./ChatHeader";
import ChatInterestsSection from "./ChatInterestsSection";
import ChatMessageArea from "./ChatMessageArea";
import { useChatUser } from "./hooks/useChatUser";
import useHandleSend from "./hooks/useHandleSend";
import useAutoScroll from "./hooks/useAutoScroll";
import useCurrentTime from "./hooks/useCurrentTime";
import { socketManager } from "../../api/chat";
import { getChatMessages } from "../../api/chat";
import type { Schedule } from "./hooks/useSchedule";
import type { Message, SocketMessage } from "../../types/chat";

const ChatRoom = () => {
  usePreventZoom();
  const location = useLocation();
  const { chatRoomId } = useParams<{ chatRoomId: string }>();

  const {
    isOpen: isModalOpen,
    open: openModal,
    close: closeModal,
  } = useModal();

  // 일정 정보 (전달받은 일정이 있으면 표시)
  const schedule = useMemo<Schedule | null>(() => {
    const s = location.state?.schedule;
    if (!s) return null;
    return {
      date: s.date,
      time: s.time,
      place: s.place ?? "",
      alert: s.alert ?? null,
    };
  }, [location.state?.schedule]);

  // 메시지 배열 (실제 소켓 통신용)
  const [messages, setMessages] = useState<Message[]>([]);

  const [inputValue, setInputValue] = useState("");
  const getCurrentTime = useCurrentTime();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const createdObjectUrlsRef = useRef<string[]>([]);
  useAutoScroll(messagesEndRef, [messages]);

  useEffect(() => {
    const urls = createdObjectUrlsRef.current;
    return () => {
      urls.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // URL이 이미 해제되었거나 유효하지 않은 경우 무시
        }
      });
    };
  }, []);

  const { handleSend } = useHandleSend({
    chatRoomId: chatRoomId || "temp-room-id",
    messages,
    setMessages,
    setInputValue,
    getCurrentTime,
    onError: (error) => {
      console.error("메시지 전송 오류:", error);
    },
  });

  const handleImageSend = (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;

    const url = URL.createObjectURL(file);
    createdObjectUrlsRef.current.push(url);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "image",
        imageUrl: url,
        mine: true,
        time: getCurrentTime(),
      },
    ]);
  };

  const user = useChatUser();

  // 채팅방 입장 및 메시지 로딩
  useEffect(() => {
    if (!chatRoomId) return;

    // 소켓 연결 확인 및 채팅방 입장
    if (socketManager.isSocketConnected()) {
      socketManager.joinRoom(chatRoomId, user.id);
    } else {
      // 소켓이 연결되지 않은 경우 연결 후 입장
      socketManager.connect();
      setTimeout(() => {
        socketManager.joinRoom(chatRoomId, user.id);
      }, 1000);
    }

    // 기존 메시지 로딩
    const loadMessages = async () => {
      try {
        const response = await getChatMessages(chatRoomId);
        if (response.success) {
          // ChatMessage를 Message 타입으로 변환
          const convertedMessages: Message[] = response.success.map((msg) => ({
            id: parseInt(msg.id),
            type: msg.isPhoto ? "image" : "text",
            text: msg.isPhoto ? "" : msg.messageBody,
            imageUrl: msg.isPhoto ? msg.messageBody : "",
            time: new Date(msg.createdAt).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            mine: msg.userId === user.id,
          }));
          setMessages(convertedMessages);
        }
      } catch (error) {
        console.error("메시지 로딩 오류:", error);
      }
    };

    loadMessages();

    // 메시지 수신 리스너 설정
    const handleReceiveMessage = (message: SocketMessage) => {
      if (message.chatRoomId === chatRoomId) {
        setMessages((prev) => [
          ...prev,
          {
            id: parseInt(message.id),
            type: message.isPhoto ? "image" : "text",
            text: message.isPhoto ? "" : message.messageBody,
            imageUrl: message.isPhoto ? message.messageBody : "",
            time: new Date(message.createdAt).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            mine: message.userId === user.id,
          },
        ]);
      }
    };

    socketManager.onReceiveMessage(handleReceiveMessage);

    // 컴포넌트 언마운트 시 채팅방 퇴장
    return () => {
      socketManager.leaveRoom(chatRoomId, user.id);
      socketManager.off("receive_message");
    };
  }, [chatRoomId, user.id, getCurrentTime]);

  return (
    <div className="flex h-full w-full flex-col bg-[var(--white)]">
      {/* Header */}
      <ChatHeader username={user.username} userId={user.id.toString()} />

      {/* 관심 주제 & 버튼 */}
      <ChatInterestsSection
        interests={user.interests}
        schedule={schedule}
        onOpenModal={openModal}
      />

      {/* 팝업 모달 */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={closeModal}
        username={user.username}
      />

      {/* 메시지 영역 */}
      <ChatMessageArea messages={messages} />

      {/* 입력창 */}
      <ChatInputBox
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSend={handleSend}
        onImageSend={handleImageSend}
      />
    </div>
  );
};

export default ChatRoom;
