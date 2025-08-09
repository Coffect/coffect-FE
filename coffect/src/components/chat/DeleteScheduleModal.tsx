import React from "react";
import { formatAmPmTo24Hour } from "../../utils/dateUtils";

interface DeleteScheduleModalProps {
  scheduleText: string;
  onDelete: () => void;
  onCancel: () => void;
}

const DeleteScheduleModal: React.FC<DeleteScheduleModalProps> = ({
  scheduleText,
  onDelete,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-auto flex w-[80%] max-w-[340px] min-w-[200px] flex-col items-center rounded-[22px] bg-[var(--white)] px-0 pt-10 pb-0 shadow-xl">
        {/* 일정 정보 */}
        <div className="mb-2 w-full px-6 text-center text-[17px] font-extrabold text-[var(--gray-90)]">
          {formatAmPmTo24Hour(scheduleText)}
        </div>
        {/* 경고 메시지 */}
        <div className="mb-8 w-full px-6 text-center text-[14px] font-semibold text-[var(--noti)] max-[320px]:text-xs max-[320px]:leading-tight">
          커피챗 일정을 정말 삭제하시겠어요?
        </div>
        {/* 버튼 영역 */}
        <div className="flex h-[50px] w-full border-t border-[var(--gray-10)]">
          <button
            className="h-full flex-1 rounded-bl-[22px] border-r border-[var(--gray-10)] bg-[var(--white)] text-[16px] font-semibold text-[var(--gray-40)] max-[320px]:py-2 max-[320px]:text-xs"
            onClick={onCancel}
          >
            취소하기
          </button>
          <button
            className="h-full flex-1 rounded-br-[22px] bg-[var(--gray-80)] text-[16px] font-semibold text-[var(--white)] max-[320px]:py-2 max-[320px]:text-[10px]"
            onClick={onDelete}
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteScheduleModal;
