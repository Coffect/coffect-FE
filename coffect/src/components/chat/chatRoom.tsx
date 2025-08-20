/*
 * author : 앨리스/박은지
 * description : 채팅방 페이지
 * 채팅방 내부 메시지 영역, 팝업 모달 연결, 일정 정보 표시
 */

import { useMemo, useState, useEffect, useCallback } from "react";
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
import { getChatMessages, getCoffectId } from "../../api/chat";
import { getMessageShowUp } from "../../api/home";
import { useTimeTableComparison } from "../../hooks/useTimeTable";
import { axiosInstance } from "../../api/axiosInstance";
import { socketManager } from "../../api/chat/socketInstance";
import { formatChatTime } from "../../utils/dateUtils";
import type { Schedule } from "./hooks/useSchedule";
import type { Message } from "../../types/chat";
import { sendPhoto } from "../../api/chat/chatRoomApi";

// 서버에서 보내는 메시지 형식
interface ServerMessage {
  sender: number;
  senderName: string;
  message: string;
  timestamp: string;
  isPhoto?: boolean; // 이미지 여부
}

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
  const [requestData, setRequestData] = useState<{
    message: string;
    time: string;
  } | null>(null);

  const {
    isOpen: isModalOpen,
    open: openModal,
    close: closeModal,
  } = useModal();

  // 일정 정보 (전달받은 일정이 있으면 표시, 없으면 localStorage에서 조회)
  const schedule = useMemo<Schedule | null>(() => {
    // 1. location.state에서 전달받은 일정이 있으면 우선 사용
    const s = location.state?.schedule;
    if (s) {
      // localStorage에 저장
      localStorage.setItem(`schedule_${chatRoomId}`, JSON.stringify(s));
      return {
        date: s.date,
        time: s.time,
        place: s.place ?? "",
        alert: s.alert ?? null,
      };
    }

    // 2. localStorage에서 일정 정보 조회
    const savedSchedule = localStorage.getItem(`schedule_${chatRoomId}`);
    if (savedSchedule) {
      try {
        const parsed = JSON.parse(savedSchedule);

        // date 형식 변환 (Date 객체나 문자열을 기존 형식으로 변환)
        let formattedDate = parsed.date;
        if (parsed.date instanceof Date || typeof parsed.date === "string") {
          const dateObj = new Date(parsed.date);
          if (!isNaN(dateObj.getTime())) {
            formattedDate = dateObj.toLocaleDateString("ko-KR", {
              month: "long",
              day: "numeric",
            });
          }
        }

        return {
          date: formattedDate,
          time: parsed.time,
          place: parsed.place ?? "",
          alert: parsed.alert ?? null,
        };
      } catch (error) {
        console.error("저장된 일정 정보 파싱 실패:", error);
        localStorage.removeItem(`schedule_${chatRoomId}`);
      }
    }

    return null;
  }, [location.state?.schedule, chatRoomId]);

  const { user, loading: userLoading } = useChatUser();

  // 채팅방 목록에서 현재 채팅방 정보 가져오기
  const {
    chatRooms,
    isLoading: chatRoomsLoading,
    loadChatRooms,
  } = useChatRooms();
  const currentChatRoom = useMemo(() => {
    const foundRoom = chatRooms.find((room) => room.chatroomId === chatRoomId);
    return foundRoom;
  }, [chatRooms, chatRoomId]);

  // 채팅방 목록이 로드되었는지 확인하는 상태
  const [hasLoadedChatRooms, setHasLoadedChatRooms] = useState(false);

  // 채팅방 정보가 없으면 로드 (직접 URL 접근 시에만)
  useEffect(() => {
    // 채팅방 목록이 비어있고, 로딩 중이 아니고, 현재 채팅방 정보가 없고, 아직 로드하지 않았을 때만 로드
    if (
      !currentChatRoom &&
      chatRooms.length === 0 &&
      !chatRoomsLoading &&
      !hasLoadedChatRooms
    ) {
      setHasLoadedChatRooms(true); // 먼저 플래그를 설정하여 중복 호출 방지
      loadChatRooms();
    }
  }, [currentChatRoom, chatRooms.length, chatRoomsLoading, hasLoadedChatRooms]);

  // 소켓 연결 상태 확인 및 채팅방 입장
  useEffect(() => {
    if (!user?.id || !chatRoomId || !currentChatRoom) return;

    // useChatRooms에서 이미 Socket이 연결되어 있으므로 바로 채팅방 입장
    if (socketManager.isSocketConnected()) {
      socketManager.joinRoom(chatRoomId, user.id);
    } else {
      // Socket 연결 완료를 기다림
      const handleSocketConnect = () => {
        socketManager.joinRoom(chatRoomId, user.id);
      };

      socketManager.onConnect(handleSocketConnect);

      return () => {
        socketManager.off("connect", handleSocketConnect);
      };
    }
  }, [user?.id, chatRoomId, currentChatRoom]);

  // 내가 제안을 보낸 것인지 여부 판단
  const [isMyRequest, setIsMyRequest] = useState<boolean>(false);

  // 제안 정보 가져오기 (채팅방 목록 정보 활용)
  useEffect(() => {
    const determineProposalDirection = () => {
      if (!chatRoomId || !user.id || !currentChatRoom) {
        return;
      }

      // 채팅방 목록의 userId는 상대방의 ID입니다
      const opponentUserId = currentChatRoom.userId;

      // 내 ID가 상대방 ID보다 작으면 내가 제안을 보낸 것
      // (일반적으로 제안을 보낸 사람의 ID가 더 작음)
      const isMyProposal = user.id < opponentUserId;

      setIsMyRequest(isMyProposal);
    };

    determineProposalDirection();
  }, [chatRoomId, user.id, currentChatRoom]);

  // 메시지 배열 (실제 소켓 통신용)
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoaded, setMessagesLoaded] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [showInterests, setShowInterests] = useState(true);

  const { handleSend } = useHandleSend({
    chatRoomId: chatRoomId || "",
    setInputValue,
    onError: (error) => {
      console.error("메시지 전송 오류:", error);
    },
  });

  const handleImageSend = async (file: File) => {
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    // 파일 크기 제한 (1MB로 더 줄임)
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      console.error("파일 크기가 너무 큽니다. 1MB 이하로 선택해주세요.");
      return;
    }

    if (!chatRoomId) {
      console.error("채팅방 ID가 없습니다");
      return;
    }

    // 소켓 연결 상태 확인
    if (!socketManager.isSocketConnected()) {
      console.error("소켓이 연결되어 있지 않습니다. 이미지 전송을 중단합니다.");
      return;
    }

    // 낙관적 업데이트 (임시 ID로 즉시 표시)
    const tempId = Date.now();
    const tempMessage: Message = {
      id: tempId,
      type: "image",
      imageUrl: URL.createObjectURL(file),
      time: new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      mine: true,
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      // 파일명을 최대한 짧고 안전하게 변경 (431 에러 방지)
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      // 확장자 검증 (안전한 확장자만 허용)
      const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
      const safeExtension = allowedExtensions.includes(fileExtension)
        ? fileExtension
        : "jpg";
      const timestamp = Date.now();
      const safeFileName = `img_${timestamp}.${safeExtension}`;
      const safeFile = new File([file], safeFileName, { type: file.type });

      // API로 이미지 업로드 후 S3 URL 받기
      const response = await sendPhoto(chatRoomId, safeFile);

      if (response.resultType === "SUCCESS") {
        // S3 URL로 메시지 업데이트
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId
              ? { ...msg, imageUrl: response.success.messageBody }
              : msg,
          ),
        );

        // sendImage 이벤트로 이미지 URL 전송

        socketManager.sendImage(chatRoomId, response.success.messageBody);
      } else {
        console.error("이미지 업로드 실패:", response);
        // 실패 시 임시 메시지 제거
        setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      }
    } catch (error) {
      console.error("이미지 전송 실패:", error);
      // 실패 시 임시 메시지 제거
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
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

  // 시간표 비교 훅 사용 (수동 호출)
  const { commonFreeTime, fetchAndCompare: fetchTimeTables } =
    useTimeTableComparison(user.id, currentChatRoom?.userId || 0);

  // 소켓 이벤트 핸들러들을 useCallback으로 메모이제이션
  const handleConnect = useCallback(() => {
    if (!user?.id || !chatRoomId) return;
    socketManager.joinRoom(chatRoomId, user.id);
  }, [chatRoomId, user?.id]);

  const handleDisconnect = useCallback(() => {
    // 소켓 연결 해제 처리
  }, []);

  const handleReceiveMessage = useCallback(
    (...args: unknown[]) => {
      if (args.length === 0) {
        return;
      }

      const socketMessage = args[0] as ServerMessage;
      console.log("socketMessage:", socketMessage);

      // isPhoto 플래그가 있으면 우선 사용, 없으면 S3 URL 체크
      const isImageUrl =
        socketMessage.isPhoto ||
        (socketMessage.message.startsWith("https://") &&
          socketMessage.message.includes("amazonaws.com") &&
          socketMessage.message.match(/\.(jpg|jpeg|png|gif|webp)$/i));

      if (isImageUrl) {
        // 새로운 이미지 메시지 추가
        const newMessage: Message = {
          id: Date.now(),
          type: "image",
          imageUrl: socketMessage.message,
          time: formatChatTime(socketMessage.timestamp),
          mine: socketMessage.sender === user?.id,
        };

        setMessages((prev) => {
          // 이미 존재하는 메시지인지 확인 (중복 방지)
          const existingMessage = prev.find((msg) => msg.id === newMessage.id);
          if (existingMessage) {
            return prev;
          }
          return [...prev, newMessage];
        });
      } else {
        const newMessage: Message = {
          id: Date.now(),
          type: "text",
          text: socketMessage.message,
          time: formatChatTime(socketMessage.timestamp),
          mine: socketMessage.sender === user?.id,
        };

        setMessages((prev) => {
          // 이미 존재하는 메시지인지 확인 (중복 방지)
          const existingMessage = prev.find((msg) => msg.id === newMessage.id);
          if (existingMessage) {
            return prev;
          }
          return [...prev, newMessage];
        });
      }
    },
    [user?.id],
  );

  const handleErrorAck = useCallback((...args: unknown[]) => {
    const error = args[0];
    console.error("소켓 에러 수신:", error);
  }, []);

  // 소켓 메시지 수신 설정 (useChatRooms에서 이미 소켓 연결됨)
  useEffect(() => {
    if (!user?.id || !chatRoomId || !messagesLoaded) return;

    // 기존 리스너 제거 후 새로 등록
    socketManager.off("receive", handleReceiveMessage);
    socketManager.off("errorAck", handleErrorAck);
    socketManager.off("connect", handleConnect);
    socketManager.off("disconnect", handleDisconnect);

    // 새로운 리스너 등록

    socketManager.onConnect(handleConnect);
    socketManager.onDisconnect(handleDisconnect);
    socketManager.onReceiveMessage(handleReceiveMessage);
    socketManager.onErrorAck(handleErrorAck);

    // 이미 연결되어 있으면 바로 채팅방 입장
    if (socketManager.isSocketConnected()) {
      handleConnect();
    }

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      socketManager.off("receive", handleReceiveMessage);
      socketManager.off("errorAck", handleErrorAck);
      socketManager.off("connect", handleConnect);
      socketManager.off("disconnect", handleDisconnect);

      // 채팅방 퇴장 이벤트 전송
      socketManager.leaveRoom(chatRoomId, user.id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, chatRoomId, messagesLoaded]);

  // 상대 요청 보기 모달 열기 함수
  const handleOpenRequestModal = async () => {
    try {
      // 시간표를 먼저 불러옴
      await fetchTimeTables();

      // 제안 데이터 가져오기
      const coffectIdResponse = await getCoffectId(chatRoomId);

      if (
        coffectIdResponse.resultType === "SUCCESS" &&
        coffectIdResponse.success
      ) {
        const coffectId = coffectIdResponse.success;

        // 제안 메시지와 시간 가져오기
        const messageResponse = await getMessageShowUp(coffectId);

        if (messageResponse.success) {
          // 제안 데이터를 상태에 저장
          setRequestData({
            message: messageResponse.success.message,
            time: new Date(messageResponse.success.createdAt).toLocaleString(
              "ko-KR",
            ),
          });
        }
      }
    } catch (error) {
      console.error("데이터 로딩 중 오류 발생:", error);
      // API 호출이 실패해도 모달은 열어줌
    }

    // 모달 열기
    openModal();
  };

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
            const timeString = formatChatTime(msg.createdAt);

            // S3 URL인지 확인 (더 엄격한 체크)
            const isImageUrl =
              msg.messageBody.startsWith("https://") &&
              msg.messageBody.includes("amazonaws.com") &&
              msg.messageBody.match(/\.(jpg|jpeg|png|gif|webp)$/i);

            if (isImageUrl) {
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
        setMessagesLoaded(true);
      }
    } catch (error) {
      console.error("메시지 로딩 오류:", error);
      setMessagesLoaded(true);
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
        isMyRequest={isMyRequest}
      />

      {/* 팝업 모달 */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={closeModal}
        opponentName={currentChatRoom?.userInfo?.name}
        requestMessage={requestData?.message || "커피챗 제안이 도착했습니다."}
        requestTime={requestData?.time || "요청 시간 정보가 없습니다."}
        availableTime={commonFreeTime}
        isMyRequest={isMyRequest}
      />

      {/* 메시지 영역 */}
      <ChatMessageArea
        messages={messages}
        username={currentChatRoom?.userInfo?.name || "상대방"}
        opponentProfileImage={currentChatRoom?.userInfo?.profileImage}
        showInterests={showInterests}
        onToggleInterests={handleToggleInterests}
        isMyRequest={isMyRequest}
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
