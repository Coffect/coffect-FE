// 날짜를 한글 형식으로 변환하는 함수 (요일 포함)
export function formatKoreanDate(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const week = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  const dayOfWeek = week[date.getDay()];
  return `${month}월 ${day}일 ${dayOfWeek}`;
}

// 날짜를 한글 형식으로 변환하는 함수 (요일 제외)
export function formatKoreanDateShort(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
}

/**
 * 시간을 상대적으로 표시하는 함수
 * @param date - 표시할 날짜
 * @returns 상대적 시간 문자열 (예: "지금", "20분 전", "1시간 전", "2일 전")
 */
export const getRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const targetDate = typeof date === "string" ? new Date(date) : date;

  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return "지금";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  } else {
    return targetDate.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
  }
};
