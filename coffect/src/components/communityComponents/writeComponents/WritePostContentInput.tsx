/**
 * @author 흥부/강신욱
 * @description 글 작성 페이지의 내용 입력 컴포넌트입니다.
 *              사용자가 게시글 내용을 입력할 수 있는 텍스트 영역과 이미지/링크 추가 버튼을 포함합니다.
 *              이 컴포넌트는 글 작성 페이지의 UI를 구성하며, 상태와 로직은 useWritePost 훅에서 관리합니다.
 */

import React, { useRef } from "react";
import { X } from "lucide-react";
import ImageAttachmentModal from "../../shareComponents/ImageAttachmentModal";
import Link from "@/assets/icon/community/linkIcon.png";
import Photo from "@/assets/icon/community/photoIcon.png";

/**
 * @interface WritePostContentInputProps
 * @description
 * 이 인터페이스는 WritePostContentInput 컴포넌트의 props 타입을 정의합니다.
 * @property content - 게시글 내용
 * @property setContent - 게시글 내용을 업데이트하는 함수
 * @property selectedImageFiles - 사용자가 선택한 이미지 파일 배열 (추가됨)
 * @property handleImageChange - 이미지 파일 선택 시 호출되는 핸들러 (추가됨)
 * @property handleImageRemove - 이미지 파일 삭제 시 호출되는 핸들러 (추가됨)
 */
interface WritePostContentInputProps {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  images: string[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageRemove: (indexToRemove: number) => void;
}

const WritePostContentInput: React.FC<WritePostContentInputProps> = ({
  content,
  setContent,
  images: selectedImageFiles,
  handleImageChange,
  handleImageRemove,
}) => {
  const [showModal, setShowModal] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("capture", "environment");
      fileInputRef.current.click();
    }
  };

  const handleGalleryClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute("capture");
      fileInputRef.current.click();
    }
  };

  return (
    <div className="p-4">
      {selectedImageFiles.length > 0 && (
        <div className="mb-2 grid grid-cols-3 gap-2">
          {selectedImageFiles.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`preview ${index}`}
                className="mx-auto h-auto w-full rounded-md object-contain"
              />
              <button
                onClick={() => handleImageRemove(index)}
                className="bg-opacity-50 absolute top-1 right-1 rounded-full bg-black p-0.5 text-white"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      <textarea
        placeholder="오늘은 어떤 글을 써볼까요?"
        className="h-55 w-full rounded focus:outline-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="relative my-2 flex items-center">
        <button
          type="button"
          className="rounded pr-2.25 text-sm"
          onClick={() => setShowModal((prev) => !prev)}
        >
          <img src={Photo} alt="Photo Icon" className="h-6 w-6" />
        </button>
        <button type="button" className="rounded text-sm">
          <img src={Link} alt="Link Icon" className="h-6 w-6" />
        </button>
        <ImageAttachmentModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onCameraClick={handleCameraClick}
          onGalleryClick={handleGalleryClick}
        />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
};

export default WritePostContentInput;
