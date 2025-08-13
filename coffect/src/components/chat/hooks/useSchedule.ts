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

export const useSchedule = (): { schedule: Schedule | null } => {
  const location = useLocation();

  const schedule = useMemo(() => {
    const state = location.state as { schedule?: Schedule } | null;
    const s = state?.schedule;
    if (!s) return null;
    return {
      date: s.date,
      time: s.time,
      place: s.place ?? "",
      alert: s.alert ?? null,
    };
  }, [location.state]);

  return { schedule };
};
