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
