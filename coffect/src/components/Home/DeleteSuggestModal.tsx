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

/**
 * 삭제 확인 모달 컴포넌트
 */
const DeleteSuggestModal: React.FC<DeleteConfirmModalProps> = ({
  messageName,
  onDelete,
  onCancel,
}) => (
  // 전체 화면을 덮는 반투명 배경
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    {/* 모달 컨테이너 */}
    <div className="w-[90%] rounded-[1vw] bg-white p-[5vw]">
      {/* 타이틀 */}
      <h3 className="mt-[10vh] text-center text-[4vw] leading-snug font-semibold">
        🍒 {messageName}님의 요청을 정말 삭제하시겠어요?
      </h3>

      {/* 구분선 */}
      <hr className="border-t border-gray-300" />

      {/* 경고 설명 */}
      <p className="mt-[2vh] mb-[8vh] text-center text-[3vw] text-gray-600">
        한 번 삭제한 요청은 다시 복구할 수 없습니다.
      </p>

      {/* 버튼 그룹 */}
      <div className="flex justify-center gap-[4vw]">
        {/* 삭제 확정 버튼 */}
        <button
          onClick={onDelete}
          className="flex-1 rounded-[1vw] bg-black py-[2vh] text-[3.5vw] font-semibold text-red-500"
        >
          제안 삭제하기
        </button>

        {/* 삭제 취소 버튼 */}
        <button
          onClick={onCancel}
          className="flex-1 rounded-[1vw] border border-gray-400 py-[2vh] text-[3.5vw] text-gray-700"
        >
          취소하기
        </button>
      </div>
    </div>
  </div>
);

export default DeleteSuggestModal;
