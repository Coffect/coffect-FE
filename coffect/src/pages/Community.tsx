import FeedList from "../components/communityComponents/feed/FeedList";
import Header from "../components/communityComponents/Header";
import BottomNavbar from "../components/shareComponents/BottomNavbar";

const Community = () => {
  /***** 예시 *****/
  const dummyFeeds = [
    {
      profileImage: "https://i.pravatar.cc/300",
      name: "사용자1",
      introduction: "안녕하세요! 저는 사용자1입니다.",
      content:
        "창밖에는 맑은 하늘과 부드러운 바람이 어우러져 평온한 풍경을 만든다. 커피 한 잔을 손에 들고 창가에 앉아 있으면, 시간도 잠시 멈춘 듯 느껴진다. 창밖에는 맑은 하늘과 부드러운 바람이 어우러져 평온한 풍경을 만든다. 커피 한 잔을 손에 들고 창가에 앉아 있으면, 시간도 잠시 멈춘 듯 느껴진다. ",
      image: ["https://picsum.photos/200"],
      uploadedTime: "20m",
    },
    {
      profileImage: "https://i.pravatar.cc/300",
      name: "사용자2",
      introduction: "프론트엔드 개발자입니다.",
      content: "React는 정말 재미있어요!",
      image: ["https://picsum.photos/200", "https://picsum.photos/200"],
      uploadedTime: "5m",
    },
    {
      profileImage: "https://i.pravatar.cc/300",
      name: "사용자1",
      introduction: "안녕하세요! 저는 사용자1입니다.",
      content:
        "창밖에는 맑은 하늘과 부드러운 바람이 어우러져 평온한 풍경을 만든다. 커피 한 잔을 손에 들고 창가에 앉아 있으면, 시간도 잠시 멈춘 듯 느껴진다. 창밖에는 맑은 하늘과 부드러운 바람이 어우러져 평온한 풍경을 만든다. 커피 한 잔을 손에 들고 창가에 앉아 있으면, 시간도 잠시 멈춘 듯 느껴진다. ",
      image: [
        "https://picsum.photos/200",
        "https://picsum.photos/200",
        "https://picsum.photos/200",
      ],
      uploadedTime: "20m",
    },
    {
      profileImage: "https://i.pravatar.cc/300",
      name: "사용자2",
      introduction: "프론트엔드 개발자입니다.",
      content: "React는 정말 재미있어요!",
      image: [
        "https://picsum.photos/200",
        "https://picsum.photos/200",
        "https://picsum.photos/200",
        "https://picsum.photos/200",
      ],
      uploadedTime: "5m",
    },
  ];

  return (
    <div className="flex h-full w-full max-w-[430px] flex-col items-center justify-center">
      {/* 고정바 영역 */}
      <div className="fixed top-0 left-0 z-10 h-[15%] w-full bg-white shadow-md">
        <Header />
      </div>

      {/* Main Content 영역 */}
      <div className="flex w-full flex-1 items-center overflow-y-auto pt-10 text-2xl font-bold">
        <FeedList feeds={dummyFeeds} />
      </div>

      {/* Bottom Navbar 영역 */}
      <BottomNavbar activeLabel="커뮤니티" />
    </div>
  );
};

export default Community;
