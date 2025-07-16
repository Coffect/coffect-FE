// author : 앨리스/박은지
// description : 메시지 리스트

import React from "react";
import MessageBubble from "./MessageBubble";
import ImageMessageBubble from "./ImageMessageBubble";
import type { Message } from "../../types/chat";

interface Props {
  messages: Message[];
  getMessageMargin: (idx: number, messages: Message[]) => string;
}

const ChatMessageList: React.FC<Props> = ({ messages, getMessageMargin }) => (
  <>
    {messages.map((msg, idx) => (
      <div
        key={msg.id}
        className={`w-full ${getMessageMargin(idx, messages)} ${msg.mine ? "justify-end" : "justify-start"} flex`}
      >
        {msg.type === "image" ? (
          <ImageMessageBubble
            mine={msg.mine}
            imageUrl={msg.imageUrl}
            showProfile={
              !msg.mine && (!messages[idx - 1] || messages[idx - 1].mine)
            }
          />
        ) : (
          <MessageBubble
            text={msg.text}
            time={msg.time}
            mine={msg.mine}
            showProfile={
              !msg.mine && (!messages[idx - 1] || messages[idx - 1].mine)
            }
          />
        )}
      </div>
    ))}
  </>
);

export default ChatMessageList;
