/*
  author      : 이희선
  description : 커피챗 제안 응답 전달 모달 컴포넌트
                - 상대방이 커피챗 제안을 승낙했음을 알려주는 UI
                - 대화를 시작하거나, 닫을 수 있음
*/
import SuggestResponseImage from "../../assets/icon/home/SuggestResponse.png";

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
      <div className="flex aspect-square w-[305px] flex-col justify-between rounded-xl bg-[var(--gray-0)] shadow-[0_0_24px_rgba(28,28,34,0.25)]">
        {/* 내용 영역 */}
        <div className="px-[4%] pt-[15%] text-center">
          {/* 제목 */}
          <h3 className="mb-[3%] text-base leading-normal font-semibold text-[var(--gray-90)]">
            {userName}님이 커피챗 제안을 승낙했어요!
          </h3>
          {/* 설명 */}
          <p className="mb-[5%] text-sm text-[var(--gray-50)]">
            바로 채팅을 통해 일정을 잡아보세요!
          </p>
          {/* 이미지 */}
          <img
            src={SuggestResponseImage}
            alt="제안수락"
            className="mx-auto aspect-square w-[110px]"
          />
        </div>

        {/* 하단 버튼 영역 */}
        <div className="flex h-[16.6%] overflow-hidden text-base">
          <button
            onClick={onClose}
            className="flex-11 rounded-bl-xl bg-[var(--gray-0)] font-medium text-[var(--gray-40)]"
          >
            나중에
          </button>
          <button
            onClick={onChat}
            className="flex-19 rounded-br-xl bg-[var(--gray-80)] font-semibold text-[var(--gray-0)]"
          >
            대화 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeSuggestResponseModal;
