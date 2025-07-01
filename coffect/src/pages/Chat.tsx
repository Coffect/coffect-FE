import BottomNavbar from "../components/shareComponents/BottomNavbar";

const Chat = () => {
  return (
    <div className="flex h-full min-h-[calc(100dvh-81px)] flex-col items-center justify-center">
      <div className="text-2xl font-bold">Chat Page</div>
      <BottomNavbar activeLabel="채팅" />
    </div>
  );
};

export default Chat;
