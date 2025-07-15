/*
author : 재하
description : 회원 탈퇴 시 확인 모달을 출력하는 컴포넌트입니다.
*/

import React from "react";

interface LeaveModalProps {
  open: boolean;
  onClose: () => void;
}

/*
탈퇴 확인 모달을 렌더링하는 함수형 컴포넌트입니다.
*/
const LeaveModal: React.FC<LeaveModalProps> = ({ open, onClose }) => {
  // 모달이 열려있지 않으면 null 반환
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="flex w-[306px] flex-col items-center rounded-2xl bg-white"
        // 이벤트 버블링을 막는 용도
        // 모달 내부를 클릭했을 때는 이벤트가 외부로 전파되지 않도록 막아줍니다.
        // 모달 창 자체를 클릭했을 때는 모달이 닫히지 않고, 모달 창 바깥을 클릭했을 때만 닫히게 하기 위한 코드
        onClick={(e) => e.stopPropagation()}
      >
        {/* 안내 메시지 */}
        <div className="w-full py-7 text-center">
          <span className="text-base font-semibold text-[var(--gray-90)]">
            잠깐만요,{" "}
          </span>
          <span className="text-base font-semibold text-[var(--noti)]">
            정말 탈퇴 하시겠어요?
          </span>
          <div className="mt-2 text-sm text-[var(--gray-50)]">
            회원 탈퇴 시 계정 정보 및 기록이
            <br />
            모두 삭제되며, 복구가 불가능해요
          </div>
        </div>
        {/* 탈퇴/취소 버튼 */}
        <div className="flex w-full text-center">
          <button
            className="flex-1 rounded-bl-2xl bg-white py-4 text-[var(--gray-40)] transition"
            onClick={onClose}
          >
            더 써볼래요
          </button>
          <button className="flex-1 rounded-br-2xl bg-[var(--gray-80)] py-4 font-semibold text-white transition">
            떠날래요
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveModal;
