import Header from "../components/communityComponents/Header";
import BottomNavbar from "../components/shareComponents/BottomNavbar";

const Community = () => {
  return (
    <div className="flex h-full w-full max-w-[430px] flex-col items-center justify-center">
      {/* Header 영역 */}
      <Header />
      {/* Main Content 영역 */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto text-2xl font-bold">
        Community Page
      </div>
      {/* Bottom Navbar 영역 */}
      <BottomNavbar activeLabel="커뮤니티" />
    </div>
  );
};

export default Community;
