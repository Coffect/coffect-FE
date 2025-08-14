/*
 * author : 앨리스/박은지
 * description : [커피챗 일정 등록] 날짜 선택 섹션
 * 날짜 선택 버튼, 날짜 선택 모달 열기/닫기
 */

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { formatDateToKorean } from "./hooks/useDatePicker";
import { useDatePicker } from "./hooks/useDatePicker";
import type { ScheduleFormValues } from "./ScheduleForm";

interface DatePickerSectionProps {
  values: ScheduleFormValues;
  onChange: (values: ScheduleFormValues) => void;
}

const DatePickerSection: React.FC<DatePickerSectionProps> = ({
  values,
  onChange,
}) => {
  const { showCalendarPicker, setShowCalendarPicker } = useDatePicker();

  return (
    <div className="mb-8">
      <div className="mt-5 mb-2 text-[18px] font-semibold text-[var(--gray-80)]">
        언제 만날까요?
      </div>
      <button
        className="flex w-full items-center justify-between rounded-[10px] border-[1.5px] border-[var(--gray-10)] bg-[var(--white)] px-4 py-3 text-left text-[18px] font-medium text-[var(--gray-80)]"
        type="button"
        onClick={() => setShowCalendarPicker(true)}
      >
        <span
          className={
            values.date
              ? "font-medium text-[var(--gray-80)]"
              : "font-medium text-[var(--gray-40)]"
          }
        >
          {values.date ? formatDateToKorean(values.date) : ""}
        </span>
        <span className="ml-2 text-lg text-[var(--gray-40)]">
          <Calendar size={20} />
        </span>
      </button>
      {showCalendarPicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCalendarPicker(false);
          }}
        >
          <div className="relative">
            <DatePicker
              selected={values.date instanceof Date ? values.date : undefined}
              onChange={(date) => {
                onChange({ ...values, date: date || undefined });
                setShowCalendarPicker(false);
              }}
              inline
              minDate={new Date()}
              calendarClassName="iphone-calendar"
              dayClassName={(date) => {
                const selected =
                  values.date instanceof Date &&
                  date.getDate() === values.date.getDate() &&
                  date.getMonth() === values.date.getMonth() &&
                  date.getFullYear() === values.date.getFullYear();
                if (selected) {
                  return "custom-selected-day";
                }
                if (!values.date) {
                  const today = new Date();
                  const isToday =
                    date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();
                  return isToday ? "custom-selected-day" : "";
                }
                return "";
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePickerSection;
