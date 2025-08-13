// author : 앨리스/박은지
/*
 * description : [커피챗 일정 등록] 일정 등록 폼 훅
 */

import { useState } from "react";
import type { ScheduleFormValues } from "../ScheduleForm";
import { axiosInstance } from "../../../api/axiosInstance";

export const useScheduleForm = (values: ScheduleFormValues) => {
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);

  const isCompleteEnabled = Boolean(
    values.date && values.time && values.place.trim().length > 0,
  );

  // 커피챗 일정 등록 API 함수
  const fixCoffeeChatSchedule = async (scheduleData: {
    time: string;
    location: string;
    coffeeDate: string;
    coffectId: number;
  }) => {
    const response = await axiosInstance.patch(
      "/home/fixCoffeeChatSchedule",
      scheduleData,
    );
    return response.data;
  };

  return {
    showCalendarPicker,
    setShowCalendarPicker,
    showTimeModal,
    setShowTimeModal,
    isCompleteEnabled,
    fixCoffeeChatSchedule,
  };
};
