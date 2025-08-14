/*
 * author : 앨리스/박은지
 * description : 채팅방 시스템 메시지
 */

interface ChatSystemMessageProps {
  username: string;
}

export const ChatSystemMessage = ({ username }: ChatSystemMessageProps) => {
  return (
    <div className="flex justify-center" role="status" aria-live="polite">
      <span className="cursor-default rounded-full px-3 py-3 pb-6 text-[14px] font-medium text-[var(--gray-40)] select-none">
        {`${username}님이 제안을 수락했어요!`}
      </span>
    </div>
  );
};
