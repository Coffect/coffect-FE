// author : 앨리스/박은지
// description : 채팅방 내부 관심 주제 태그

import React from "react";

const TAG_COLORS = [
  "bg-[rgba(255,240,200,1)] text-[rgba(255,129,38,1)]",
  "bg-[rgba(221,246,217,1)] text-[rgba(72,126,61,1)]",
  "bg-[rgba(255,231,223,1)] text-[rgba(255,112,62,1)]",
  "bg-[rgba(244,229,255,1)] text-[rgba(137,87,173,1)]",
];

const ChatInterestTags: React.FC<{ interests: string[] }> = ({ interests }) => (
  <>
    {interests.map((tag, i) => (
      <span
        key={tag}
        className={`rounded-md px-3 py-1 text-xs font-medium ${TAG_COLORS[i % TAG_COLORS.length]}`}
      >
        {tag}
      </span>
    ))}
  </>
);

export default ChatInterestTags;
