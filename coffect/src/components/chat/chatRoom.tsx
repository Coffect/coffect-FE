// author : 앨리스/박은지
// description : 채팅방 페이지
// 채팅방 내부 메시지 영역, 팝업 모달 연결, 일정 정보 표시

import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  Calendar,
  Mail,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import useCurrentTime from "./hooks/useCurrentTime";
import useModal from "./hooks/useModal";
import RequestModal from "./RequestModal";
import useHandleSend from "./hooks/useHandleSend";
import ChatInterestTags from "./ChatInterestTags";
import ChatInputBox from "./ChatInputBox";
import ChatMessageList from "./ChatMessageList";
import usePreventZoom from "./hooks/usePreventZoom";
import useAutoScroll from "./hooks/useAutoScroll";
import type { Message } from "../../types/chat";
import ExampleProfile from "../../assets/icon/chat/ExampleProfile.png";

function getMessageMargin(idx: number, messages: Array<{ mine: boolean }>) {
  if (idx === 0) return "mt-4";
  const prev = messages[idx - 1];
  return prev && prev.mine !== messages[idx].mine ? "mt-6" : "mt-2";
}

const ChatRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  usePreventZoom();
  const {
    isOpen: isModalOpen,
    open: openModal,
    close: closeModal,
  } = useModal();

  // 일정 정보 (전달받은 일정이 있으면 표시)
  const [schedule] = useState<{
    date: string | Date;
    time: string;
    place?: string;
    alert?: string | null;
  } | null>(() => {
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
  useAutoScroll(messagesEndRef, [messages]);

  const handleSend = useHandleSend(
    messages,
    setMessages,
    setInputValue,
    getCurrentTime,
  );

  const user = {
    username: "김라떼",
    info: "이런 주제에 관심 있어요!",
    interests: ["디자인", "개발", "경영", "글쓰기"],
  };

  const [showInterests, setShowInterests] = useState(true);

  return (
    <div className="flex h-full w-full flex-col bg-[var(--white)]">
      {/* Header */}
      <div className="flex items-center border-b border-[var(--gray-10)] bg-[var(--white)] px-4 pt-6 pb-2">
        <button className="mr-2 text-2xl" onClick={() => navigate("/chat")}>
          {" "}
          <ChevronLeft />{" "}
        </button>
        <div className="flex flex-1 flex-col items-center">
          <span className="text-base font-extrabold">{user.username}</span>
        </div>
        <div className="ml-2 h-8 w-8 overflow-hidden rounded-full border border-[var(--gray-10)] bg-[var(--gray-30)]">
          <img
            src={ExampleProfile}
            alt="프로필"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      {/* 관심 주제 & 버튼 */}
      <div className="border-b border-[var(--gray-5)] bg-[var(--white)] px-4 py-3">
        {/* 텍스트 + 토글 아이콘 */}
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm font-bold text-[var(--gray-70)]">
            이런 주제에 관심 있어요!
          </span>
          <button
            onClick={() => setShowInterests((prev) => !prev)}
            className="p-1"
          >
            {showInterests ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
        </div>
        {showInterests && (
          <>
            <div className="mb-3 flex flex-wrap gap-2">
              <ChatInterestTags interests={user.interests} />
            </div>
            {/* 일정 정보 표시 및 버튼 영역 기존 코드 그대로 */}
            <div className="flex w-full items-center gap-2">
              {schedule && (
                <button
                  className="flex min-w-0 flex-1 items-center justify-center gap-2 overflow-hidden rounded-md border border-[var(--gray-10)] bg-[var(--white)] py-2 text-xs font-bold text-ellipsis whitespace-nowrap text-[var(--gray-70)] sm:text-sm"
                  onClick={() =>
                    navigate("/chat/schedule", { state: { schedule } })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <Calendar size={18} className="mr-1 text-[var(--gray-40)]" />
                  <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                    {schedule.date
                      ? typeof schedule.date === "string"
                        ? schedule.date.replace(/ /g, "\u00A0")
                        : schedule.date instanceof Date
                          ? schedule.date
                              .toLocaleDateString("ko-KR", {
                                month: "long",
                                day: "numeric",
                              })
                              .replace(/ /g, "\u00A0")
                          : ""
                      : ""}{" "}
                    {schedule.time}
                  </span>
                </button>
              )}
              {schedule && (
                <button
                  className="flex min-w-0 flex-1 items-center justify-center gap-2 overflow-hidden rounded-md border border-[var(--gray-10)] bg-[var(--white)] py-2 text-xs font-bold text-ellipsis whitespace-nowrap text-[var(--gray-70)] sm:text-sm"
                  onClick={openModal}
                >
                  <Mail size={16} className="mr-1 text-[var(--gray-40)]" />
                  <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                    상대 요청 보기
                  </span>
                </button>
              )}
            </div>
            {!schedule && (
              <div className="flex gap-2">
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[var(--gray-10)] py-2 text-sm font-bold text-[var(--gray-70)]"
                  onClick={() => navigate("/chat/schedule")}
                >
                  <Calendar size={17} />
                  커피챗 일정 등록
                </button>
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[var(--gray-10)] bg-[var(--white)] py-2 text-sm font-bold text-[var(--gray-70)]"
                  onClick={openModal}
                >
                  <Mail size={17} />
                  상대 요청 보기
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {/* 팝업 모달 */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={closeModal}
        username={user.username}
      />
      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto bg-[var(--gray-5)] px-4 py-2">
        {/* 시스템 메시지 */}
        <div className="my-4 flex justify-center">
          <span className="mb-3 rounded-full px-3 text-xs font-medium text-[var(--gray-40)]">
            인하님이 제안을 수락했어요!
          </span>
        </div>
        <ChatMessageList
          messages={messages}
          getMessageMargin={getMessageMargin}
        />
        {/* 스크롤 타겟 */}
        <div ref={messagesEndRef} />
      </div>
      {/* 입력창 */}
      <ChatInputBox
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSend={handleSend}
        onImageSend={(file) => {
          // 이미지 메시지 전송
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
        }}
      />
    </div>
  );
};

export default ChatRoom;
