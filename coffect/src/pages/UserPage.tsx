import BottomNavbar from "../components/shareComponents/BottomNavbar";

const UserPage = () => {
  return (
    <div className="flex h-full min-h-[calc(100dvh-81px)] flex-col items-center justify-center">
      <div className="text-2xl font-bold">User Page</div>
      <BottomNavbar activeLabel="마이" />
    </div>
  );
};

export default UserPage;
