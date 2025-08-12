/*
 * author : 앨리스/박은지
 * description : 채팅방 페이지
 * 채팅방 내부 메시지 영역, 팝업 모달 연결, 일정 정보 표시
 */

<<<<<<< HEAD
import { useState, useRef, type MouseEvent, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronDown } from "lucide-react";
import useCurrentTime from "./hooks/useCurrentTime";
import useModal from "./hooks/useModal";
import RequestModal from "./RequestModal";
import useHandleSend from "./hooks/useHandleSend";
import ChatInputBox from "./ChatInputBox";
import ChatMessageList from "./ChatMessageList";
import usePreventZoom from "./hooks/usePreventZoom";
import useAutoScroll from "./hooks/useAutoScroll";
import type { Message } from "../../types/chat";
import type { Schedule } from "./hooks/useSchedule";
import { getMessageMargin } from "./utils/chatUtils";
import ExampleProfile from "../../assets/icon/chat/ExampleProfile.png";
import { ChatInterestSection } from "./ChatInterestSection";
import { ChatSystemMessage } from "./ChatSystemMessage";
import { useChatUser } from "./hooks/useChatUser";
=======
import usePreventZoom from "./hooks/usePreventZoom";
import useModal from "./hooks/useModal";
import RequestModal from "./RequestModal";
import ChatInputBox from "./ChatInputBox";
import ChatHeader from "./ChatHeader";
import ChatInterestsSection from "./ChatInterestsSection";
import ChatMessageArea from "./ChatMessageArea";
import { useChatRoom } from "./hooks/useChatRoom";
>>>>>>> 552b968a2bb03d7cc903cac53139a56fd74252fb

const ChatRoom = () => {
  usePreventZoom();

  const {
    isOpen: isModalOpen,
    open: openModal,
    close: closeModal,
  } = useModal();

<<<<<<< HEAD
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

  const handleSend = useHandleSend(
=======
  const {
>>>>>>> 552b968a2bb03d7cc903cac53139a56fd74252fb
    messages,
    inputValue,
    setInputValue,
<<<<<<< HEAD
    getCurrentTime,
  );

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

  const [showInterests, setShowInterests] = useState(true);
=======
    schedule,
    user,
    handleSend,
    handleImageSend,
  } = useChatRoom();
>>>>>>> 552b968a2bb03d7cc903cac53139a56fd74252fb

  const handleToggleInterests = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowInterests((prev) => !prev);
  };

  return (
    <div className="flex h-full w-full flex-col bg-[var(--white)]">
      {/* Header */}
<<<<<<< HEAD
      <div className="flex items-center border-b border-[var(--gray-10)] bg-[var(--white)] px-4 pt-6 pb-3">
        <button
          type="button"
          aria-label="채팅 목록으로 돌아가기"
          className="mr-2 text-2xl"
          onClick={() => navigate("/chat")}
        >
          <ChevronLeft />
        </button>
        <div className="flex flex-1 flex-col items-center">
          <span className="truncate text-[18px] font-semibold">
            {user.username}
          </span>
        </div>
        <button
          type="button"
          aria-label="프로필 페이지로 이동"
          className="ml-2 h-8 w-8 overflow-hidden rounded-full bg-transparent"
          onClick={() => navigate(`/userpage/${user.id}`)}
        >
          <img
            src={ExampleProfile}
            alt="프로필"
            className="h-full w-full rounded-full object-cover"
            loading="lazy"
          />
        </button>
      </div>
      {/* 관심 주제 & 버튼 */}
      <ChatInterestSection
        user={user}
        schedule={schedule}
        showInterests={showInterests}
        handleToggleInterests={handleToggleInterests}
        openModal={openModal}
      />
=======
      <ChatHeader username={user.username} userId={user.id} />

      {/* 관심 주제 & 버튼 */}
      <ChatInterestsSection
        interests={user.interests}
        schedule={schedule}
        onOpenModal={openModal}
      />

>>>>>>> 552b968a2bb03d7cc903cac53139a56fd74252fb
      {/* 팝업 모달 */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={closeModal}
        username={user.username}
      />

      {/* 메시지 영역 */}
<<<<<<< HEAD
      <div className="flex-1 overflow-y-auto bg-[var(--gray-5)] px-4 py-2">
        {/* 시스템 메시지 */}
        <ChatSystemMessage user={user} />
        {/* 고정 토글 버튼 */}
        {!showInterests && (
          <div className="sticky top-0 z-10 -mt-13 flex justify-end">
            <button
              onClick={handleToggleInterests}
              className="cursor-pointer rounded-full bg-[var(--white)] p-1 text-[var(--gray-50)] shadow-[0_0_12px_0_rgba(0,0,0,0.15)]"
            >
              <ChevronDown size={24} />
            </button>
          </div>
        )}
        <ChatMessageList
          messages={messages}
          getMessageMargin={getMessageMargin}
        />
        {/* 스크롤 타겟 */}
        <div ref={messagesEndRef} />
      </div>
=======
      <ChatMessageArea messages={messages} />

>>>>>>> 552b968a2bb03d7cc903cac53139a56fd74252fb
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
