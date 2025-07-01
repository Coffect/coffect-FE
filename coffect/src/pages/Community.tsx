import BottomNavbar from "../components/shareComponents/BottomNavbar";

const Community = () => {
  return (
    <div className="flex h-full min-h-[calc(100dvh-81px)] flex-col items-center justify-center">
      <div className="text-2xl font-bold">Community Page</div>
      <BottomNavbar activeLabel="커뮤니티" />
    </div>
  );
};

export default Community;
