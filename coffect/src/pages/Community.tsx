import Header from "../components/communityComponents/Header";
import BottomNavbar from "../components/shareComponents/BottomNavbar";

const Community = () => {
  /***** 예시 *****/
  const dummyFeeds = [
    {
      profileImage: "https://via.placeholder.com/150",
      name: "사용자1",
      introduction: "안녕하세요! 저는 사용자1입니다.",
      content: "오늘은 정말 좋은 날이에요!",
      image: "https://via.placeholder.com/300",
      uploadedTime: "2시간 전",
    },
    {
      profileImage: "https://via.placeholder.com/150",
      name: "사용자2",
      introduction: "프론트엔드 개발자입니다.",
      content: "React는 정말 재미있어요!",
      image: null,
      uploadedTime: "5시간 전",
    },
  ];

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
