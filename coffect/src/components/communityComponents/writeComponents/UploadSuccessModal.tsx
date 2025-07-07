/* author : 강신욱
description : 글 업로드 성공 시 나타나는 모달 컴포넌트입니다.
*/
import React from "react";

interface UploadSuccessModalProps {
  isOpen: boolean;
  onViewPost: () => void;
  onGoHome: () => void;
}

const UploadSuccessModal: React.FC<UploadSuccessModalProps> = ({
  isOpen,
  onViewPost,
  onGoHome,
}) => {
  if (!isOpen) return null;

  return (
    <div className="bg-opacity-10 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <div className="flex w-80 flex-col items-center gap-5 rounded-lg bg-white p-6 shadow-lg">
        {/* 이미지 Placeholder */}
        <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
          <span className="text-xs text-gray-500">Image</span>
        </div>

        <h2 className="text-lg font-bold">하은님의 글이 게시되었어요.</h2>
        <div className="mb-4 text-center text-sm text-gray-500">
          나의 가치관과 생각을 들어내는 글은
          <br />더 많은 유저들에게 자기 어필을 할 수 있어요!
        </div>

        <div className="fled-col flex h-12 w-full gap-3">
          <button
            onClick={onViewPost}
            className="w-full bg-black py-3 font-semibold text-white"
          >
            내 글 확인하기
          </button>
          <button
            onClick={onGoHome}
            className="w-full border border-gray-300 bg-white py-3 font-semibold text-gray-500"
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadSuccessModal;
