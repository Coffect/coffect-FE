import { useNavigate } from "react-router-dom";
import FeedItem from "../../shareComponents/FeedItem";
import type { Post } from "../../../data/communityDummyData";
import profileImg from "../../../assets/icon/mypage/profile.png";
import backIcon from "../../../assets/icon/mypage/back.png";
import emptyFeedIcon from "../../../assets/icon/mypage/emptyFeed.png";

const myDummyPosts: Post[] = [
  {
    id: 1,
    user: {
      profileImage: profileImg,
      nickname: "재하",
    },
    image: "https://picsum.photos/400/300?random=1",
    title: "창밖 풍경과 커피 한 잔",
    content:
      "창밖에는 맑은 하늘과 부드러운 바람이 어우러져 평온한 풍경을 만든다. 커피 한 잔을 손에 들고 창가에 앉아 있으면, 시간도 잠시 멈춘 듯 느껴진다. 바쁜 일상...",
    likes: 2,
    comments: 2,
    type: "일상",
    topic: "일상",
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2일 전
    daysAgo: 2,
  },
  {
    id: 2,
    user: {
      profileImage: profileImg,
      nickname: "재하",
    },
    image: "https://picsum.photos/400/300?random=2",
    title: "디자인 프로젝트 회의",
    content:
      "오늘은 팀원들과 디자인 프로젝트 회의를 했다. 다양한 아이디어가 오가며 유익한 시간이었고, 앞으로의 방향성에 대해 많은 고민을 하게 되었다.",
    likes: 5,
    comments: 1,
    type: "프로젝트",
    topic: "디자인",
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5일 전
    daysAgo: 5,
  },
  {
    id: 3,
    user: {
      profileImage: profileImg,
      nickname: "재하",
    },
    image: "https://picsum.photos/400/300?random=3",
    title: "새로운 영감",
    content:
      "최근에 본 전시회에서 많은 영감을 받았다. 다양한 색감과 형태를 보며 나만의 디자인을 구상해보고 싶어졌다.",
    likes: 8,
    comments: 3,
    type: "영감",
    topic: "아트",
    postedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10일 전
    daysAgo: 10,
  },
];

const BookMark = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex h-full w-full flex-col bg-white px-4">
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between py-3">
          <button
            className="pr-9 text-left text-3xl"
            onClick={() => navigate("/mypage")}
          >
            <img src={backIcon} className="h-6 w-6" />
          </button>
          <div className="flex-1 items-center justify-center pr-15 text-center">
            <span className="text-lg font-semibold">저장한 콘텐츠</span>
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto py-5">
          {/* 내 피드 탭이 활성화된 경우 피드 내용 출력 */}
          {myDummyPosts.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center">
              <span className="text-md mb-3 text-[var(--gray-50)]">
                아직 작성한 글이 없어요!
              </span>
              <img src={emptyFeedIcon} className="h-10 w-10 opacity-40" />
            </div>
          ) : (
            <>
              {myDummyPosts.map((post) => (
                <FeedItem key={post.id} post={post} />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BookMark;
