// author : 앨리스/박은지
// description : [커피챗 일정 등록] 폼 컴포넌트
// 날짜, 시간, 장소, 약속 전 알림 설정 입력 필드 및 완료/취소 버튼

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { Clock } from "lucide-react";
import "../../assets/styles/chat-calendar.css";
import TimeScrollModal from "./TimeScrollModal";

export interface ScheduleFormValues {
  date: Date | string | undefined;
  time: string;
  place: string;
  alert: string | null;
}

export interface ScheduleFormProps {
  values: ScheduleFormValues;
  onChange: (values: ScheduleFormValues) => void;
  onComplete?: () => void;
  onCancel?: () => void;
  completeLabel?: string;
  cancelLabel?: string;
}

// 날짜를 한국어 형식으로 포맷팅하는 함수
const formatDateToKorean = (date: Date | string | undefined): string => {
  if (!date) return "";
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return "";
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  return `${year}년 ${month}월 ${day}일`;
};

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  values,
  onChange,
  onComplete,
  onCancel,
  completeLabel = "완료",
  cancelLabel = "취소",
}) => {
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const isCompleteEnabled = Boolean(
    values.date && values.time && values.place.trim().length > 0,
  );

  // 시간 값을 파싱해서 TimeScrollModal에 넘길 초기값 생성
  let initialTime = undefined;
  if (values.time) {
    const match = values.time.match(/(\d{1,2}):(\d{2})\s?(AM|PM)?/i);
    if (match) {
      initialTime = {
        hour: Number(match[1]),
        minute: match[2],
        ampm: match[3] || "AM",
      };
    }
  }

  return (
    <div className="flex h-full flex-col pb-2">
      {/* 날짜 선택 */}
      <div className="mb-8">
        <div className="mt-5 mb-2 text-base font-extrabold text-[var(--gray-80)]">
          언제 만날까요?
        </div>
        <button
          className="flex w-full items-center justify-between rounded-lg border-2 border-[var(--gray-10)] bg-[var(--white)] px-4 py-3 text-left text-[15px] text-[var(--gray-90)]"
          type="button"
          onClick={() => setShowCalendarPicker(true)}
        >
          <span
            className={
              values.date
                ? "font-extrabold text-[var(--gray-80)]"
                : "text-[var(--gray-40)]"
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
      {/* 시간 선택 */}
      <div className="mb-2 flex items-center justify-between">
        <div className="text-base font-extrabold text-[var(--gray-80)]">
          몇 시에 만날까요?
        </div>
      </div>
      <button
        className="mb-8 flex w-full items-center justify-between rounded-lg border-2 border-[var(--gray-10)] bg-[var(--white)] px-4 py-3 text-left text-[16px] font-extrabold text-[var(--gray-80)]"
        type="button"
        onClick={() => setShowTimeModal(true)}
      >
        <span className="text-left">{values.time ? values.time : ""}</span>
        <Clock size={20} className="ml-2 text-[var(--gray-40)]" />
      </button>
      <TimeScrollModal
        open={showTimeModal}
        onClose={() => setShowTimeModal(false)}
        onSelect={(val) => {
          onChange({ ...values, time: val });
        }}
        initial={initialTime}
      />
      {/* 장소 입력 */}
      <div className="mb-10">
        <div className="mb-2 text-base font-extrabold text-[var(--gray-80)]">
          어디에서 만날까요?
        </div>
        <input
          type="text"
          className="w-full rounded-lg border-2 border-[var(--gray-10)] bg-[var(--white)] px-4 py-3 text-[16px] font-medium text-[var(--gray-80)] placeholder:text-[var(--gray-30)]"
          value={values.place}
          onChange={(e) => onChange({ ...values, place: e.target.value })}
          placeholder="장소를 입력해주세요"
        />
      </div>
      {/* 약속 전 알림 */}
      <div className="text-lg font-extrabold text-[var(--gray-90)]">
        약속 전 알림 설정
      </div>
      <div className="mb-2 text-xs font-semibold text-[var(--gray-50)]">
        까먹지 않게 알림을 보내드려요!
      </div>
      <div className="mb-6 flex flex-wrap justify-start gap-x-1 gap-y-2">
        {["5분 전", "15분 전", "30분 전", "1시간 전"].map((option) => (
          <button
            key={option}
            className={`min-w-[80px] rounded-3xl border px-4 py-3 text-[15px] font-medium transition-all duration-100 ${values.alert === option ? "bg-[var(--gray-70)] text-[var(--white)]" : "border-[var(--gray-30)] bg-[var(--white)] text-[var(--gray-70)]"}`}
            onClick={() =>
              onChange({
                ...values,
                alert: values.alert === option ? null : option,
              })
            }
            type="button"
          >
            {option}
          </button>
        ))}
        <button
          className={`min-w-[90px] rounded-3xl border border-[var(--gray-30)] px-4 py-3 text-[15px] font-medium transition-all duration-100 ${!values.alert ? "bg-[var(--gray-70)] text-[var(--white)]" : "bg-[var(--white)] text-[var(--gray-70)]"}`}
          onClick={() => onChange({ ...values, alert: null })}
          type="button"
        >
          괜찮아요
        </button>
      </div>
      {/* 완료/취소 버튼 */}
      <div className="mt-auto flex w-full min-w-0 flex-nowrap justify-end gap-3 px-0 pb-4">
        {onCancel && (
          <button
            className={
              cancelLabel === "일정 삭제하기"
                ? "basis-2/5 rounded-xl border-2 border-[var(--noti)] bg-[var(--white)] py-3 text-sm font-bold text-[var(--noti)]"
                : "flex-1 rounded-lg bg-[var(--gray-20)] py-3 text-base font-bold text-[var(--gray-70)]"
            }
            style={cancelLabel === "일정 삭제하기" ? { minWidth: 0 } : {}}
            onClick={onCancel}
            type="button"
          >
            {cancelLabel}
          </button>
        )}
        {onComplete && (
          <button
            className={
              completeLabel === "수정하기"
                ? `basis-3/5 rounded-xl bg-[var(--gray-80)] py-3 text-sm font-bold text-[var(--white)]`
                : `flex-1 rounded-lg py-3 text-base font-bold transition-colors duration-100 ${isCompleteEnabled ? "bg-[var(--gray-70)] text-[var(--white)]" : "bg-[var(--gray-10)] text-[var(--gray-50)]"}`
            }
            style={completeLabel === "수정하기" ? { minWidth: 0 } : {}}
            onClick={isCompleteEnabled ? onComplete : undefined}
            type="button"
            disabled={!isCompleteEnabled}
          >
            {completeLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default ScheduleForm;
