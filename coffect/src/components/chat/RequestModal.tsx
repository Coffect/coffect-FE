// author : 앨리스/박은지
// description : [상대 요청 보기] 모달 컴포넌트
// 요청시간은 커피챗 제안 플로우에서 연결 필요, 시간표-임시 텍스트

import { X } from "lucide-react";
interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

const RequestModal = ({ isOpen, onClose, username }: RequestModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative mx-auto w-[90%] max-w-[340px] min-w-[200px] rounded-2xl bg-[var(--white)] px-6 py-7 shadow-lg max-[320px]:px-3 max-[320px]:py-4">
        <button
          className="absolute top-4 right-4 max-[340px]:top-2 max-[340px]:right-2"
          onClick={onClose}
        >
          <X size={24} className="max-[340px]:h-4 max-[340px]:w-4" />
        </button>
        <div className="mb-4 text-sm font-medium text-[var(--gray-30)] max-[340px]:text-xs">
          2025. 7. 3. 오후 2:39
        </div>
        <div className="flex items-center gap-2 text-base font-semibold max-[340px]:text-xs">
          <span className="text-[20px] max-[340px]:text-[16px]">✉️</span>
          {username}님의 메시지
        </div>
        <div className="mb-4 border-b border-[var(--gray-10)] py-3 text-[14px] font-medium text-[var(--gray-70)] max-[340px]:py-3 max-[340px]:text-xs">
          안녕하세요! 사람과 이야기를 나누는 것을 좋아하고, 새로운 것을 찾는
          배우는 데 늘 열려 있는 김라떼라고 합니다. 즐겁고 의미 있는 경험을 함께
          만들고 싶어요! 즐겁고 의미있는 경험 즐겁고 의미있는 경험 즐겁고
          의미있는 경험 즐겁고 의미있는 경험 즐겁고 의미있는 경험 즐겁고
          의미있는 경험
        </div>
        <div className="mt-4 mb-2 flex items-center gap-2 text-base font-semibold max-[340px]:text-xs">
          <span className="text-[16px] max-[340px]:text-[16px]">⏰</span>
          나와 겹치는 공강시간
        </div>
        <div className="flex justify-center">
          <div className="mt-2 flex h-12 w-full items-center justify-start rounded-xl bg-[var(--gray-5)] px-4 text-sm font-medium max-[340px]:h-10 max-[340px]:px-2 max-[340px]:text-xs">
            목요일 14:00
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;
