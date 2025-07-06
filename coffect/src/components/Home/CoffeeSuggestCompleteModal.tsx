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
      {/* 모달 본문 컨테이너 */}
      <div className="w-[90%] border border-gray-800 bg-white p-[5vw]">
        {/* 제목 영역 */}
        <div className="mt-[10vh] mb-[2vh] flex items-center justify-center gap-[2vw]">
          ☕
          <h3 className="text-[4vw] font-extrabold text-gray-800">
            커피챗 제안이 전송되었어요!
          </h3>
        </div>

        {/* 설명 텍스트 */}
        <p className="mb-[12vh] text-center text-[3vw] font-bold text-gray-600">
          답변을 기다리는 동안, 또 다른 친구에게 보내볼까요?
        </p>

        {/* 확인 버튼 */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="w-full rounded-[1vw] bg-black py-[1.5vh] text-[3.5vw] font-semibold text-white"
          >
            창 닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeSuggestCompleteModal;
