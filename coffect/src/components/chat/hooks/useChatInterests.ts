/*
 * author : 앨리스/박은지
 * description : 채팅방 관심 주제 태그 훅
 */

import { useState, type MouseEvent } from "react";

export const useChatInterests = () => {
  const [showInterests, setShowInterests] = useState(true);

  const handleToggleInterests = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowInterests((prev) => !prev);
  };

  return {
    showInterests,
    handleToggleInterests,
  };
};
