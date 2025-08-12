/*
 * description : 채팅방 훅 (임시 데이터)
 */

import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useCurrentTime from "./useCurrentTime";
import useHandleSend from "./useHandleSend";
import type { Message } from "../../../types/chat";

interface Schedule {
  date: string | Date;
  time: string;
  place?: string;
  alert?: string | null;
}

interface User {
  id: string;
  username: string;
  info: string;
  interests: string[];
}

export const useChatRoom = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const getCurrentTime = useCurrentTime();

  // 일정 정보 (전달받은 일정이 있으면 표시)
  const [schedule] = useState<Schedule | null>(() => {
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

  const handleSend = useHandleSend(
    messages,
    setMessages,
    setInputValue,
    getCurrentTime,
  );

  const handleImageSend = (file: File) => {
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
  };

  const user: User = {
    id: id || "coffect",
    username: "김라떼",
    info: "이런 주제에 관심 있어요!",
    interests: ["디자인", "개발", "경영", "글쓰기"],
  };

  return {
    messages,
    inputValue,
    setInputValue,
    schedule,
    user,
    handleSend,
    handleImageSend,
  };
};
