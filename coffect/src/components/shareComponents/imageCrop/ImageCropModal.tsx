import { useState, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";

type Props = {
  isOpen: boolean;
  imageSrc: string;
  onCropComplete: (file: File) => void;
  onClose: () => void;
};

export default function ImageCropModal({
  isOpen,
  imageSrc,
  onCropComplete,
  onClose,
}: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropCompleteCallback = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropComplete(croppedFile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-brightness-50">
      <div className="w-full max-w-sm rounded-3xl bg-white p-4 shadow-lg">
        <h2 className="mb-3 text-center text-lg font-semibold text-[var(--gray-90)]">
          이미지 자르기
        </h2>

        <div
          className="relative w-full overflow-hidden rounded-lg bg-[var(--gray-30)]"
          style={{ height: "50vh", maxHeight: "600px" }}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1 / 1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteCallback}
            minZoom={1}
            maxZoom={1.5}
            objectFit="vertical-cover"
          />
        </div>

        <div className="mt-5 flex justify-center gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-[var(--gray-30)] px-5 py-2 text-[var(--gray-70)]"
          >
            취소
          </button>
          <button
            onClick={handleCrop}
            className="rounded-lg bg-[var(--orange-500)] stroke-0 px-5 py-2 text-white shadow-sm"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Crop 보정 함수 ---
async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas context not found");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // ✅ 원본 스케일 보정
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  ctx.drawImage(
    image,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(new File([blob], "cropped-image.jpeg", { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.9,
    );
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
  });
}
