// author : 앨리스/박은지
/*
 * description : [커피챗 일정 등록] 날짜 선택 훅
 */

import { useState } from "react";

// 날짜를 한국어 형식으로 포맷팅하는 함수
export const formatDateToKorean = (date: Date | string | undefined): string => {
  if (!date) return "";
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return "";
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  return `${year}년 ${month}월 ${day}일`;
};

export const useDatePicker = () => {
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);

  return {
    showCalendarPicker,
    setShowCalendarPicker,
    formatDateToKorean,
  };
};
