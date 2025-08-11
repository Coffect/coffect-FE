/*
 * author : 앨리스/박은지
 * description : 채팅방 일정 정보 훅
 */

import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export interface Schedule {
  date: string | Date;
  time: string;
  place?: string;
  alert?: string | null;
}

export const useSchedule = () => {
  const location = useLocation();

  const schedule = useMemo(() => {
    const s = location.state?.schedule;
    if (!s) return null;
    return {
      date: s.date,
      time: s.time,
      place: s.place ?? "",
      alert: s.alert ?? null,
    };
  }, [location.state?.schedule]);

  return { schedule };
};
