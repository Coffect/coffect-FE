// 시간표 API 응답 타입 정의
export interface TimeTableItem {
  // API 문서에 맞춰 필드 정의
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  // 기타 필요한 필드들
}

export interface GetTimeTableResponse {
  resultType: "SUCCESS" | "FAIL";
  error: { errorCode: string; reason: string; data: string | null } | null;
  success: string | null; // 시간표 데이터는 JSON 문자열로 반환됨
}
