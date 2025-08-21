/*
  author      : 이희선
  description : 받은 메시지를 보여주는 모달 컴포넌트입니다.
                - 처음에는 FCM 등에서 받은 기존 메시지를 표시
                - 모달이 열리면 getMessageShowUp API로 최신 메시지 내용을 불러와 갱신
                - 대화 시작, 삭제, 닫기 기능을 제공
                - 서버 조회용 coffectId와 UI용 cardId를 분리하여 안전하게 갱신
*/

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { getMessageShowUp } from "@/api/home"; // 최신 메시지 조회 API import

// 메시지 객체 타입 정의 (UI 표시/삭제용)
interface Message {
  id: string; // 카드 id(삭제/동기화용) — 서버 조회용 아님
  name: string; // 보낸 사람 이름
  time: string; // 수신 시간 (문자열 형태)
  intro: string; // 메시지 본문 (제안 내용)
}

// 모달 컴포넌트 props 타입 정의
interface MessageModalProps {
  coffectId?: number | null; // 서버 조회용 커피챗 ID (옵션)
  message: Message; // 모달 최초 표시 데이터 (카드 id 포함)
  onClose: () => void; // 모달 닫기 핸들러
  onDelete: (id: string) => void; // 카드 id를 그대로 넘겨 배너에서 삭제
  onChat: () => void; // 채팅 시작 핸들러
}

// 모달 컴포넌트 정의
const MessageModal: React.FC<MessageModalProps> = ({
  coffectId,
  message,
  onClose,
  onDelete,
  onChat,
}) => {
  // 실제 화면에 표시할 메시지 상태
  // 초기값은 props.message, 이후 서버 최신 데이터로 본문/시간만 갱신
  const [fullMessage, setFullMessage] = useState<Message>(message);

  // 모달이 열릴 때 서버 API로 최신 메시지 불러오기 (coffectId가 있을 때만 실행)
  useEffect(() => {
    (async () => {
      if (!coffectId) return; // 조회용 ID가 없으면 초기 데이터 유지
      try {
        const data = await getMessageShowUp(coffectId); // 서버에서 최신 메시지 조회
        setFullMessage({
          id: message.id, // 삭제/동기화를 위해 cardId는 그대로 유지
          name: data.success.firstUserName,
          time: new Date(data.success.createdAt).toLocaleString(),
          intro: data.success.message,
        });
      } catch (err) {
        console.error("메시지 최신 데이터 불러오기 실패:", err);
        // 실패 시 기존 데이터 유지
      }
    })();
  }, [coffectId, message.id]);

  return (
    // 전체 화면을 덮는 반투명 배경
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      {/* 모달 본문 컨테이너 */}
      <div className="relative flex w-[305px] flex-col justify-between rounded-xl bg-[var(--gray-0)] shadow-[0_0_24px_rgba(28,28,34,0.25)]">
        {/* 삭제 버튼 (우측 상단) */}
        <button
          onClick={() => onDelete(fullMessage.id)}
          className="absolute top-[7%] right-[6%]"
          aria-label="메시지 삭제"
        >
          <Trash2 className="h-5 w-5 text-[var(--gray-60)]" />
        </button>

        {/* 수신 시간 + 메시지 내용 */}
        <div className="px-[6%] pt-[5.5%] text-sm text-[var(--gray-30)]">
          {fullMessage.time}
          <div className="mt-[3%] text-left">
            {/* 제목 */}
            <h3 className="text-base font-semibold text-[var(--gray-90)]">
              ✉️ {fullMessage.name}님의 메시지
            </h3>
            {/* 본문 */}
            <p className="my-[5%] text-sm leading-snug font-medium break-keep whitespace-pre-line text-[var(--gray-70)]">
              {fullMessage.intro}
            </p>
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="mt-[6%] flex h-[50px] w-full overflow-hidden text-base">
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="flex-1 rounded-bl-xl bg-[var(--gray-0)] font-medium text-[var(--gray-40)]"
          >
            닫기
          </button>
          {/* 대화 시작 버튼 */}
          <button
            onClick={onChat}
            className="flex-1 rounded-br-xl bg-[var(--gray-80)] font-semibold text-[var(--gray-0)]"
          >
            대화 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
