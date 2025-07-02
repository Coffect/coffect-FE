import BottomNavbar from "../components/shareComponents/BottomNavbar";

const Community = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex overflow-y-auto flex-1 justify-center items-center text-2xl font-bold">
        Community Page
      </div>
      <BottomNavbar activeLabel="커뮤니티" />
    </div>
  );
};

export default Community;
