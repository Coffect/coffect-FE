import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Chat from "../pages/Chat";
import ChatRoom from "../components/chat/chatRoom";
import Schedule from "../components/chat/Schedule";

const ChatRouter: React.FC = () => {
  const location = useLocation();

  // schedule이 포함된 경로인지 확인
  const isSchedulePath = location.pathname.includes("/schedule");

  if (isSchedulePath) {
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
