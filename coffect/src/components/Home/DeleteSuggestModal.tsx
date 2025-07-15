/*
  author      : 이희선
  description : 커피챗 제안 삭제 확인 모달 컴포넌트
                - 사용자가 제안을 삭제하려 할 때, 한번 더 확인을 받는 UI
                - 제안 삭제는 복구 불가능하다는 경고와 함께 확정/취소 선택 제공
*/

// props 타입 정의
interface DeleteConfirmModalProps {
  messageName: string; // 삭제 대상 메시지의 보낸 사람 이름 (예: 하은)
  onDelete: () => void; // 삭제 확정 콜백
  onCancel: () => void; // 삭제 취소 콜백
}

const DeleteSuggestModal = ({
  messageName,
  onDelete,
  onCancel,
}: DeleteConfirmModalProps) => {
  return (
    /* 모달 배경 (검은 반투명)*/
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      {/* 모달 컨테이너 */}
      <div className="w-[305px] overflow-hidden rounded-xl bg-[var(--gray-0)] shadow-[0_0_24px_rgba(28,28,34,0.25)]">
        {/* 상단 콘텐츠 */}
        <div className="px-[4%] py-[13%]">
          {/* 타이틀 */}
          <h3 className="text-center text-base leading-normal font-semibold text-[var(--gray-90)]">
            {messageName}님의 요청을
            <span className="text-[var(--noti)]"> 정말 삭제할까요?</span>
          </h3>

          {/* 설명 문구 */}
          <p className="mt-[2%] text-center text-sm leading-normal font-medium text-[var(--gray-40)]">
            한 번 삭제한 요청은 다시 복구할 수 없어요!
          </p>
        </div>

        {/* 버튼 영역 (취소 / 삭제하기) */}
        <div className="flex h-[50px] overflow-hidden text-base">
          {/* 취소 버튼 */}
          <button
            onClick={onCancel}
            className="flex-1 rounded-bl-xl bg-[var(--gray-0)] font-medium text-[var(--gray-40)]"
          >
            취소하기
          </button>

          {/* 삭제 버튼 */}
          <button
            onClick={onDelete}
            className="flex-1 rounded-br-xl bg-[var(--gray-80)] font-semibold text-[var(--gray-0)]"
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSuggestModal;
