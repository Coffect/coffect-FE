/*
author : 재하
description : 회원 탈퇴 시 확인 모달을 출력하는 컴포넌트입니다.
*/

import React from "react";
import { TriangleAlert } from "lucide-react";

interface LeaveModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/*
탈퇴 확인 모달을 렌더링하는 함수형 컴포넌트입니다.
*/
const LeaveModal: React.FC<LeaveModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  // 모달이 열려있지 않으면 null 반환
  if (!open) return null;

  return (
    <div
      className="bg-opacity-20 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="flex w-80 flex-col items-center rounded-lg border border-black bg-white p-6 shadow-lg"
        // 이벤트 버블링을 막는 용도
        // 모달 내부를 클릭했을 때는 이벤트가 외부로 전파되지 않도록 막아줍니다.
        // 모달 창 자체를 클릭했을 때는 모달이 닫히지 않고, 모달 창 바깥을 클릭했을 때만 닫히게 하기 위한 코드
        onClick={(e) => e.stopPropagation()}
      >
        {/* 경고 아이콘 및 안내 메시지 */}
        <div className="mb-4 flex flex-col items-center">
          <TriangleAlert className="mb-2 h-12 w-12 text-red-400" />
          <div className="mb-2 text-center text-lg font-bold">
            정말로 탈퇴 하시겠어요?
          </div>
          <div className="text-center text-sm text-gray-500">
            나의 가치관과 생각을 드러내는 글은
            <br />더 많은 유저들에게 자기 어필을 할 수 있어요!
          </div>
        </div>
        {/* 탈퇴/취소 버튼 */}
        <div className="mt-6 flex w-full gap-2">
          <button
            className="flex-1 rounded bg-black py-2 font-semibold text-white transition hover:bg-gray-800"
            onClick={onConfirm}
          >
            탈퇴하기
          </button>
          <button
            className="flex-1 rounded border border-gray-300 bg-white py-2 font-semibold text-gray-600 transition hover:bg-gray-100"
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveModal;
