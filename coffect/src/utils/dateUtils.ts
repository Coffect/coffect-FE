/* author: 앨리스/박은지
 * description: 날짜를 한글 형식으로 변환하는 함수 (요일 포함)
 */
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

/* author: 앨리스/박은지
 * description: 날짜를 한글 형식으로 변환하는 함수 (요일 제외)
 */
export function formatKoreanDateShort(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
}

/**
 * @author 흥부/강신욱
 * @description 주어진 날짜 문자열을 현재 시간과 비교하여 "X분 전", "X시간 전", "X일 전" 등의 형식으로 변환합니다.
 * @param dateString
 * @example "2023-10-01T12:00:00Z" 형식의 날짜 문자열을 입력으로 받습니다.
 * "2023-10-01T12:00:00Z" -> "2시간 전" (현재 시간이 2023-10-01T14:00:00Z인 경우)
 * "2023-10-01T12:00:00Z" -> "어제" (현재 시간이 2023-10-02T12:00:00Z인 경우)
 * @returns
 */
export function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMilliseconds = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMilliseconds / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return "방금 전";
  } else if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else if (diffDays === 1) {
    return "어제";
  } else {
    return `${diffDays}일 전`;
  }
}

/**
 * @author 흥부/강신욱
 * @description 주어진 날짜 문자열을 현재 시간과 비교하여 "N분 후", "N시간 후", "내일", "N일 후" 등의 형식으로 변환합니다.
 * @param dateString
 * @example "2023-10-01T14:00:00Z" 형식의 날짜 문자열을 입력으로 받습니다.
 * "2023-10-01T14:00:00Z" -> "2시간 후" (현재 시간이 2023-10-01T12:00:00Z인 경우)
 * "2023-10-02T12:00:00Z" -> "내일" (현재 시간이 2023-10-01T12:00:00Z인 경우)
 * @사용법 getTimeUntil("2023-10-01T14:00:00Z")
 * @returns
 */
export function getTimeUntil(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMilliseconds = date.getTime() - now.getTime();
  const diffSeconds = Math.floor(diffMilliseconds / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return "잠시 후";
  } else if (diffMinutes < 60) {
    return `${diffMinutes}분 후`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 후`;
  } else if (diffDays === 1) {
    return "내일";
  } else {
    return `${diffDays}일 후`;
  }
}

/* author: 앨리스/박은지
 * description: 12시간제 시간을 24시간제로 변환
 */
export function formatAmPmTo24Hour(timeString: string): string {
  const match = timeString.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return timeString;
  let hour = parseInt(match[1], 10);
  const minute = match[2];
  const period = match[3].toUpperCase();
  if (period === "AM") {
    if (hour === 12) hour = 0;
  } else {
    if (hour !== 12) hour += 12;
  }
  const hh = hour.toString().padStart(2, "0");
  return `${hh}:${minute}`;
}

// author: 썬더/이희선
// 날짜 포맷 변환 (ISO → YYYY.MM.DD)
export const formatDate = (isoDate: string) => {
  const dateObj = new Date(isoDate);
  return dateObj
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\./g, "")
    .replace(/ /g, ".");
};

// 약속 시간 HH:MM (24시간 형식)
export const formatTime = (isoDate: string) => {
  const dateObj = new Date(isoDate);
  return dateObj.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// 채팅 메시지 시간 (12시간 형식 - 오전/오후)
export const formatChatTime = (isoDate: string) => {
  const dateObj = new Date(isoDate);
  return dateObj.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
