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

