/*
 * author : 앨리스/박은지
 * description : 채팅방 페이지
 * 채팅방 내부 메시지 영역, 팝업 모달 연결, 일정 정보 표시
 */

import { useMemo, useState, useRef, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import usePreventZoom from "./hooks/usePreventZoom";
import useModal from "./hooks/useModal";
import RequestModal from "./RequestModal";
import ChatInputBox from "./ChatInputBox";
import ChatHeader from "./ChatHeader";
import ChatInterestsSection from "./ChatInterestsSection";
import ChatMessageArea from "./ChatMessageArea";
import LoadingScreen from "../shareComponents/LoadingScreen";
import { useChatUser } from "./hooks/useChatUser";
import { useChatRooms } from "../../hooks/chat/useChatRooms";
import useHandleSend from "./hooks/useHandleSend";
import useAutoScroll from "./hooks/useAutoScroll";
import useCurrentTime from "./hooks/useCurrentTime";
import { getChatMessages } from "../../api/chat";
import type { Schedule } from "./hooks/useSchedule";
import type { Message } from "../../types/chat";

const ChatRoom = () => {
  usePreventZoom();
  const location = useLocation();
  const navigate = useNavigate();
  const { chatRoomId } = useParams<{ chatRoomId: string }>();
  const [isProfileLoading, setIsProfileLoading] = useState(false);

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

  // 채팅방 목록에서 현재 채팅방 정보 가져오기
  const { chatRooms, isLoading: chatRoomsLoading } = useChatRooms();
  const currentChatRoom = useMemo(() => {
    const foundRoom = chatRooms.find((room) => room.chatRoomId === chatRoomId);
    return foundRoom;
  }, [chatRooms, chatRoomId]);

  // 메시지 배열 (실제 소켓 통신용)
  const [messages, setMessages] = useState<Message[]>([]);

  const [inputValue, setInputValue] = useState("");
  const [showInterests, setShowInterests] = useState(true);
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
    chatRoomId: chatRoomId || "",
    messages,
    setMessages,
    setInputValue,
    getCurrentTime,
    onError: (error) => {
      console.error("메시지 전송 오류:", error);
    },
  });

  const handleImageSend = async (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;

    if (!chatRoomId) {
      console.error("채팅방 ID가 없습니다");
      return;
    }

    const url = URL.createObjectURL(file);
    createdObjectUrlsRef.current.push(url);

    // 낙관적 업데이트
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

    try {
      // 서버로 이미지 전송
      const { sendPhoto } = await import("../../api/chat");
      await sendPhoto(chatRoomId, file);
      // 메시지 목록 새로고침
      loadMessages();
    } catch (error) {
      console.error("이미지 전송 실패:", error);
      // 실패 시 낙관적 업데이트 롤백
      setMessages((prev) =>
        prev.filter(
          (msg) =>
            msg.type !== "image" ||
            (msg.type === "image" && msg.imageUrl !== url),
        ),
      );
      URL.revokeObjectURL(url);
    }
  };

  const handleToggleInterests = () => {
    setShowInterests((prev) => !prev);
  };

  const handleProfileClick = () => {
    setIsProfileLoading(true);
    setTimeout(() => {
      navigate(`/userpage/${currentChatRoom?.userId || "0"}`);
      setIsProfileLoading(false); // Reset after navigation
    }, 500);
  };

  const user = useChatUser();

  // 기존 메시지 로딩 함수
  const loadMessages = async () => {
    if (!chatRoomId) return;

    try {
      const response = await getChatMessages(chatRoomId);
      if (response.success) {
        // ChatMessage를 Message 타입으로 변환
        const convertedMessages: Message[] = response.success
          .map((msg) => {
            const id =
              typeof msg.id === "string" ? parseInt(msg.id, 10) : msg.id;
            if (isNaN(id)) {
              console.error("Invalid message id:", msg.id);
              return null;
            }

            if (msg.isPhoto) {
              return {
                id,
                type: "image" as const,
                imageUrl: msg.messageBody,
                time: new Date(msg.createdAt).toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }),
                mine: msg.userId === user.id,
              };
            } else {
              return {
                id,
                type: "text" as const,
                text: msg.messageBody,
                time: new Date(msg.createdAt).toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }),
                mine: msg.userId === user.id,
              };
            }
          })
          .filter(Boolean) as Message[];

        setMessages(convertedMessages);
      }
    } catch (error) {
      console.error("메시지 로딩 오류:", error);
    }
  };

  // 채팅방 입장 및 메시지 로딩
  useEffect(() => {
    loadMessages();
  }, [chatRoomId, user.id]);

  // 전체 로딩 상태 (채팅방 목록 로딩 + 프로필 클릭 로딩)
  const overallLoading = chatRoomsLoading || isProfileLoading;

  // 전체 로딩 중일 때 LoadingScreen 표시
  if (overallLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-full w-full flex-col bg-[var(--white)]">
      {/* Header */}
      <ChatHeader
        username={currentChatRoom?.userInfo?.name || "상대방"}
        profileImage={currentChatRoom?.userInfo?.profileImage}
        onProfileClick={handleProfileClick}
      />

      {/* 관심 주제 & 버튼 */}
      <ChatInterestsSection
        interests={user.interests}
        schedule={schedule}
        onOpenModal={openModal}
        showInterests={showInterests}
        onToggleInterests={handleToggleInterests}
        chatRoomId={chatRoomId}
      />

      {/* 팝업 모달 */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={closeModal}
        username={user.username}
      />

      {/* 메시지 영역 */}
      <ChatMessageArea
        messages={messages}
        username={currentChatRoom?.userInfo?.name || "상대방"}
      />

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
