// author : 앨리스/박은지
// description : [상대 요청 보기] 모달 컴포넌트
// 모달 컴포넌트 열고 닫는 핸들러 제공
// 요청시간은 임시 하드 코딩, 시간표-임시 이미지

import { X } from "lucide-react";
interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequestModal = ({ isOpen, onClose }: RequestModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-[93%] max-w-md rounded-xl bg-white p-5 shadow-lg">
        <button className="absolute top-3 right-3" onClick={onClose}>
          <X size={24} />
        </button>
        <div className="mb-3 text-xs text-gray-400">
          요청시간 2025. 7. 3. 오후 2:39
        </div>
        <div className="flex items-center gap-1 border-b border-gray-300 pb-2 text-base font-bold">
          메시지
        </div>
        <div className="mb-3 py-3 text-sm text-gray-600">
          안녕하세요! 사람과 이야기를 나누는 것을 좋아하고, 새로운 것을 찾는
          배우는 데 늘 열려 있는 박은지입니다. 즐겁고 의미 있는 경험을 함께
          만들고 싶어요!
        </div>
        <div className="mb-2 flex items-center gap-1 border-b border-gray-300 pb-2 text-base font-bold">
          나와 겹치는 공강시간
        </div>
        <div className="flex justify-center">
          <div className="mt-3 flex h-32 w-40 items-center justify-center bg-gray-200 text-xs text-gray-400">
            시간표
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;
