// author : 앨리스/박은지
/*
 * description : [커피챗 일정 등록] 시간 선택 훅
 * 초기값 설정
 */

import { useState } from "react";

export const useTimePicker = (time: string) => {
  const [showTimeModal, setShowTimeModal] = useState(false);

  // 시간 값을 파싱해서 TimeScrollModal에 넘길 초기값 생성
  let initialTime = undefined;
  if (time) {
    const match = time.match(/(\d{1,2}):(\d{2})\s?(AM|PM)?/i);
    if (match) {
      initialTime = {
        hour: Number(match[1]),
        minute: match[2],
        ampm: match[3] || "AM",
      };
    }
  }

  return {
    showTimeModal,
    setShowTimeModal,
    initialTime,
  };
};
