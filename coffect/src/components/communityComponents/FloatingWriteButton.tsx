import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

const FloatingWriteButton = () => {
  const navigate = useNavigate();

  const handleWriteClick = () => {
    navigate("/community/write");
  };

  return (
    <button
      onClick={handleWriteClick}
      className="absolute right-4 bottom-[calc(81px+16px)] z-20 flex h-14 w-14 items-center justify-center rounded-full bg-[#ff8126] text-white"
    >
      <Pencil size={24} />
    </button>
  );
};

export default FloatingWriteButton;
