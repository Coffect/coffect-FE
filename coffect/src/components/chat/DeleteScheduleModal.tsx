import React from "react";

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
      <div className="flex w-[80%] flex-col items-center rounded-[22px] bg-white px-0 pt-10 pb-0 shadow-xl">
        {/* 일정 정보 */}
        <div className="mb-3 w-full px-6 text-center text-[17px] font-extrabold text-black">
          {scheduleText}
        </div>
        {/* 경고 메시지 */}
        <div className="mb-8 w-full px-6 text-center text-[14px] font-semibold text-[#FF3535]">
          커피챗 일정을 정말 삭제하시겠어요?
        </div>
        {/* 버튼 영역 */}
        <div className="flex h-[50px] w-full border-t border-[#E5E5E5]">
          <button
            className="h-full flex-1 rounded-bl-[22px] border-r border-[#E5E5E5] bg-white text-[15px] font-semibold text-[#9494A8]"
            onClick={onCancel}
          >
            취소하기
          </button>
          <button
            className="h-full flex-1 rounded-br-[22px] bg-[#222] text-[15px] font-semibold text-white"
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
