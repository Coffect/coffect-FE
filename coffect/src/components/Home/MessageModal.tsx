/*
  author      : 이희선
  description : 받은 메시지를 보여주는 모달 컴포넌트입니다.
                - 커피챗 제안 내용을 확인할 수 있으며,
                - 대화 시작, 삭제, 닫기 기능이 제공됩니다.
*/

import { Trash2 } from "lucide-react";

// 메시지 객체 타입 정의
interface Message {
  id: number; // 메시지 고유 ID
  name: string; // 보낸 사람 이름
  time: string; // 수신 시간
  intro: string; // 메시지 본문 (제안 내용)
}

// 모달 컴포넌트 props 타입 정의
interface MessageModalProps {
  message: Message; // 메시지 데이터
  onClose: () => void; // 모달 닫기 핸들러
  onDelete: (id: number) => void; // 메시지 삭제 핸들러
  onChat: () => void; // 채팅 시작 핸들러
}

// 모달 컴포넌트 정의
const MessageModal: React.FC<MessageModalProps> = ({
  message,
  onClose,
  onDelete,
  onChat,
}) => {
  return (
    // 전체 화면을 덮는 반투명 배경 (모달 레이어)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      {/* 모달 본문 컨테이너 */}
      <div className="relative flex w-[305px] flex-col justify-between rounded-xl bg-[var(--gray-0)] shadow-[0_0_24px_rgba(28,28,34,0.25)]">
        {/* 삭제 버튼 (우상단) */}
        <button
          onClick={() => onDelete(message.id)}
          className="absolute top-[7%] right-[6%]"
          aria-label="메시지 삭제"
        >
          <Trash2 className="h-5 w-5 text-[var(--gray-60)]" />
        </button>
        {/* 수신 시간 */}
        <div className="px-[6%] pt-[5.5%] text-xs text-[var(--gray-40)]">
          {message.time}
          {/* 콘텐츠 */}
          <div className="mt-[3%] text-left">
            {/* 타이틀 */}
            <h3 className="text-sm font-bold text-[var(--gray-90)]">
              ✉️{message.name}님의 메시지
            </h3>

            {/* 메시지 본문 */}
            <p className="my-[5%] text-xs leading-snug font-medium break-keep whitespace-pre-line text-[var(--gray-0-strong)]">
              {message.intro}
            </p>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="mt-[6%] flex h-[50px] w-full overflow-hidden text-sm">
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="flex-1 rounded-bl-xl bg-[var(--gray-0)] text-[var(--gray-40)]"
          >
            닫기
          </button>

          {/* 대화 시작 버튼 */}
          <button
            onClick={onChat}
            className="flex-1 rounded-br-xl bg-[var(--gray-80)] text-[var(--gray-0)]"
          >
            대화 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
