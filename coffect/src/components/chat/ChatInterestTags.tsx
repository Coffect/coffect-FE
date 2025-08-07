/*
 * author : 앨리스/박은지
 * description : 채팅방 내부 관심 주제 태그
 */

import React from "react";

const TAG_COLORS = [
  "bg-[var(--design-bg)] text-[var(--design-text)]",
  "bg-[var(--development-bg)] text-[var(--development-text)]",
  "bg-[var(--startup-bg)] text-[var(--startup-text)]",
  "bg-[var(--write-bg)] text-[var(--write-text)]",
];

const ChatInterestTags: React.FC<{ interests: string[] }> = ({ interests }) => (
  <>
    {interests.map((tag, i) => (
      <span
        key={tag}
        className={`rounded-md px-3 py-1 text-sm font-medium ${TAG_COLORS[i % TAG_COLORS.length]}`}
      >
        {tag}
      </span>
    ))}
  </>
);

export default ChatInterestTags;
