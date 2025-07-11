// author : 앨리스/박은지
// description : 채팅방 페이지
// 채팅방 내부 메시지 영역, 팝업 모달 연결, 일정 정보 표시

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Calendar, Mail } from "lucide-react";
import useCurrentTime from "./hooks/useCurrentTime";
import useModal from "./hooks/useModal";
import RequestModal from "./RequestModal";
import useHandleSend from "./hooks/useHandleSend";
import ChatInterestTags from "./ChatInterestTags";
import ChatInputBox from "./ChatInputBox";

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
    date: string | Date;
    time: string;
    place?: string;
    alert?: string | null;
  } | null>(null);

  useEffect(() => {
    // location.state에서 일정 정보 가져오기
    if (location.state?.schedule) {
      setSchedule({
        date: location.state.schedule.date,
        time: location.state.schedule.time,
        place: location.state.schedule.place || "",
        alert: location.state.schedule.alert || null,
      });
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

  useEffect(() => {
    function hasScale(
      event: TouchEvent,
    ): event is TouchEvent & { scale: number } {
      return (
        "scale" in event &&
        typeof (event as Record<string, unknown>).scale === "number"
      );
    }
    const handleTouchMove = (event: TouchEvent) => {
      if (hasScale(event) && event.scale !== 1) {
        event.preventDefault();
      }
    };

    let lastTouchEnd = 0;
    const handleTouchEnd = (event: TouchEvent) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    };
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, false);
    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

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
          <ChatInterestTags interests={user.interests} />
        </div>
        {/* 일정 정보 표시 */}
        {schedule && (
          <div className="flex items-center gap-3">
            <button
              className="flex items-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-bold whitespace-nowrap text-gray-700"
              onClick={() =>
                navigate("/chat/schedule", { state: { schedule } })
              }
              style={{ cursor: "pointer" }}
            >
              <Calendar size={18} className="mr-3 text-gray-400" />
              <span className="whitespace-nowrap">
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
            <button
              className="flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-bold whitespace-nowrap text-gray-700"
              onClick={openModal}
            >
              <Mail size={16} className="mr-3 text-gray-400" />
              <span className="whitespace-nowrap">상대 요청 보기</span>
            </button>
          </div>
        )}
        {/* 커피챗 일정 등록/상대 요청 보기 버튼 */}
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
      <ChatInputBox
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSend={handleSend}
      />
    </div>
  );
};

export default ChatRoom;
