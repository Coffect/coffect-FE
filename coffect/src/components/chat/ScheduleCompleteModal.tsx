import React from "react";
import { Calendar } from "lucide-react";

interface ScheduleCompleteModalProps {
  date: string;
  time: string;
  onClose: () => void;
}

// 날짜를 한글 형식으로 변환하는 함수
function formatKoreanDate(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const week = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  const dayOfWeek = week[date.getDay()];
  return `${month}월 ${day}일 ${dayOfWeek}`;
}

const ScheduleCompleteModal: React.FC<ScheduleCompleteModalProps> = ({
  date,
  time,
  onClose,
}) => {
  return (
    <div className="bg-opacity-30 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-60 rounded-lg border bg-white p-3 shadow-lg">
        <div className="flex flex-col items-center">
          {/* 달력 아이콘 */}
          <div className="p-3">
            <span role="img" aria-label="calendar" style={{ fontSize: 40 }}>
              <Calendar />
            </span>
          </div>
          <div className="mb-5 text-center text-base font-bold">
            {formatKoreanDate(date)} {time}
            <br />
            커피챗 일정을 만들었어요!
          </div>
          <div className="text-center text-xs text-gray-500">
            대화창 상단과 홈화면 상단 캘린더 아이콘에서
            <br />
            언제나 일정 확인 및 수정이 가능해요!
          </div>
          <button
            className="mt-7 w-full rounded bg-gray-800 py-2 text-xs font-bold text-white hover:bg-gray-700"
            onClick={onClose}
          >
            확인했어요!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCompleteModal;
