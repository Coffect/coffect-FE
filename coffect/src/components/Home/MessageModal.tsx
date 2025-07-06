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
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
      {/* 모달 본문 컨테이너 */}
      <div className="relative w-[90%] rounded-[1vw] bg-white p-[5vw]">
        {/* 메시지 삭제 버튼 (우측 상단) */}
        <button
          onClick={() => onDelete(message.id)}
          className="absolute top-[2vw] right-[2vw]"
          aria-label="메시지 삭제"
        >
          <Trash2 className="h-[5vw] w-[5vw] text-gray-500" />
        </button>

        {/* 수신 시간 */}
        <div className="mb-[2vh] text-[3.4vw] text-gray-600">
          {message.time}
        </div>

        {/* 메시지 타이틀 */}
        <div className="mb-[2vh] text-[4vw] font-semibold">
          🍒{message.name}님의 커피쳇 제안이 도착했어요!
        </div>

        {/* 구분선 */}
        <hr className="border-t border-gray-300" />

        {/* 메시지 본문 */}
        <p className="mt-[2vh] mb-[4vh] text-[3vw] leading-tight whitespace-pre-line text-gray-700">
          {message.intro}
        </p>

        {/* 버튼 영역: 대화 시작 / 창 닫기 */}
        <div className="flex justify-center gap-[4vw]">
          {/* 대화 시작 버튼 */}
          <button
            onClick={onChat}
            className="flex-1 rounded-[1vw] bg-black py-[1.5vh] text-[3.5vw] text-white"
          >
            대화 시작하기
          </button>

          {/* 창 닫기 버튼 */}
          <button
            onClick={onClose}
            className="flex-1 rounded-[1vw] border border-gray-400 py-[1.5vh] text-[3.5vw] text-gray-700"
          >
            창 닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
