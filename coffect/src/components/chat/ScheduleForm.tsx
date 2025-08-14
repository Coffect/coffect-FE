/*
 * author : 앨리스/박은지
 * description : [커피챗 일정 등록] 폼 컴포넌트
 * 날짜, 시간, 장소, 약속 전 알림 설정 입력 필드 및 완료/취소 버튼
 */

import React from "react";
import "../../assets/styles/chat-calendar.css";
import { useScheduleForm } from "./hooks/useScheduleForm";
import DatePickerSection from "./DatePickerSection";
import TimePickerSection from "./TimePickerSection";
import PlaceInputSection from "./PlaceInputSection";

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

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  values,
  onChange,
  onComplete,
  onCancel,
  completeLabel = "완료",
  cancelLabel = "취소",
}) => {
  const { isCompleteEnabled } = useScheduleForm(values);

  return (
    <div className="flex h-full flex-col pb-2">
      <DatePickerSection values={values} onChange={onChange} />
      <TimePickerSection values={values} onChange={onChange} />
      <PlaceInputSection values={values} onChange={onChange} />
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
