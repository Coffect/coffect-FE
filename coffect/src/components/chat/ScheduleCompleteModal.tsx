// author : 앨리스/박은지
// description : [커피챗 일정 등록 완료] 모달 컴포넌트
// 날짜를 한글로 표시

import React from "react";
import ScheduleCompleteImg from "../../assets/icon/chat/ScheduleComplete.png";
import { formatKoreanDate } from "../../utils/dateUtils";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="mx-auto flex w-[90%] max-w-[340px] min-w-[200px] flex-col items-center">
        <div className="flex w-full flex-col items-center rounded-2xl rounded-b-none bg-white px-6 pt-10 pb-3">
          <div className="mb-2 text-center text-base leading-snug font-extrabold text-gray-900">
            {formatKoreanDate(date)} {time}
          </div>
          <div className="mb-3 text-center text-base leading-snug font-extrabold text-gray-900">
            커피챗 일정이 만들어졌어요!
          </div>
          <div className="mb-2 text-center text-xs font-bold text-gray-500">
            언제나 일정 확인 및 수정이 가능해요
          </div>
          <img
            src={ScheduleCompleteImg}
            alt="일정 완료"
            className="mt-4 h-[100px] w-[100px] object-contain"
          />
        </div>
        <button
          className="w-full rounded-2xl rounded-t-none bg-[rgba(45,45,45,1)] py-3 text-base font-extrabold text-white"
          onClick={onClose}
        >
          확인했어요
        </button>
      </div>
    </div>
  );
};

export default ScheduleCompleteModal;
