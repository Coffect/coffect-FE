import { useToastStore } from "@/hooks/useToastStore";
import SuccessToastImage from "@/assets/icon/home/successToast.png";
import ErrorToastImage from "@/assets/icon/home/errorToast.png";
const Toast = () => {
  const { message, type, visible } = useToastStore();

  if (!visible) return null;

  const emoji = {
    success: (
      <img
        src={SuccessToastImage}
        alt="success"
        className="aspect-square h-[1.2rem] w-[1.2rem] min-w-[1.2rem] object-contain"
      />
    ),
    error: (
      <img
        src={ErrorToastImage}
        alt="error"
        className="aspect-square h-[1.2rem] w-[1.2rem] min-w-[1.2rem] object-contain"
      />
    ),
  }[type];

  return (
    <div className="fixed bottom-[5.5rem] left-1/2 z-50 flex -translate-x-1/2 transform items-center gap-[4px] rounded-[16px] bg-[var(--gray-60)] px-[16px] py-[9px] text-[14px] leading-[150%] font-medium whitespace-nowrap text-white shadow-md">
      <span> {emoji} </span>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
