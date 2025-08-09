/*
 * author : 앨리스/박은지
 * description : [커피챗 일정 등록] 장소 입력 섹션
 */

import React from "react";
import type { ScheduleFormValues } from "./ScheduleForm";

interface PlaceInputSectionProps {
  values: ScheduleFormValues;
  onChange: (values: ScheduleFormValues) => void;
}

const PlaceInputSection: React.FC<PlaceInputSectionProps> = ({
  values,
  onChange,
}) => {
  return (
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
  );
};

export default PlaceInputSection;
