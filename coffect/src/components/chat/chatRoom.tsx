/*
 * author : 앨리스/박은지
 * description : 채팅방 페이지
 * 채팅방 내부 메시지 영역, 팝업 모달 연결, 일정 정보 표시
 */

import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Calendar,
  Mail,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import useModal from "./hooks/useModal";
import RequestModal from "./RequestModal";
import ChatInterestTags from "./ChatInterestTags";
import ChatInputBox from "./ChatInputBox";
import ChatMessageList from "./ChatMessageList";
import usePreventZoom from "./hooks/usePreventZoom";
import useAutoScroll from "./hooks/useAutoScroll";
import { useChatRoom } from "./hooks/useChatRoom";

import ExampleProfile from "../../assets/icon/chat/ExampleProfile.png";

function getMessageMargin(idx: number, messages: Array<{ mine: boolean }>) {
  if (idx === 0) return "mt-4";
  const prev = messages[idx - 1];
  return prev && prev.mine !== messages[idx].mine ? "mt-6" : "mt-2";
}

const ChatRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  usePreventZoom();
  const {
    isOpen: isModalOpen,
    open: openModal,
    close: closeModal,
  } = useModal();

  const [showInterests, setShowInterests] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // useChatRoom 훅 사용
  const {
    messages,
    inputValue,
    setInputValue,
    schedule,
    handleSend,
    handleImageSend,
  } = useChatRoom();

  // 메시지 영역에만 스크롤 적용
  useAutoScroll(messagesEndRef, [messages.length], true);

  // 아코디언 상태 변경
  const handleToggleInterests = () => {
    setShowInterests((prev) => !prev);
  };

  const user = {
    id: id,
    username: "김라떼",
    info: "이런 주제에 관심 있어요!",
    interests: ["디자인", "개발", "경영", "글쓰기"],
  };

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
        <div
          className="ml-2 h-8 w-8 cursor-pointer overflow-hidden rounded-full border-1 border-[var(--gray-80)] p-[1px]"
          onClick={() => navigate(`/userpage/${id}`)}
        >
          <img
            src={ExampleProfile}
            alt="프로필"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
      </div>
      {/* 관심 주제 & 버튼 */}
      {showInterests ? (
        <div className="border-b border-[var(--gray-5)] bg-[var(--white)] px-4 py-3">
          {/* 텍스트 + 토글 아이콘 */}
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-bold text-[var(--gray-70)]">
              이런 주제에 관심 있어요!
            </span>
            <button
              onClick={handleToggleInterests}
              className="cursor-pointer rounded-full bg-[var(--gray-5)] p-1 text-[var(--gray-50)]"
            >
              <ChevronUp size={25} />
            </button>
          </div>
          <div className="mb-3 flex flex-wrap gap-2">
            <ChatInterestTags interests={user.interests} />
          </div>
          {/* 일정 정보 표시 및 버튼 영역 */}
          <div className="flex w-full items-center gap-2">
            {schedule && (
              <button
                className="flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md border border-[var(--gray-10)] bg-[var(--white)] py-2 text-xs font-bold text-ellipsis whitespace-nowrap text-[var(--gray-90)] sm:text-sm"
                onClick={() =>
                  navigate("/chat/schedule", { state: { schedule } })
                }
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
                className="flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md border border-[var(--gray-10)] bg-[var(--white)] py-2 text-xs font-bold text-ellipsis whitespace-nowrap text-[var(--gray-70)] sm:text-sm"
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
                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[var(--gray-10)] py-2 text-sm font-medium text-[var(--gray-70)]"
                onClick={() => navigate("/chat/schedule")}
              >
                <Calendar size={17} />
                커피챗 일정 등록
              </button>
              <button
                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[var(--gray-10)] bg-[var(--white)] py-2 text-sm font-medium text-[var(--gray-70)]"
                onClick={openModal}
              >
                <Mail size={17} />
                상대 요청 보기
              </button>
            </div>
          )}
        </div>
      ) : null}
      {/* 팝업 모달 */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={closeModal}
        username={user.username}
      />
      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto bg-[var(--gray-5)] px-4 py-2">
        {/* 시스템 메시지 */}
        <div className="relative my-4">
          <div className="flex justify-center">
            <span className="rounded-full px-3 text-xs font-medium text-[var(--gray-40)]">
              인하님이 제안을 수락했어요!
            </span>
          </div>
          {!showInterests && (
            <button
              onClick={handleToggleInterests}
              className="absolute top-1/2 right-0.5 -translate-y-1/2 cursor-pointer bg-[var(--white)] p-1 text-[var(--gray-50)]"
              style={{
                borderRadius: "80px",
                boxShadow: "0 0 12px 0 rgba(88, 88, 88, 0.12)",
              }}
            >
              <ChevronDown size={25} />
            </button>
          )}
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
        onImageSend={handleImageSend}
      />
    </div>
  );
};

export default ChatRoom;
