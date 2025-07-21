// author : 앨리스/박은지
// description : [커피챗 일정 등록] 폼 컴포넌트
// 날짜, 시간, 장소, 약속 전 알림 설정 입력 필드 및 완료/취소 버튼

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, ChevronDown } from "lucide-react";
import "../../assets/styles/chat-calendar.css";

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

  // 시간 값이 변경될 때(드롭다운/직접입력 등) 호출
  const handleTimeChange = (time: string) => {
    onChange({ ...values, time });
  };

  // 시간 형식 검증 함수
  const validateTimeFormat = (time: string): boolean => {
    const timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
    return timeRegex.test(time);
  };

  const handleCustomTimeBlur = () => {
    if (customTime.trim() && validateTimeFormat(customTime.trim())) {
      handleTimeChange(customTime.trim());
    }
    setIsCustomTime(false);
  };

  // 완료 버튼 활성화 조건
  const isCompleteEnabled = Boolean(
    values.date && values.time && values.place.trim().length > 0,
  );

  return (
    <div className="flex h-full flex-col pb-2">
      {/* 날짜 선택 */}
      <div className="mb-8">
        <div className="mt-5 mb-2 text-base font-extrabold text-[var(--gray-80)]">
          언제 만날까요?
        </div>
        <div className="relative" ref={calendarRef}>
          <DatePicker
            selected={undefined}
            onChange={(date) => {
              onChange({ ...values, date: date || undefined });
              setShowCalendarPicker(false);
            }}
            open={showCalendarPicker}
            onInputClick={() => setShowCalendarPicker(true)}
            onClickOutside={() => setShowCalendarPicker(false)}
            dateFormat="M월 d일"
            className="w-full"
            wrapperClassName="w-full"
            popperClassName="z-50"
            popperPlacement="bottom-start"
            minDate={new Date()}
            customInput={
              <button
                className="flex w-full items-center justify-between rounded-lg border-2 border-[var(--gray-10)] bg-[var(--white)] px-4 py-3 text-left text-[15px] text-[var(--gray-90)]"
                type="button"
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
            }
            calendarClassName="iphone-calendar"
            dayClassName={(date) => {
              // 정확히 같은 날짜(년, 월, 일)일 때만 선택된 상태로 표시
              const selected =
                values.date instanceof Date &&
                date.getDate() === values.date.getDate() &&
                date.getMonth() === values.date.getMonth() &&
                date.getFullYear() === values.date.getFullYear();

              // 선택된 날짜가 있으면 해당 날짜를 주황색으로, 없으면 오늘 날짜를 주황색으로
              if (selected) {
                return "custom-selected-day";
              }

              // 선택된 날짜가 없을 때 오늘 날짜를 주황색으로 표시
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
            showPopperArrow={false}
            inline={false}
            closeOnScroll={false}
            shouldCloseOnSelect={true}
            openToDate={values.date instanceof Date ? values.date : new Date()}
          />
        </div>
      </div>
      {/* 시간 선택 */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-base font-extrabold text-[var(--gray-80)]">
            몇 시에 만날까요?
          </div>
          {customTime.trim() && !validateTimeFormat(customTime.trim()) && (
            <div className="mt-1 text-xs text-[var(--noti)]">
              올바른 형식으로 입력해주세요.
            </div>
          )}
        </div>
        {showTimeDropdown ? (
          <div className="relative" ref={dropdownRef}>
            {!isCustomTime ? (
              <button
                className={
                  "flex w-full items-center justify-between rounded-lg border-2 border-[var(--gray-10)] bg-[var(--white)] px-4 py-3 text-left text-[15px] font-extrabold text-[var(--gray-80)]" +
                  (openDropdown && !isCustomTime
                    ? " rounded-b-none border-b-1"
                    : "")
                }
                onClick={() => setOpenDropdown((prev) => !prev)}
                type="button"
              >
                <span
                  className={
                    values.time
                      ? "font-extrabold text-[var(--gray-80)]"
                      : "text-[var(--gray-40)]"
                  }
                >
                  {values.time ? values.time : ""}
                </span>
                <span className="ml-2 text-lg text-[var(--gray-40)]">
                  <ChevronDown size={20} />
                </span>
              </button>
            ) : (
              <input
                className="w-full rounded-lg border border-[var(--gray-10)] px-4 py-3 text-[16px] font-extrabold text-[var(--gray-80)]"
                type="text"
                placeholder="직접 입력 (예: 15:30)"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                onBlur={handleCustomTimeBlur}
                autoFocus
              />
            )}
            {openDropdown && !isCustomTime && (
              <div className="absolute top-full right-0 left-0 z-20 max-h-60 overflow-y-auto rounded-lg rounded-t-none border-2 border-t-0 border-[var(--gray-10)] bg-[var(--white)] shadow">
                {timeOptions.map((opt) => (
                  <button
                    key={opt}
                    className="w-full px-4 py-2 text-left text-[15px] hover:bg-[var(--gray-100)]"
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
            className="w-full rounded-lg border border-[var(--gray-10)] px-4 py-4 text-[15px] font-extrabold text-[var(--gray-80)]"
            value={values.time}
            onChange={(e) => handleTimeChange(e.target.value)}
            placeholder="시간을 선택해주세요"
          />
        )}
      </div>
      {/* 장소 입력 */}
      <div className="mb-10">
        <div className="mb-2 text-base font-extrabold text-[var(--gray-80)]">
          어디에서 만날까요?
        </div>
        <input
          type="text"
          className="w-full rounded-lg border-2 border-[var(--gray-10)] bg-[var(--white)] px-4 py-3 text-[16px] font-extrabold text-[var(--gray-80)] placeholder:text-[var(--gray-30)]"
          value={values.place}
          onChange={(e) => onChange({ ...values, place: e.target.value })}
          placeholder="장소를 입력해주세요"
        />
      </div>
      {/* 약속 전 알림 */}
      <div className="text-lg font-extrabold text-[var(--gray-90)]">
        약속 전 알림 설정
      </div>
      <div className="mb-5 text-xs font-semibold text-[var(--gray-50)]">
        까먹지 않게 알림을 보내드려요!
      </div>
      <div className="mb-6 flex flex-wrap justify-start gap-x-1 gap-y-2">
        {alertOptions.map((option) => (
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
