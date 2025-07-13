/*
  author      : 이희선
  description : 커피챗 제안 응답 전달 모달 컴포넌트
                - 상대방이 커피챗 제안을 승낙했음을 알려주는 UI입니다.
                - 대화를 시작하거나, 나중에 닫을 수 있습니다.
*/

// props 타입 정의
interface CoffeeSuggestResponseModalProps {
  userName: string; // 상대방 이름
  onChat: () => void; // 대화 시작 클릭
  onClose: () => void; // 모달 닫기 클릭
}

const CoffeeSuggestResponseModal: React.FC<CoffeeSuggestResponseModalProps> = ({
  userName,
  onChat,
  onClose,
}) => {
  return (
    // 모달 배경
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      {/* 모달 박스 */}
      <div className="flex aspect-square w-[305px] flex-col justify-between rounded-xl bg-white shadow-[0_0_24px_rgba(28,28,34,0.25)]">
        {/* 내용 영역 */}
        <div className="px-[5%] py-[12%] text-center">
          {/* 제목 */}
          <h3 className="mb-[3%] text-sm leading-snug font-bold text-black">
            {userName}님이 커피챗 제안을 승낙했어요!
          </h3>

          {/* 설명 */}
          <p className="mb-[15%] text-xs leading-relaxed whitespace-pre-line text-[#787891]">
            바로 채팅을 통해 일정을 잡아보세요!
          </p>

          {/* 이미지 예시 */}
          <div className="flex justify-center text-7xl">✅</div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="flex h-[16.6%] overflow-hidden text-base">
          <button
            onClick={onClose}
            className="flex-11 rounded-bl-xl border border-[#F7F7F8] bg-white text-[#787891]"
          >
            나중에
          </button>
          <button
            onClick={onChat}
            className="flex-19 rounded-br-xl bg-[#2D2D2D] text-white"
          >
            대화 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeSuggestResponseModal;
