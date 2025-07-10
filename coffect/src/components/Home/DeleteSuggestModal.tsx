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
    // 모달 배경 (검은 반투명)
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 모달 컨테이너 */}
      <div className="flex aspect-square w-[305px] flex-col justify-between rounded-xl bg-white shadow-[0_0_24px_rgba(28,28,34,0.25)]">
        {/* 상단 콘텐츠 */}
        <div className="px-[8%]">
          <div className="pt-[20%]">
            {/* 타이틀 */}
            <h3 className="text-center text-sm leading-snug font-bold">
              {messageName}님의 요청을 정말 삭제하시겠어요?
            </h3>

            {/* 설명 문구 */}
            <p className="mt-[2%] mb-[12%] text-center text-xs leading-relaxed font-semibold whitespace-pre-line text-[#ff0000]">
              삭제한 요청은 다시 복구할 수 없습니다.
            </p>
          </div>
          {/* 아이콘 */}
          <div className="flex justify-center">
            <span className="text-6xl">⚠️</span>
          </div>
        </div>

        {/* 버튼 영역 (취소 / 삭제하기) */}
        <div className="flex h-[16.6%] overflow-hidden text-base">
          {/* 취소 버튼 */}
          <button
            onClick={onCancel}
            className="flex-11 rounded-bl-xl border-[1px] border-[#F7F7F8] bg-[#FFFFFF] text-[#787891]"
          >
            취소하기
          </button>

          {/* 삭제 버튼 */}
          <button
            onClick={onDelete}
            className="flex-19 rounded-br-xl bg-[#2D2D2D] text-red-400"
          >
            제안 삭제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSuggestModal;
