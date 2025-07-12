import React from "react";
import { AlertTriangle } from "lucide-react";

interface DeleteScheduleModalProps {
  date: string;
  time: string;
  onDelete: () => void;
  onClose: () => void;
}

const DeleteScheduleModal: React.FC<DeleteScheduleModalProps> = ({
  date,
  time,
  onDelete,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="mx-auto flex w-[90%] flex-col items-center rounded-2xl bg-white px-5 py-6 shadow-lg">
        <AlertTriangle size={50} className="mt-3 mb-3 text-[#E44545]" />
        <span className="mt-1 mb-3 text-[19px] font-bold">
          {date} {time}
        </span>
        <div className="mb-9 text-center text-sm font-bold text-gray-900">
          커피챗 일정을 정말 삭제하시겠어요?
        </div>
        <div className="flex w-full gap-2">
          <button
            className="flex-1 rounded-lg bg-[#333] text-sm font-bold text-white"
            onClick={onDelete}
          >
            삭제하기
          </button>
          <button
            className="flex-1 rounded-lg border border-gray-400 bg-white py-3 text-sm font-bold text-gray-700"
            onClick={onClose}
          >
            창 닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteScheduleModal;
