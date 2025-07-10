/*
  author      : 이희선
  description : 커피챗 제안 전송 완료 모달 컴포넌트 (완료)
                - 커피챗 제안이 성공적으로 전송된 후 사용자에게 안내를 제공합니다.
                - 확인 버튼 클릭 시 모달을 닫습니다.
*/

// props 타입 정의
interface CoffeeSuggestCompleteModalProps {
  onClose: () => void; // 모달 닫기 핸들러
}

// 컴포넌트 정의
const CoffeeSuggestCompleteModal: React.FC<CoffeeSuggestCompleteModalProps> = ({
  onClose,
}) => {
  return (
    // 전체 화면 덮는 반투명 레이어
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      {/* 모달 컨테이너 */}
      <div className="flex aspect-square w-[305px] flex-col justify-between rounded-xl bg-white shadow-[0_0_24px_rgba(28,28,34,0.25)]">
        {/* 상단 콘텐츠 */}
        <div className="px-[4%] pt-[25%] pb-[5%] text-center">
          {/* 아이콘 + 타이틀 */}
          <div className="mb-[4%] flex items-center justify-center gap-[2%]">
            <span className="text-2xl">☕</span>
            <h3 className="text-lg font-bold">커피챗 제안이 전송되었어요!</h3>
          </div>

          {/* 설명 문구 */}
          <p className="mt-[6%] text-sm leading-relaxed font-semibold whitespace-pre-line text-[#787891]">
            답변을 기다리는 동안{"\n"}또 다른 친구에게 보내볼까요?
          </p>
        </div>

        {/* 하단 단일 확인 버튼 */}
        <button
          onClick={onClose}
          className="h-[50px] w-full rounded-b-xl bg-[#2D2D2D] text-base text-white"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default CoffeeSuggestCompleteModal;
