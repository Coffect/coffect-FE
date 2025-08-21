/*
 * author : 앨리스/박은지
 * description : 채팅방 시스템 메시지 컴포넌트
 */

interface ChatSystemMessageProps {
  username: string;
  isMyRequest?: boolean; // 내가 보낸 제안인지 여부
}

export const ChatSystemMessage = ({
  username,
  isMyRequest = false,
}: ChatSystemMessageProps) => {
  const message = isMyRequest
    ? `${username}님이 제안을 수락했어요!`
    : `${username}님의 제안을 수락했어요!`;

  return (
    <div className="flex justify-center" role="status" aria-live="polite">
      <span className="cursor-default rounded-full px-3 py-3 pb-6 text-[14px] font-medium text-[var(--gray-40)] select-none">
        {message}
      </span>
    </div>
  );
};
