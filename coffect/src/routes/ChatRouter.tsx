import React from "react";
import { Routes, Route } from "react-router-dom";
import Chat from "../pages/Chat";
import ChatRoom from "../components/chat/chatRoom";
import Schedule from "../components/chat/Schedule";

const ChatRouter: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Chat />} />
      <Route path=":chatRoomId" element={<ChatRoom />} />
      <Route path=":chatRoomId/schedule" element={<Schedule />} />
    </Routes>
  );
};

export default ChatRouter;
