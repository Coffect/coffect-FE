import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronUp, CircleUserRound } from "lucide-react";
import ChatInput from "./ChatInput";
import useCurrentTime from "./hooks/useCurrentTime";
import useModal from "./hooks/useModal";
import RequestModal from "./RequestModal";
import useHandleSend from "./hooks/useHandleSend";

const ChatRoom = () => {
  const navigate = useNavigate();
  const {
    isOpen: isModalOpen,
    open: openModal,
    close: closeModal,
  } = useModal();
  const [messages, setMessages] = useState([
    { id: 1, text: "안녕하세여", time: "오전 11:47", mine: true },
    { id: 2, text: "네 반갑습니다!", time: "오전 11:58", mine: false },
  ]);
  const [inputValue, setInputValue] = useState("");
  const getCurrentTime = useCurrentTime();

  const handleSend = useHandleSend(
    messages,
    setMessages,
    setInputValue,
    getCurrentTime,
  );

  const user = {
    username: "kimhan_0725",
    info: "김하은 TESL전공 24학번",
    interests: ["스타트업", "마케팅", "인공지능", "교육"],
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <div className="flex items-center px-4 pt-6 pb-2">
        <button className="mr-2 text-2xl" onClick={() => navigate("/chat")}>
          <ChevronLeft />
        </button>
        <div className="flex flex-1 flex-col items-center">
          <span className="text-lg font-bold">{user.username}</span>
          <span className="text-xs text-gray-400">{user.info}</span>
        </div>
        <div className="ml-2 flex items-center justify-center">
          <CircleUserRound className="h-7 w-7 text-gray-600" />
        </div>
      </div>
      {/* 관심 주제 */}
      <div className="bg-gray-300 px-4 py-4">
        <div className="mb-3 flex items-center justify-between text-sm text-gray-700">
          이런 주제에 관심 있어요!
          <ChevronUp />
        </div>
        <div className="mb-2 flex flex-wrap gap-2">
          {user.interests.map((tag) => (
            <span
              key={tag}
              className="rounded bg-gray-500 px-2 py-1 text-xs text-white"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="text-s flex-1 rounded bg-gray-500 py-2 font-bold text-white">
            커피챗 일정 등록
          </button>
          <button
            className="text-s flex flex-1 items-center justify-center gap-1 rounded bg-gray-500 py-1 font-bold text-white"
            onClick={openModal}
          >
            상대 요청 보기
          </button>
        </div>
      </div>
      {/* 팝업 모달 */}
      <RequestModal isOpen={isModalOpen} onClose={closeModal} />
      {/* 메시지 영역 */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-2">
        <div className="my-2 flex items-center">
          <div className="flex-1 border-t border-gray-500"></div>
          <span className="mx-3 text-xs text-gray-700">
            상상님이 제안을 수락했어요!
          </span>
          <div className="flex-1 border-t border-gray-500"></div>
        </div>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end ${msg.mine ? "justify-end" : "justify-start"}`}
          >
            {msg.mine && (
              <span className="min-w-[48px] text-right text-xs text-gray-400">
                {msg.time}
              </span>
            )}
            <div
              className={
                `max-w-[70%] rounded-xl bg-gray-200 px-4 py-2` +
                (msg.mine ? " ml-2" : " mr-2")
              }
            >
              <div className="text-sm">{msg.text}</div>
            </div>
            {!msg.mine && (
              <span className="min-w-[48px] text-left text-xs text-gray-400">
                {msg.time}
              </span>
            )}
          </div>
        ))}
      </div>
      {/* 입력창 */}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
      />
    </div>
  );
};

export default ChatRoom;
