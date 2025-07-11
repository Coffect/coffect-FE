/* 
author : 강신욱
description : 글 업로드 성공 시 나타나는 모달 컴포넌트입니다.
*/
import React from "react";
import UploadSuccessModalImage from "../../../assets/images/UploadSuccessModalImage.png";

interface UploadSuccessModalProps {
  isOpen: boolean;
  onViewPost: () => void;
}

const UploadSuccessModal: React.FC<UploadSuccessModalProps> = ({
  isOpen,
  onViewPost,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      <div className="bg-opacity-50 pointer-events-auto flex h-full w-full max-w-[430px] items-center justify-center backdrop-brightness-50">
        <div className="relative flex w-[72.8%] flex-col items-center overflow-hidden rounded-[20px] bg-white shadow-lg">
          <div className="flex flex-col items-center gap-2 pr-8 pl-8">
            <h2 className="pt-10 text-lg font-bold">글이 게시되었어요!</h2>
            <div className="text-center text-sm text-gray-500">
              나의 가치관과 생각을 들어내는 글은 더 많은 유저들에게 자기 어필을
              할 수 있어요!
            </div>
            <img
              src={UploadSuccessModalImage}
              alt="업로드 성공"
              className="w-[50%]"
            />
          </div>
          <button
            onClick={onViewPost}
            className="w-full bg-[#2d2d2d] py-5 font-semibold text-white"
          >
            확인하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadSuccessModal;
