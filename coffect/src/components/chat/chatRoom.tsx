/*
 * author : 앨리스/박은지
 * description : 채팅방 페이지
 * 채팅방 내부 메시지 영역, 팝업 모달 연결, 일정 정보 표시
 */

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import useCurrentTime from "./hooks/useCurrentTime";
import { getChatMessages } from "../../api/chat";
import { useTimeTableComparison } from "../../hooks/useTimeTable";
import { axiosInstance } from "../../api/axiosInstance";
import type { Schedule } from "./hooks/useSchedule";
import type { Message } from "../../types/chat";

const ChatRoom = () => {
  usePreventZoom();
  const location = useLocation();
  const navigate = useNavigate();

  const chatRoomId = (() => {
    // /chat/{chatRoomId} 형태에서 chatRoomId 추출
    const pathParts = location.pathname.split("/");
    if (pathParts.length >= 3 && pathParts[1] === "chat") {
      // /schedule이 포함된 경우 제거
      const chatRoomIdParts = pathParts.slice(2);
      const scheduleIndex = chatRoomIdParts.indexOf("schedule");
      if (scheduleIndex !== -1) {
        return chatRoomIdParts.slice(0, scheduleIndex).join("/");
      }
      return chatRoomIdParts.join("/");
    }
    return "";
  })();
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
    const foundRoom = chatRooms.find((room) => room.chatroomId === chatRoomId);
    return foundRoom;
  }, [chatRooms, chatRoomId]);

  // 메시지 배열 (실제 소켓 통신용)
  const [messages, setMessages] = useState<Message[]>([]);

  const [inputValue, setInputValue] = useState("");
  const [showInterests, setShowInterests] = useState(true);
  const getCurrentTime = useCurrentTime();
  const createdObjectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      createdObjectUrlsRef.current.forEach((url) => {
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
    setMessages,
    setInputValue,
    getCurrentTime,
    onError: (error) => {
      console.error("메시지 전송 오류:", error);
    },
  });

  const handleImageSend = async (file: File) => {
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    if (!chatRoomId) {
      console.error("채팅방 ID가 없습니다");
      return;
    }

    const url = URL.createObjectURL(file);
    createdObjectUrlsRef.current.push(url);

    // 낙관적 업데이트
    const tempId = Date.now();
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        type: "image",
        imageUrl: url,
        mine: true,
        time: getCurrentTime(),
      },
    ]);

    try {
      // 서버로 이미지 전송
      const { sendPhoto } = await import("../../api/chat");
      const response = await sendPhoto(chatRoomId, file);

      // 성공 시 임시 메시지를 실제 서버 응답으로 교체
      if (response.success) {
        const messageId =
          typeof response.success.id === "string"
            ? parseInt(response.success.id, 10)
            : response.success.id;

        if (isNaN(messageId)) {
          console.error("Invalid message id:", response.success.id);
          throw new Error("Invalid message id received from server");
        }

        const createdAt = new Date(response.success.createdAt);
        if (isNaN(createdAt.getTime())) {
          console.error("Invalid date:", response.success.createdAt);
          throw new Error("Invalid date received from server");
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId
              ? {
                  id: messageId,
                  type: "image" as const,
                  imageUrl: response.success.messageBody,
                  mine: true,
                  time: createdAt.toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }),
                }
              : msg,
          ),
        );

        // 임시 객체 URL 정리 및 목록에서 제거
        URL.revokeObjectURL(url);
        createdObjectUrlsRef.current = createdObjectUrlsRef.current.filter(
          (u) => u !== url,
        );
      }
    } catch (error) {
      console.error("이미지 전송 실패:", error);
      // 실패 시 낙관적 업데이트 롤백
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      URL.revokeObjectURL(url);
    }
  };

  const handleToggleInterests = () => {
    setShowInterests((prev) => !prev);
  };

  const handleProfileClick = () => {
    if (!id) {
      console.error("상대방 ID를 찾을 수 없습니다");
      return;
    }
    setIsProfileLoading(true);
    // string ID로 네비게이션
    navigate(`/userpage/${id}`);
    // 로딩 상태는 언마운트 시 자동으로 정리됨
  };

  const { user, loading: userLoading } = useChatUser();

  // 시간표 비교 훅 사용 (수동 호출)
  const { commonFreeTime, fetchAndCompare: fetchTimeTables } =
    useTimeTableComparison(user.id, currentChatRoom?.userId || 0);

  // 상대 요청 보기 모달 열기 함수
  const handleOpenRequestModal = async () => {
    try {
      // 시간표를 먼저 불러옴
      await fetchTimeTables();
    } catch (error) {
      console.error("데이터 로딩 중 오류 발생:", error);
      // API 호출이 실패해도 모달은 열어줌
    }

    // 모달 열기
    openModal();
  };

  // 상대방의 string ID 가져오기
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    // 채팅방 변경 시 이전 상대방 ID 초기화
    setId(null);

    const abortController = new AbortController();

    const fetchOpponentId = async () => {
      if (!currentChatRoom?.userId) return;

      try {
        const response = await axiosInstance.post(
          "/profile/id",
          {
            userId: currentChatRoom.userId,
          },
          {
            signal: abortController.signal,
          },
        );

        if (
          response.data.resultType === "SUCCESS" &&
          response.data.success?.id
        ) {
          setId(response.data.success.id);
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("상대방 ID 조회 실패:", err);
        }
      }
    };

    fetchOpponentId();

    return () => {
      abortController.abort();
    };
  }, [currentChatRoom?.userId]);

  // 기존 메시지 로딩 함수
  const loadMessages = useCallback(async () => {
    if (!chatRoomId) return;

    try {
      const response = await getChatMessages(chatRoomId);
      if (response.success) {
        // ChatMessage를 Message 타입으로 변환하고 정렬
        const messagesWithDate = response.success
          .map((msg) => {
            const id = parseInt(msg.id, 10);
            if (isNaN(id)) {
              console.error("Invalid message id:", msg.id);
              return null;
            }

            const createdAt = new Date(msg.createdAt);
            const timeString = createdAt.toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });

            if (msg.isPhoto) {
              return {
                id,
                type: "image" as const,
                imageUrl: msg.messageBody,
                time: timeString,
                mine: msg.userId === user.id,
                createdAt, // 정렬용 임시 속성
              };
            } else {
              return {
                id,
                type: "text" as const,
                text: msg.messageBody,
                time: timeString,
                mine: msg.userId === user.id,
                createdAt, // 정렬용 임시 속성
              };
            }
          })
          .filter(Boolean);

        // 시간 순서대로 정렬 (오래된 메시지부터 최신 메시지 순)
        const sortedMessages = messagesWithDate
          .filter((msg): msg is NonNullable<typeof msg> => msg !== null)
          .sort((a, b) => {
            return a.createdAt.getTime() - b.createdAt.getTime();
          });

        // createdAt 속성 제거하고 Message 타입으로 변환
        const finalMessages: Message[] = sortedMessages.map((msg) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { createdAt, ...message } = msg;
          return message;
        });

        setMessages(finalMessages);
      }
    } catch (error) {
      console.error("메시지 로딩 오류:", error);
    }
  }, [chatRoomId, user.id]);

  // 채팅방 입장 및 메시지 로딩
  useEffect(() => {
    if (userLoading) return; // 사용자 정보 로딩 완료 후에만 메시지 로드
    loadMessages();
  }, [chatRoomId, userLoading, loadMessages]);

  // 전체 로딩 상태 (채팅방 목록 로딩 + 프로필 클릭 로딩)
  const overallLoading = chatRoomsLoading || isProfileLoading;

  // chatRoomId가 없거나 로딩 중일 때 LoadingScreen 표시
  if (overallLoading || !chatRoomId) {
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
        onOpenModal={handleOpenRequestModal}
        showInterests={showInterests}
        onToggleInterests={handleToggleInterests}
        chatRoomId={chatRoomId}
      />

      {/* 팝업 모달 */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={closeModal}
        opponentName={currentChatRoom?.userInfo?.name}
        requestMessage="커피챗 제안이 도착했습니다."
        requestTime="요청 시간 정보가 없습니다."
        availableTime={commonFreeTime}
      />

      {/* 메시지 영역 */}
      <ChatMessageArea
        messages={messages}
        username={currentChatRoom?.userInfo?.name || "상대방"}
        opponentProfileImage={currentChatRoom?.userInfo?.profileImage}
      />

      {/* 입력창 */}
      <ChatInputBox
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSend={handleSend}
        onImageSend={handleImageSend}
        disabled={!chatRoomId}
      />
    </div>
  );
};

export default ChatRoom;
