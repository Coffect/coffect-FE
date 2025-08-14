import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Chat from "../pages/Chat";
import ChatRoom from "../components/chat/chatRoom";
import Schedule from "../components/chat/Schedule";

const ChatRouter: React.FC = () => {
  const location = useLocation();

  console.log("ChatRouter - 현재 경로:", location.pathname);

  // schedule이 포함된 경로인지 확인
  const isSchedulePath = location.pathname.includes("/schedule");
  console.log("ChatRouter - isSchedulePath:", isSchedulePath);

  if (isSchedulePath) {
    console.log("ChatRouter - Schedule 컴포넌트를 렌더링합니다!");
    return <Schedule />;
  }

  return (
    <Routes>
      <Route path="" element={<Chat />} />
      <Route path=":chatRoomId/schedule" element={<Schedule />} />
      <Route path="room/:id" element={<ChatRoom />} />
      <Route path="*" element={<ChatRoom />} />
    </Routes>
  );
};

export default ChatRouter;
