/*
author : 재하
description : 마이페이지 내 프로필 및 피드/상세소개 탭을 출력하는 컴포넌트입니다.
*/
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DetailIntro from "./DetailIntro";
import backIcon from "../../../../assets/icon/mypage/back.png";
import profileImg from "../../../../assets/icon/mypage/profile.png";
import FeedItem from "../../../shareComponents/FeedItem";
import type { Post } from "../../../../data/communityDummyData";
import emptyFeedImg from "../../../../assets/icon/mypage/emptyFeed.png";

const myDummyPosts: Post[] = [
  {
    id: 1,
    user: {
      profileImage: profileImg,
      nickname: "재하",
      major: "컴퓨터컴퓨터과학전공",
      studentId: "19학번",
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
      major: "컴퓨터컴퓨터과학전공",
      studentId: "19학번",
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
      major: "컴퓨터컴퓨터과학전공",
      studentId: "19학번",
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

function MyProfile() {
  /*
  사용자의 마이페이지 프로필 화면을 렌더링하며, 탭에 따라 피드 또는 상세 소개를 보여줍니다.
  */
  const navigate = useNavigate();
  // 현재 활성화된 탭 상태 ("내 피드" 또는 "상세 소개")
  const [activeTab, setActiveTab] = useState<string>("피드");
  // 텍스트 확장 상태
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  // 텍스트가 2줄 이상인지 확인하는 상태
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  // 텍스트가 2줄 이상인지 확인하는 함수
  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const element = textRef.current;

        // 텍스트의 실제 높이
        const textHeight = element.scrollHeight;

        // 2줄 높이 추정 (line-height * 2)
        const lineHeight = 1.2; // em 단위 기준
        const fontSize = 14; // text-sm = 14px
        const twoLineHeight = fontSize * lineHeight * 2;

        // 텍스트 높이가 2줄 높이보다 크면 오버플로우
        setIsOverflowing(textHeight > twoLineHeight);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  function formatCount(num: number): string {
    if (num >= 1_000_000_000_000)
      return Math.floor(num / 1_000_000_000_000) + "T+";
    if (num >= 1_000_000_000) return Math.floor(num / 1_000_000_000) + "B+";
    if (num >= 1_000_000) return Math.floor(num / 1_000_000) + "M+";
    if (num >= 1_000) return Math.floor(num / 1_000) + "K+";
    return num.toString();
  }

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-white px-4">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between py-3">
        <button
          className="pr-9 text-left text-3xl"
          onClick={() => navigate("/mypage")}
        >
          <img src={backIcon} className="h-6 w-6" />
        </button>
        <div className="flex-1 items-center justify-center pr-15 text-center">
          <span className="text-lg font-semibold">jeha0714</span>
        </div>
      </div>

      {/* Profile Section: 프로필 이미지와 통계 정보 */}
      <div className="py-2">
        <div className="mb-4 flex flex-row items-center justify-center">
          {/* Profile Image: 사용자 프로필 이미지 자리 */}
          <img
            src={profileImg}
            className="flex h-25 w-25 overflow-hidden rounded-full border border-black"
          />

          {/* Stats: 포스트/팔로워/팔로잉 수 */}
          <div className="flex flex-1 items-center justify-evenly">
            <div className="text-center">
              <div className="text-lg font-semibold text-[var(--gray-70)]">
                {formatCount(42)}
              </div>
              <div className="text-sm text-[var(--gray-50)]">포스트</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-[var(--gray-70)]">
                {formatCount(999456)}
              </div>
              <div className="text-sm text-[var(--gray-50)]">팔로워</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-[var(--gray-70)]">
                {formatCount(999456)}
              </div>
              <div className="text-sm text-[var(--gray-50)]">팔로잉</div>
            </div>
          </div>
        </div>

        {/* Profile Info: 사용자 이름, 전공, 학번, 자기소개 */}
        <div className="mb-4 ml-2">
          <p className="text-xl font-bold text-[var(--gray-90)]">재하</p>
          <div className="mb-1">
            <span className="text-sm text-[var(--gray-40)]">
              컴퓨터컴퓨터과학전공{" "}
            </span>
            <span className="text-sm text-[var(--gray-40)]">19학번</span>
          </div>
          <div className="relative">
            <p
              ref={textRef}
              className={`text-sm text-[var(--gray-70)] ${
                !isExpanded && isOverflowing ? "line-clamp-2" : ""
              }`}
            >
              계절이 지나가는 하늘에는 가을로 가득 차 있습니다. 나는 아무 걱정도
              없이 가을 속의 별들을 다 헤일 듯합니다. 가슴속에 하나둘 새겨지는
              별을 이제 다 못 헤는 것은 쉬이 아침이 오는 까닭이요, 내일 밤이
              남은 까닭이요, 아직 나의 청춘이 다하지 않은 까닭입니다. 별 하나에
              추억과 별 하나에 사랑과 별 하나에 쓸쓸함과 별 하나에 동경과 별
              하나에 시와 별 하나에 어머니, 어머니,
            </p>
            {isOverflowing && (
              <button
                className="mt-1 text-sm text-[var(--gray-40)] hover:text-[var(--gray-70)]"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "접기" : "더보기"}
              </button>
            )}
          </div>
        </div>

        {/* Profile Edit Button: 프로필 수정 페이지로 이동 */}
        <button
          className="text-md mb-3.5 w-full rounded-lg bg-[var(--gray-60)] py-3 text-white"
          onClick={() => navigate("/mypage/myprofile/modify")}
        >
          프로필 수정
        </button>
      </div>

      <div className="-mx-4 h-2 w-full bg-[var(--gray-5)]"></div>

      {/* Tab Navigation: 내 피드/상세 소개 탭 전환 */}
      <div className="flex border-b">
        <button
          className={`flex-1 border-b-2 py-3 text-center font-medium ${
            activeTab === "내 피드"
              ? "border-black text-black"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => setActiveTab("내 피드")}
        >
          내 피드
        </button>
        <button
          className={`flex-1 border-b-2 py-3 text-center font-medium ${
            activeTab === "상세 소개"
              ? "border-black text-black"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => setActiveTab("상세 소개")}
        >
          상세 소개
        </button>
      </div>

      {/* Content Area: 탭에 따라 내용 분기 */}
      <div className="flex flex-1 flex-col py-5">
        {/* 내 피드 탭이 활성화된 경우 피드 내용 출력 */}
        {activeTab === "피드" &&
          (myDummyPosts.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center">
              <span className="text-md mb-3 text-[var(--gray-50)]">
                아직 작성한 글이 없어요!
              </span>
              <img src={emptyFeedImg} className="h-10 w-10 opacity-40" />
            </div>
          ) : (
            <>
              {myDummyPosts.map((post) => (
                <FeedItem key={post.id} post={post} />
              ))}
            </>
          ))}

        {/* 상세 소개 탭이 활성화된 경우 상세 소개 컴포넌트 출력 */}
        {activeTab === "상세 소개" && <DetailIntro />}
      </div>
    </div>
  );
}

export default MyProfile;
