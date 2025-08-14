import { useState, useCallback } from "react";
import { axiosInstance } from "../api/axiosInstance";
import type { GetTimeTableResponse } from "../types/mypage/timeTable";

export interface TimeTableData {
  userId: number;
  timeTable: string; // 시간표 데이터
}

export const useTimeTable = (userId: number) => {
  const [timeTable, setTimeTable] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeTable = useCallback(async () => {
    if (!userId || userId <= 0) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get<GetTimeTableResponse>(
        `/profile/getTimeLine?userId=${userId}`,
      );

      if (
        response.data.resultType === "SUCCESS" &&
        response.data.success &&
        typeof response.data.success === "string"
      ) {
        const timeTableData = response.data.success;

        // 비트값인지 확인 (0과 1로만 구성된 문자열)
        if (/^[01]+$/.test(timeTableData)) {
          setTimeTable(timeTableData);
        } else {
          setTimeTable(timeTableData);
        }
      } else {
        setError("시간표를 불러올 수 없습니다.");
        // 에러가 발생해도 null로 설정하여 앱이 중단되지 않도록 함
        setTimeTable(null);
      }
    } catch (err) {
      console.error("시간표 조회 실패:", err);

      // 500 에러인지 확인
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { status?: number } };
        if (axiosError.response?.status === 500) {
          setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else {
          setError("시간표를 불러오는 중 오류가 발생했습니다.");
        }
      } else {
        setError("시간표를 불러오는 중 오류가 발생했습니다.");
      }

      // 네트워크 에러 등이 발생해도 null로 설정
      setTimeTable(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    timeTable,
    loading,
    error,
    refetch: fetchTimeTable,
  };
};

// 비트열을 시간표로 변환하는 함수
const convertBitStringToTimeTable = (bitString: string): string[] => {
  const timeSlots: string[] = [];

  // 비트열을 순회하면서 1인 위치를 찾아 시간대 인덱스로 변환
  for (let i = 0; i < bitString.length; i++) {
    if (bitString[i] === "1") {
      // 시간대 인덱스를 "요일-시간" 형태로 변환
      const dayIndex = Math.floor(i / 22); // 하루에 22개 시간대 (9:00~19:30, 30분 단위)
      const timeIndex = i % 22;

      // 요일과 시간을 "요일-시간" 형태로 변환
      const timeSlot = `${dayIndex}-${timeIndex}`;
      timeSlots.push(timeSlot);
    }
  }

  return timeSlots;
};

// 두 사용자의 시간표를 비교하는 훅
export const useTimeTableComparison = (
  myUserId: number,
  opponentUserId: number,
) => {
  const [commonFreeTime, setCommonFreeTime] =
    useState<string>("겹치는 공강 시간 없음");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { timeTable: myTimeTable, loading: myLoading } = useTimeTable(myUserId);
  const { timeTable: opponentTimeTable, loading: opponentLoading } =
    useTimeTable(opponentUserId);

  const fetchAndCompareTimeTables = useCallback(async () => {
    try {
      console.log(
        "시간표 비교 시작 - 내 ID:",
        myUserId,
        "상대 ID:",
        opponentUserId,
      );

      setLoading(true);
      setError(null);

      // 직접 API에서 시간표를 가져와서 비교
      try {
        const [myResponse, opponentResponse] = await Promise.all([
          axiosInstance.get<GetTimeTableResponse>(
            `/profile/getTimeLine?userId=${myUserId}`,
          ),
          axiosInstance.get<GetTimeTableResponse>(
            `/profile/getTimeLine?userId=${opponentUserId}`,
          ),
        ]);

        // 응답 데이터 확인
        if (
          myResponse.data.resultType === "SUCCESS" &&
          myResponse.data.success &&
          opponentResponse.data.resultType === "SUCCESS" &&
          opponentResponse.data.success
        ) {
          const myTimeTableData = myResponse.data.success;
          const opponentTimeTableData = opponentResponse.data.success;

          if (
            typeof myTimeTableData === "string" &&
            typeof opponentTimeTableData === "string"
          ) {
            // 두 시간표를 비교해서 겹치는 공강 시간 계산
            const commonTime = getCommonFreeTime(
              myTimeTableData,
              opponentTimeTableData,
            );
            setCommonFreeTime(commonTime);
          } else {
            setCommonFreeTime("시간표 데이터 형식이 올바르지 않습니다");
          }
        } else {
          console.log("시간표 API 응답 실패:", {
            my: myResponse.data,
            opponent: opponentResponse.data,
          });
          setCommonFreeTime("시간표를 불러올 수 없습니다");
        }
      } catch (apiError) {
        console.error("시간표 API 호출 실패:", apiError);
        setCommonFreeTime("시간표를 불러올 수 없습니다");
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error("시간표 비교 중 오류 발생:", error);
      setCommonFreeTime("시간 협의 가능");
      setLoading(false);
    }
  }, [myUserId, opponentUserId]);

  return {
    commonFreeTime,
    loading: loading || myLoading || opponentLoading,
    error,
    myTimeTable,
    opponentTimeTable,
    fetchAndCompare: fetchAndCompareTimeTables,
  };
};

// 두 사용자의 겹치는 공강 시간을 계산하는 함수
export const getCommonFreeTime = (
  myTimeTable: string,
  opponentTimeTable: string,
): string => {
  try {
    // 비트열인지 확인
    if (/^[01]+$/.test(myTimeTable) && /^[01]+$/.test(opponentTimeTable)) {
      // 비트 AND 연산으로 겹치는 1 찾기
      let commonBitString = "";
      for (let i = 0; i < myTimeTable.length; i++) {
        if (myTimeTable[i] === "1" && opponentTimeTable[i] === "1") {
          commonBitString += "1";
        } else {
          commonBitString += "0";
        }
      }

      // 겹치는 1이 없으면
      if (!commonBitString.includes("1")) {
        return "겹치는 시간이 없습니다";
      }

      // 비트열을 시간대 배열로 변환
      const commonTimeSlots = convertBitStringToTimeTable(commonBitString);

      // 시간대를 그룹화하여 연속된 시간으로 표시
      const timeGroups = groupConsecutiveSlots(commonTimeSlots);

      // 시간대를 읽기 쉬운 형태로 변환
      const timeStrings = timeGroups.map((group) => {
        const firstSlot = group[0];
        const lastSlot = group[group.length - 1];
        return formatTimeRange(firstSlot, lastSlot);
      });

      return timeStrings.join(", ");
    } else {
      // 기존 JSON 배열 형태 처리
      console.log("JSON 배열 형태로 받음 - 기존 방식으로 처리합니다.");

      // 시간표 데이터를 파싱 (selectedSlots 배열 형태)
      const mySlots = JSON.parse(myTimeTable) as string[];
      const opponentSlots = JSON.parse(opponentTimeTable) as string[];

      if (!Array.isArray(mySlots) || !Array.isArray(opponentSlots)) {
        console.log("시간표가 배열 형태가 아닙니다");
        return "시간 협의 가능";
      }

      // 겹치는 시간대 찾기
      const commonSlots = mySlots.filter((slot) =>
        opponentSlots.includes(slot),
      );

      if (commonSlots.length === 0) {
        return "겹치는 시간이 없습니다";
      }

      // 시간대를 그룹화하여 연속된 시간으로 표시
      const timeGroups = groupConsecutiveSlots(commonSlots);

      // 시간대를 읽기 쉬운 형태로 변환
      const timeStrings = timeGroups.map((group) => {
        const firstSlot = group[0];
        const lastSlot = group[group.length - 1];
        return formatTimeRange(firstSlot, lastSlot);
      });

      return timeStrings.join(", ");
    }
  } catch (err) {
    console.error("시간표 파싱 오류:", err);
    return "시간 협의 가능";
  }
};

// 연속된 시간대를 그룹화하는 함수
const groupConsecutiveSlots = (slots: string[]): string[][] => {
  // 요일별, 시간대별로 정렬
  const sortedSlots = slots.sort((a, b) => {
    const [dayA, timeA] = a.split("-").map(Number);
    const [dayB, timeB] = b.split("-").map(Number);

    // 먼저 요일로 정렬
    if (dayA !== dayB) {
      return dayA - dayB;
    }
    // 같은 요일이면 시간대로 정렬
    return timeA - timeB;
  });

  const groups: string[][] = [];
  let currentGroup: string[] = [];

  for (const slot of sortedSlots) {
    if (currentGroup.length === 0) {
      currentGroup = [slot];
    } else {
      const lastSlot = currentGroup[currentGroup.length - 1];
      if (isConsecutive(lastSlot, slot)) {
        currentGroup.push(slot);
      } else {
        groups.push([...currentGroup]);
        currentGroup = [slot];
      }
    }
  }

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
};

// 두 시간대가 연속되는지 확인하는 함수
const isConsecutive = (slot1: string, slot2: string): boolean => {
  const [day1, time1] = slot1.split("-").map(Number);
  const [day2, time2] = slot2.split("-").map(Number);

  // 같은 요일이고 시간이 연속되는 경우
  if (day1 === day2 && time2 === time1 + 1) {
    return true;
  }

  // 다음 요일의 첫 시간인 경우 (time1이 마지막 시간, time2가 첫 시간)
  if (day2 === day1 + 1 && time1 === 21 && time2 === 0) {
    // 19:30 -> 다음날 9:00
    return true;
  }

  return false;
};

// 시간대를 읽기 쉬운 형태로 변환하는 함수
const formatTimeRange = (firstSlot: string, lastSlot: string): string => {
  const days = ["월", "화", "수", "목", "금", "토", "일"];
  const [dayIndex, timeIndex] = firstSlot.split("-").map(Number);
  const [lastDayIndex, lastTimeIndex] = lastSlot.split("-").map(Number);

  const day = days[dayIndex];
  const startTime = formatTime(timeIndex);
  const endTime = formatTime(lastTimeIndex + 1); // 마지막 시간대의 끝 시간

  if (dayIndex === lastDayIndex) {
    return `${day} ${startTime}-${endTime}`;
  } else {
    return `${day} ${startTime}~${days[lastDayIndex]} ${endTime}`;
  }
};

// 시간 인덱스를 실제 시간으로 변환하는 함수
const formatTime = (timeIndex: number): string => {
  const hour = Math.floor(timeIndex / 2) + 9;
  const minute = timeIndex % 2 === 0 ? "00" : "30";
  return `${hour}:${minute}`;
};
