/*
  author      : 이희선
  description : 첫 진입 시 사용자에게 프로필 완성 유도를 위한 모달 컴포넌트입니다.
                - 지금 작성하기 클릭 시 마이페이지 이동
                - 나중에 클릭 시 모달 닫기
*/

import { useNavigate } from "react-router-dom";

// props 타입 정의
interface ProfileModalProps {
  isOpen: boolean; // 모달 열림 여부
  onClose: () => void; // 모달 닫기 핸들러
}

const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  // isOpen이 false이면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    // 모달 배경 (검은 반투명)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      {/* 모달 컨테이너 */}
      <div className="flex aspect-square w-[305px] flex-col justify-between rounded-xl bg-white shadow-[0_0_24px_rgba(28,28,34,0.25)]">
        {/* 상단 아이콘 */}
        <div className="px-[4%] py-[12%]">
          {/* 타이틀 */}
          <h3 className="mb-[3%] text-center text-lg leading-snug font-bold">
            프로필을 완성해보세요!
          </h3>

          {/* 설명 문구 */}
          <p className="mb-[12%] text-center text-sm leading-relaxed whitespace-pre-line text-[#787891]">
            더 나은 매칭을 위해{"\n"}몇 가지 질문에 답변해주시면 어떨까요?
          </p>

          <div className="flex justify-center">
            <span className="text-6xl">📝</span>
          </div>
        </div>

        {/* 버튼 영역 (나중에 / 작성하기) */}
        <div className="flex h-[16.6%] overflow-hidden text-base">
          {/* 나중에 버튼 → 모달 닫기 */}
          <button
            onClick={onClose}
            className="flex-11 rounded-bl-xl border-[1px] border-[#F7F7F8] bg-[#FFFFFF] text-[#787891]"
          >
            나중에
          </button>

          {/* 지금 작성하기 버튼 → 마이페이지 내 프로필로 이동 */}
          <button
            onClick={() => navigate("/mypage/myprofile")}
            className="flex-19 rounded-br-xl bg-[#2D2D2D] text-white"
          >
            지금 작성하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
