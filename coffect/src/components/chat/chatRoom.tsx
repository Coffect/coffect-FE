// author : 앨리스/박은지
// description : 채팅방 페이지
// 채팅방 내부 메시지 영역, 입력창, 관심 주제 & 버튼, 팝업 모달 연결

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Plus, Send, Calendar, Mail } from "lucide-react";
import useCurrentTime from "./hooks/useCurrentTime";
import useModal from "./hooks/useModal";
import RequestModal from "./RequestModal";
import useHandleSend from "./hooks/useHandleSend";

const TAG_COLORS = [
  "bg-[rgba(255,240,200,1)] text-[rgba(255,129,38,1)]",
  "bg-[rgba(221,246,217,1)] text-[rgba(72,126,61,1)]",
  "bg-[rgba(255,231,223,1)] text-[rgba(255,112,62,1)]",
  "bg-[rgba(244,229,255,1)] text-[rgba(137,87,173,1)]",
];

const ChatRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isOpen: isModalOpen,
    open: openModal,
    close: closeModal,
  } = useModal();

  // 일정 정보 (전달받은 일정이 있으면 표시)
  const [schedule, setSchedule] = useState<{
    date: string;
    time: string;
  } | null>(null);

  useEffect(() => {
    // location.state에서 일정 정보 가져오기
    if (location.state?.schedule) {
      setSchedule(location.state.schedule);
    }
  }, [location.state]);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "안녕하세요! 꼭 한번 커피챗 해보고 싶어서 제안드렸습니다 :)",
      time: "오전 11:47",
      mine: false,
    },
    { id: 2, text: "안녕하세요!", time: "오전 11:47", mine: true },
    {
      id: 3,
      text: "네 좋아요!\n이번주에 시간 언제 가능하세요?",
      time: "오전 11:47",
      mine: true,
    },
    {
      id: 4,
      text: "목요일 두시 공강이신걸로 아는데 그때 어떠세요??",
      time: "오전 11:48",
      mine: false,
    },
    {
      id: 5,
      text: "좋습니다!\n정문 앞 스벅에서 만나요!!",
      time: "오전 11:49",
      mine: true,
    },
    {
      id: 6,
      text: "네 그럼 거기서 2시에 봅시다!",
      time: "오전 11:49",
      mine: false,
    },
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
    username: "김라떼",
    info: "이런 주제에 관심 있어요!",
    interests: ["디자인", "개발", "경영", "글쓰기"],
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[rgba(240,240,240,1)]">
      {/* Header */}
      <div className="flex items-center border-b border-gray-100 bg-white px-4 pt-6 pb-2">
        <button className="mr-2 text-2xl" onClick={() => navigate("/chat")}>
          {" "}
          <ChevronLeft />{" "}
        </button>
        <div className="flex flex-1 flex-col items-center">
          <span className="text-base font-extrabold">{user.username}</span>
        </div>
        <div className="ml-2 h-8 w-8 rounded-full border border-gray-200 bg-gray-300" />
      </div>
      {/* 관심 주제 & 버튼 */}
      <div className="border-b border-gray-100 bg-white px-4 py-3">
        <div className="mb-3 flex flex-wrap gap-2">
          {user.interests.map((tag, i) => (
            <span
              key={tag}
              className={`rounded-md px-3 py-1 text-xs font-medium ${TAG_COLORS[i % TAG_COLORS.length]}`}
            >
              {tag}
            </span>
          ))}
        </div>
        {/* 일정 정보 표시 */}
        {schedule && (
          <div className="mb-3 flex items-center gap-3">
            <div className="flex items-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-700">
              <Calendar size={18} className="mr-3 text-gray-400" />
              {schedule.date} {schedule.time}
            </div>
            <button
              className="flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700"
              onClick={openModal}
            >
              <Mail size={16} className="mr-3 text-gray-400" />
              상대 요청 보기
            </button>
          </div>
        )}
        {/* 커피챗 일정 등록/상대 요청 보기 버튼(일정 없을 때만) */}
        {!schedule && (
          <div className="flex gap-2">
            <button
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-200 py-2 text-sm font-bold text-gray-700"
              onClick={() => navigate("/chat/schedule")}
            >
              <Calendar size={17} />
              커피챗 일정 등록
            </button>
            <button
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-200 bg-[Gray/10] py-2 text-sm font-bold text-gray-700"
              onClick={openModal}
            >
              <Mail size={17} />
              상대 요청 보기
            </button>
          </div>
        )}
      </div>
      {/* 팝업 모달 */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={closeModal}
        username={user.username}
      />
      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {/* 시스템 메시지 */}
        <div className="my-4 flex justify-center">
          <span className="mb-3 rounded-full px-3 text-xs text-gray-500">
            인하님이 제안을 수락했어요!
          </span>
        </div>
        {/* 채팅 메시지 */}
        {messages.map((msg, idx) => {
          const prev = messages[idx - 1];
          let margin = "";
          if (idx !== 0) {
            margin = prev && prev.mine !== msg.mine ? "mt-6" : "mt-2";
          }
          return (
            <div
              key={msg.id}
              className={`flex w-full ${margin} ${msg.mine ? "justify-end" : "justify-start"}`}
            >
              {msg.mine ? (
                <div className="flex items-end gap-2">
                  <span className="mb-1 text-[11px] text-[rgba(132,132,132,1)]">
                    {msg.time}
                  </span>
                  <div className="max-w-[75%] rounded-lg bg-[rgba(58,58,58,1)] px-4 py-2 text-xs leading-relaxed whitespace-pre-line text-white">
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div className="flex items-end gap-2">
                  <div className="max-w-[75%] rounded-lg bg-[rgba(255,255,255,1)] px-3 py-2 text-xs leading-relaxed whitespace-pre-line text-[rgba(45,45,45,1)]">
                    {msg.text}
                  </div>
                  <span className="mb-1 text-[11px] text-[rgba(132,132,132,1)]">
                    {msg.time}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* 입력창 */}
      <div className="border-t border-gray-100 bg-white px-0 py-3">
        <div className="mx-auto flex w-[95%] items-center rounded-full bg-[rgba(245,245,245,1)] px-2 py-2">
          <button className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(74,74,74,1)] text-white">
            <Plus size={22} />
          </button>
          <input
            className="flex-1 rounded-full px-1 py-2 text-base outline-none placeholder:text-[rgba(172,172,172,1)]"
            placeholder="메시지를 입력해주세요"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputValue.trim()) {
                handleSend(inputValue);
              }
            }}
            style={{ fontSize: "16px" }}
          />
          <button
            className="ml-2 flex h-8 w-12 items-center justify-center rounded-full bg-[rgba(255,129,38,1)] text-white"
            onClick={() => {
              if (inputValue.trim()) {
                handleSend(inputValue);
              }
            }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
