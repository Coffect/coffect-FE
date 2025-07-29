// author : 앨리스/박은지
// description : [커피챗 일정 등록] 시간 선택 섹션
// 시간 선택 버튼, 시간 선택 모달 열기/닫기

import React from "react";
import { Clock } from "lucide-react";
import TimeScrollModal from "./TimeScrollModal";
import { useTimePicker } from "./hooks/useTimePicker";
import type { ScheduleFormValues } from "./ScheduleForm";

interface TimePickerSectionProps {
  values: ScheduleFormValues;
  onChange: (values: ScheduleFormValues) => void;
}

const TimePickerSection: React.FC<TimePickerSectionProps> = ({
  values,
  onChange,
}) => {
  const { showTimeModal, setShowTimeModal, initialTime } = useTimePicker(
    values.time,
  );

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-base font-semibold text-[var(--gray-80)]">
          몇 시에 만날까요?
        </div>
      </div>
      <button
        className="mb-8 flex w-full items-center justify-between rounded-lg border-[1.5px] border-[var(--gray-10)] bg-[var(--white)] px-4 py-3 text-left text-[16px] font-semibold text-[var(--gray-80)]"
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
    </>
  );
};

export default TimePickerSection;
