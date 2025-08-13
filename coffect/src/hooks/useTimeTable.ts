import { useState, useEffect, useCallback } from "react";
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

      console.log("시간표 API 응답:", response.data);

      if (
        response.data.resultType === "SUCCESS" &&
        response.data.success &&
        typeof response.data.success === "string"
      ) {
        setTimeTable(response.data.success);
      } else {
        setError("시간표를 불러올 수 없습니다.");
      }
    } catch (err) {
      console.error("시간표 조회 실패:", err);
      setError("시간표를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTimeTable();
  }, [fetchTimeTable]);

  return {
    timeTable,
    loading,
    error,
    refetch: fetchTimeTable,
  };
};

// 두 사용자의 시간표를 비교하는 훅
export const useTimeTableComparison = (
  myUserId: number,
  opponentUserId: number,
) => {
  const [commonFreeTime, setCommonFreeTime] =
    useState<string>("시간 협의 가능");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { timeTable: myTimeTable, loading: myLoading } = useTimeTable(myUserId);
  const { timeTable: opponentTimeTable, loading: opponentLoading } =
    useTimeTable(opponentUserId);

  useEffect(() => {
    const compareTimeTables = async () => {
      if (!myTimeTable || !opponentTimeTable) {
        setCommonFreeTime("시간 협의 가능");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 두 시간표를 비교해서 겹치는 공강 시간 계산
        const commonTime = getCommonFreeTime(myTimeTable, opponentTimeTable);
        setCommonFreeTime(commonTime);
        console.log("겹치는 공강 시간:", commonTime);
      } catch (err) {
        console.error("시간표 비교 실패:", err);
        setError("시간표 비교 중 오류가 발생했습니다.");
        setCommonFreeTime("시간 협의 가능");
      } finally {
        setLoading(false);
      }
    };

    compareTimeTables();
  }, [myTimeTable, opponentTimeTable]);

  return {
    commonFreeTime,
    loading: loading || myLoading || opponentLoading,
    error,
    myTimeTable,
    opponentTimeTable,
  };
};

// 두 사용자의 겹치는 공강 시간을 계산하는 함수
export const getCommonFreeTime = (
  myTimeTable: string,
  opponentTimeTable: string,
): string => {
  try {
    // 시간표 데이터를 파싱 (selectedSlots 배열 형태)
    const mySlots = JSON.parse(myTimeTable) as string[];
    const opponentSlots = JSON.parse(opponentTimeTable) as string[];

    if (!Array.isArray(mySlots) || !Array.isArray(opponentSlots)) {
      return "시간 협의 가능";
    }

    // 겹치는 시간대 찾기
    const commonSlots = mySlots.filter((slot) => opponentSlots.includes(slot));

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
  } catch (err) {
    console.error("시간표 파싱 오류:", err);
    return "시간 협의 가능";
  }
};

// 연속된 시간대를 그룹화하는 함수
const groupConsecutiveSlots = (slots: string[]): string[][] => {
  const sortedSlots = slots.sort();
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
