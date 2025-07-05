import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

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
  showTimeDropdown?: boolean;
  completeLabel?: string;
  cancelLabel?: string;
}

const alertOptions = ["5분 전", "15분 전", "30분 전", "1시간 전"];
const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, "0");
  const m = i % 2 === 0 ? "00" : "30";
  return `${h}:${m}`;
});
timeOptions.push("직접 입력");

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  values,
  onChange,
  onComplete,
  onCancel,
  showTimeDropdown = false,
  completeLabel = "완료",
  cancelLabel = "취소",
}) => {
  const [showCalendarPicker, setShowCalendarPicker] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const [isCustomTime, setIsCustomTime] = React.useState(false);
  const [customTime, setCustomTime] = React.useState("");
  const calendarRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운/캘린더 닫기
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendarPicker(false);
      }
    }
    if (openDropdown || showCalendarPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown, showCalendarPicker]);

  // Handle time change
  const handleTimeChange = (time: string) => {
    onChange({ ...values, time });
  };

  // Handle custom time input
  const handleCustomTimeBlur = () => {
    handleTimeChange(customTime);
    setIsCustomTime(false);
  };

  return (
    <div>
      {/* 날짜 선택 */}
      <div className="mb-3">
        <div className="mb-1 text-sm font-semibold">날짜</div>
        <div className="relative" ref={calendarRef}>
          <button
            className="flex w-full items-center justify-between rounded border bg-white px-3 py-3 text-left text-sm text-gray-900"
            onClick={() => setShowCalendarPicker((prev) => !prev)}
            type="button"
          >
            <span className={values.date ? "text-gray-900" : "text-gray-400"}>
              {values.date
                ? values.date instanceof Date
                  ? values.date.toLocaleDateString()
                  : values.date
                : "날짜를 선택해주세요"}
            </span>
            <span className="ml-2">▼</span>
          </button>
          {showCalendarPicker && (
            <div
              className="absolute top-full right-0 left-0 z-30 mt-1 rounded border bg-white p-2 shadow"
              style={{
                width: "100%",
                minWidth: 0,
                maxWidth: "100%",
                boxSizing: "border-box",
              }}
            >
              <DayPicker
                mode="single"
                selected={values.date instanceof Date ? values.date : undefined}
                onSelect={(selected) => {
                  onChange({ ...values, date: selected });
                  setShowCalendarPicker(false);
                }}
                className="w-full"
                style={{ width: "100%" }}
              />
            </div>
          )}
        </div>
      </div>
      {/* 시간 선택 */}
      <div className="mb-3">
        <div className="mb-1 text-sm font-semibold">시간</div>
        {showTimeDropdown ? (
          <div className="relative" ref={dropdownRef}>
            {!isCustomTime ? (
              <button
                className="flex w-full items-center justify-between rounded border bg-white px-3 py-3 text-left text-sm text-gray-500"
                onClick={() => setOpenDropdown((prev) => !prev)}
                type="button"
              >
                <span
                  className={values.time ? "text-gray-900" : "text-gray-400"}
                >
                  {values.time ? values.time : "시간을 선택해주세요"}
                </span>
                <span className="ml-2">▼</span>
              </button>
            ) : (
              <input
                className="w-full rounded border px-3 py-3 text-sm text-gray-900"
                type="text"
                placeholder="직접 입력 (예: 15:10)"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                onBlur={handleCustomTimeBlur}
                autoFocus
              />
            )}
            {openDropdown && !isCustomTime && (
              <div className="absolute top-full right-0 left-0 z-20 mt-1 max-h-60 overflow-y-auto rounded border bg-white shadow">
                {timeOptions.map((opt) => (
                  <button
                    key={opt}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    onClick={() => {
                      if (opt === "직접 입력") {
                        setIsCustomTime(true);
                        setOpenDropdown(false);
                        setCustomTime("");
                        handleTimeChange("");
                      } else {
                        handleTimeChange(opt);
                        setIsCustomTime(false);
                        setOpenDropdown(false);
                      }
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <input
            type="time"
            className="w-full rounded border px-3 py-2 text-sm"
            value={values.time}
            onChange={(e) => handleTimeChange(e.target.value)}
            placeholder="시간을 선택해주세요"
          />
        )}
      </div>
      {/* 장소 입력 */}
      <div className="mb-5">
        <div className="mb-1 text-sm font-semibold">장소</div>
        <input
          type="text"
          className="w-full rounded border bg-white px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400"
          value={values.place}
          onChange={(e) => onChange({ ...values, place: e.target.value })}
          placeholder="어디서 만날까요?"
        />
      </div>
      {/* 약속 전 알림 */}
      <div className="mb-2 text-sm font-semibold">약속 전 알림</div>
      <div className="mb-2 text-xs text-gray-500">
        까먹지 않기 위해 알림을 설정해두는 걸 추천해요!
      </div>
      <div className="mb-6 flex gap-2">
        {alertOptions.map((option) => (
          <button
            key={option}
            className={`rounded border bg-gray-200 px-3 py-1 text-xs font-semibold ${values.alert === option ? "border-gray-500 bg-gray-500 text-white" : "border-transparent text-gray-700"}`}
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
      </div>
      {/* 완료/취소 버튼 */}
      <div className="flex gap-2">
        {onCancel && (
          <button
            className="flex-1 rounded bg-gray-200 py-2 text-base font-bold text-gray-700"
            onClick={onCancel}
            type="button"
          >
            {cancelLabel}
          </button>
        )}
        {onComplete && (
          <button
            className="flex-1 rounded bg-gray-300 py-2 text-base font-bold text-gray-700"
            onClick={onComplete}
            type="button"
          >
            {completeLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default ScheduleForm;
