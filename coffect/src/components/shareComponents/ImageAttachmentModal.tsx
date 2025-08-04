import React from 'react';

interface ImageAttachmentModalProps {
  onCameraClick: () => void;
  onGalleryClick: () => void;
  show: boolean;
  onClose: () => void;
}

const ImageAttachmentModal: React.FC<ImageAttachmentModalProps> = ({
  show,
  onClose,
  onCameraClick,
  onGalleryClick,
}) => {
  if (!show) {
    return null;
  }

  const handleCamera = () => {
    onCameraClick();
    onClose();
  };

  const handleGallery = () => {
    onGalleryClick();
    onClose();
  };

  return (
    <div
      className="absolute bottom-11 -left-1 z-50 flex flex-col rounded-xl border border-[var(--gray-5)] bg-white shadow-lg"
      style={{ minWidth: 180 }}
    >
      <button
        className="w-full rounded-t-xl px-3 py-2 text-left text-sm hover:bg-[var(--gray-10)]"
        onClick={handleCamera}
        type="button"
      >
        카메라로 촬영
      </button>
      <div className="mx-0.5 h-px bg-[var(--gray-5)]" />
      <button
        className="w-full rounded-b-xl px-3 py-2 text-left text-sm hover:bg-[var(--gray-10)]"
        onClick={handleGallery}
        type="button"
      >
        갤러리에서 선택
      </button>
    </div>
  );
};

export default ImageAttachmentModal;
