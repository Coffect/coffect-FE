// author : 앨리스/박은지
/*
 * description : [커피챗 일정 등록] 일정 등록 폼 훅
 */

import { useState } from "react";
import type { ScheduleFormValues } from "../ScheduleForm";

export const useScheduleForm = (values: ScheduleFormValues) => {
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);

  const isCompleteEnabled = Boolean(
    values.date && values.time && values.place.trim().length > 0,
  );

  return {
    showCalendarPicker,
    setShowCalendarPicker,
    showTimeModal,
    setShowTimeModal,
    isCompleteEnabled,
  };
};
