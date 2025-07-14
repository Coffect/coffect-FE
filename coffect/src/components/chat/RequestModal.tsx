// author : 앨리스/박은지
// description : [상대 요청 보기] 모달 컴포넌트
// 요청시간은 커피챗 제안 플로우에서 연결 필요, 시간표-임시 텍스트

import { X, Mail, AlarmClock } from "lucide-react";
interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

const RequestModal = ({ isOpen, onClose, username }: RequestModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-[80%] max-w-md rounded-2xl bg-white p-5 py-7 shadow-lg">
        <button className="absolute top-3 right-3" onClick={onClose}>
          <X size={24} />
        </button>
        <div className="mb-3 text-sm text-gray-400">2025. 7. 3. 오후 2:39</div>
        <div className="text-l flex items-center gap-1 font-bold">
          <Mail size={20} className="mr-1 text-gray-600" />
          {username}님의 메시지
        </div>
        <div className="border-b border-gray-300 py-5 text-sm font-medium text-[rgba(58,58,58,1)]">
          안녕하세요! 사람과 이야기를 나누는 것을 좋아하고, 새로운 것을 찾는
          배우는 데 늘 열려 있는 김라떼라고 합니다. 즐겁고 의미 있는 경험을 함께
          만들고 싶어요!
        </div>
        <div className="text-l mt-5 flex items-center gap-1 pb-2 font-bold">
          <AlarmClock size={20} className="mr-1 text-gray-600" />
          나와 겹치는 공강시간
        </div>
        <div className="flex justify-center">
          <div className="mt-3 flex h-10 w-[100%] items-center justify-start rounded-lg bg-[rgba(245,245,245,1)] px-3 text-sm font-bold">
            목요일 14:00
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;
