import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScheduleForm from "./ScheduleForm";
import type { ScheduleFormValues } from "./ScheduleForm";
import ScheduleCompleteModal from "./ScheduleCompleteModal";

const Schedule: React.FC = () => {
  const [form, setForm] = useState<ScheduleFormValues>({
    date: undefined,
    time: "",
    place: "",
    alert: null,
  });
  const [showComplete, setShowComplete] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center bg-white">
      <div className="relative mx-auto w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <button
          className="absolute top-4 left-0 z-10 text-2xl"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        ></button>
        <div className="mt-8 mb-6 flex items-center justify-center gap-2 text-lg font-bold">
          김하은님과의 커피챗
        </div>
      </div>
      <div className="mx-auto w-full max-w-md px-4 sm:max-w-lg sm:px-8 md:max-w-xl lg:max-w-2xl">
        <ScheduleForm
          values={form}
          onChange={setForm}
          showTimeDropdown={true}
          onComplete={() => setShowComplete(true)}
        />
        {showComplete && (
          <ScheduleCompleteModal
            date={
              form.date
                ? form.date instanceof Date
                  ? form.date.toLocaleDateString()
                  : form.date
                : ""
            }
            time={form.time}
            onClose={() => setShowComplete(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Schedule;
