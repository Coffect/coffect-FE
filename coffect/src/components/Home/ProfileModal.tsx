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
      <div className="w-[90%] rounded-[0.5vw] bg-white px-[6vw] py-[6vh]">
        {/* 상단 아이콘 */}
        <div className="mb-[3vh] flex justify-center">
          <span className="text-[7vw]">📝</span>
        </div>

        {/* 타이틀 */}
        <h3 className="mb-[2vh] text-center text-[5.2vw] leading-snug font-semibold">
          프로필을 완성해보세요!
        </h3>

        {/* 설명 문구 */}
        <p className="mb-[5vh] text-center text-[3.8vw] leading-[5vw] whitespace-pre-line text-gray-600">
          더 나은 매칭을 위해{"\n"}몇 가지 질문에 답변해주시면 어떨까요?{"\n"}
          2분이면 충분해요!
        </p>

        {/* 버튼 영역 (작성하기 / 나중에) */}
        <div className="flex justify-center gap-[4vw]">
          {/* 지금 작성하기 버튼 → 마이페이지 이동 */}
          <button
            onClick={() => navigate("/userpage")} // 마이페이지 경로는 추후 변경 가능
            className="rounded-[0.5vw] bg-black px-[10vw] py-[2.2vh] text-[3.8vw] text-white"
          >
            지금 작성하기
          </button>

          {/* 나중에 버튼 → 모달 닫기 */}
          <button
            onClick={onClose}
            className="rounded-[0.5vw] border border-gray-400 px-[8vw] py-[2.2vh] text-[3.8vw]"
          >
            나중에
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
