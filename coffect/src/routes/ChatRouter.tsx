import React from "react";
import { Routes, Route } from "react-router-dom";
import Chat from "../pages/Chat";
import ChatRoom from "../components/chat/chatRoom";
import Schedule from "../components/chat/Schedule";

const ChatRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="" element={<Chat />} />
      <Route path=":id" element={<ChatRoom />} />
      <Route path="room/:id" element={<ChatRoom />} />
      <Route path="/schedule" element={<Schedule />} />
    </Routes>
  );
};

export default ChatRouter;
