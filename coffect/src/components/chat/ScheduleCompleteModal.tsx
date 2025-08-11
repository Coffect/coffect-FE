// author : 앨리스/박은지
// description : [커피챗 일정 등록 완료] 모달 컴포넌트
// 날짜를 한글로 표시

import React from "react";
import ScheduleCompleteImg from "../../assets/icon/chat/ScheduleComplete.png";
import { formatKoreanDate, formatAmPmTo24Hour } from "../../utils/dateUtils";

interface ScheduleCompleteModalProps {
  date: string;
  time: string;
  onClose: () => void;
}

const ScheduleCompleteModal: React.FC<ScheduleCompleteModalProps> = ({
  date,
  time,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)]">
      <div className="mx-auto flex w-[80%] max-w-[340px] min-w-[200px] flex-col items-center">
        <div className="flex w-full flex-col items-center rounded-[20px] rounded-b-none bg-[var(--white)] px-6 pt-10 pb-3">
          <div className="mb-1.5 text-center text-[16px] leading-tight font-semibold text-[var(--gray-90)]">
            {formatKoreanDate(date)} {formatAmPmTo24Hour(time)}
          </div>
          <div className="mb-1.5 text-center text-[16px] leading-tight font-semibold text-[var(--gray-90)]">
            커피챗 일정이 만들어졌어요!
          </div>
          <div className="mb-3 text-center text-[14px] font-medium text-[var(--gray-50)]">
            언제나 일정 확인 및 수정이 가능해요
          </div>
          <img
            src={ScheduleCompleteImg}
            alt="일정 완료"
            className="mb-4 h-[100px] w-[100px] object-contain"
          />
        </div>
        <button
          className="w-full rounded-[20px] rounded-t-none bg-[var(--gray-80)] py-4 text-[16px] font-semibold text-[var(--white)]"
          onClick={onClose}
        >
          확인했어요
        </button>
      </div>
    </div>
  );
};

export default ScheduleCompleteModal;
