import modalIcon from "@/assets/icon/mypage/attention.png";

const ModifyModal = ({ message }: { message: string }) => (
  <div className="absolute -top-14 left-1/2 z-50 flex w-max -translate-x-1/2 items-center rounded-2xl bg-[var(--gray-60)] px-4 py-2.5 text-sm whitespace-nowrap text-white">
    <img src={modalIcon} className="mr-1 h-5.5 w-5.5" />
    {message}
  </div>
);

export default ModifyModal;
