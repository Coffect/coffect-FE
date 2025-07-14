/*
  author      : 이희선
  description : 프로필 카드 플립 컴포넌트 (한 장씩 표시 및 왼쪽 버튼 클릭 시 다음 카드)
                - 카드 클릭 시 내용 자세히 보기 페이지(CardDetail)로 이동
                - 왼쪽 버튼: 현재 카드 제거
                - 가운데 버튼: 커피챗 제안 모달 열기
                - 오른쪽 버튼: 팔로워 요청(아직 작동x)
*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CoffeeSuggestModal from "./CoffeeSuggestModal";
import CoffeeSuggestCompleteModal from "./CoffeeSuggestCompleteModal";
import CardLeftImage from "../../assets/Home/CardLeft.png";
import CardMidImage from "../../assets/Home/CardMid.png";
import CardRightImage from "../../assets/Home/CardRight.png";
import NoCardImage from "../../assets/Home/NoCard.png";

// 유저 프로필 타입 정의
interface UserProfile {
  id: number;
  name: string;
  major: string;
  year: string;
  tags: string[];
  intro: string;
  image: string;
  answers: { question: string; answer: string }[];
}

// 태그별 전역 색상 클래스 반환
const getTagColor = (tag: string) => {
  switch (tag) {
    case "창업":
      return "bg-[var(--startup-bg)] text-[var(--startup-text)]";
    case "개발":
      return "bg-[var(--development-bg)] text-[var(--development-text)]";
    case "디자인":
      return "bg-[var(--design-bg)] text-[var(--design-text)]";
    case "기획":
      return "bg-[var(--plan-bg)] text-[var(--plan-text)]";
    case "AI":
      return "bg-[var(--ai-bg)] text-[var(--ai-text)]";
    case "글쓰기":
      return "bg-[var(--write-bg)] text-[var(--write-text)]";
    case "독서":
      return "bg-[var(--read-bg)] text-[var(--read-text)]";
    case "마케팅":
      return "bg-[var(--marketing-bg)] text-[var(--marketing-text)]";
    case "여행":
      return "bg-[var(--trip-bg)] text-[var(--trip-text)]";
    case "데이터 분석":
      return "bg-[var(--data-bg)] text-[var(--data-text)]";
    case "하드웨어":
      return "bg-[var(--hw-bg)] text-[var(--hw-text)]";
    case "영화":
      return "bg-[var(--movie-bg)] text-[var(--movie-text)]";
    case "외국어":
      return "bg-[var(--language-bg)] text-[var(--language-text)]";
    case "악기":
      return "bg-[var(--music-bg)] text-[var(--music-text)]";
    case "네트워킹":
      return "bg-[var(--networking-bg)] text-[var(--networking-text)]";
    default:
      return "bg-black text-white";
  }
};

// 임시 사용자 데이터 (더미)
const dummyData: UserProfile[] = [
  {
    id: 1,
    name: "김라떼",
    major: "디자인테크놀로지학과",
    year: "21학번",
    tags: ["디자인", "개발", "창업", "글쓰기"],
    intro:
      "안녕하세요! 사람과 이야기를 나누는 것을\n좋아하고, 새로운 것을 배우는 데 늘 열려 있는 있습니다.\n즐겁고 의미있는 경험을 함께 만들고 싶어요!\n특히 디자인, 마케팅에 관심이 많습니다!\n아무나 환영이니 커피쳇 제안주세요!!",
    image: "https://picsum.photos/200?random=3",
    answers: [
      {
        question: "어떤 분야에서 성장하고 싶나요?",
        answer:
          "스타트업 창업과 제품 기획 분야에서 전문성을 쌓고 싶어요.특히 사용자 중심의 서비스를 만드는 PM 역할에 관심이 많습니다.",
      },
      {
        question: "커피챗에서 나누고 싶은 이야기는?",
        answer:
          "창업 경험담, 마케팅 전략, 제품 기획 노하우를 공유하고 싶어요. 함께 아이디어를 발전시키는 대화를 나누면 좋겠어요!",
      },
    ],
  },
  {
    id: 2,
    name: "이협업",
    major: "컴퓨터공학과",
    year: "22학번",
    tags: ["개발", "독서", "AI", "여행"],
    intro: "꾸준함이 제 무기입니다.\n좋은 사람들과 함께 성장하고 싶어요.",
    image: "https://picsum.photos/200?random=4",
    answers: [
      {
        question: "최근 집중하고 있는 기술은?",
        answer: "리액트 최적화와 사용자 경험 개선에 관심이 많아요.",
      },
      {
        question: "커피챗에서 얻고 싶은 것은?",
        answer: "협업 노하우와 새로운 개발 트렌드를 배우고 싶어요.",
      },
    ],
  },
  {
    id: 3,
    name: "박개발",
    major: "컴퓨터공학과",
    year: "21학번",
    tags: ["개발", "데이터 분석", "창업", "외국어"],
    intro:
      "안녕하세요! 컴퓨터 분해를 좋아하고,\n새로운 것을 배우는 데 늘 열려 있는 뉴비입니다.\n사람을 행복하게 만들고 싶다는 목표를 함께 이뤄나가고 싶어요!\n특히 프론트 개발에 관심이 많습니다!\n아무나 환영이니 커피쳇 제안주세요!!",
    image: "https://picsum.photos/200?random=5",
    answers: [
      {
        question: "어떤 분야에서 성장하고 싶나요?",
        answer:
          "스타트업 창업과 제품 기획 분야에서 전문성을 쌓고 싶어요.특히 사용자 중심의 서비스를 만드는 PM 역할에 관심이 많습니다.",
      },
      {
        question: "커피챗에서 나누고 싶은 이야기는?",
        answer:
          "창업 경험담, 마케팅 전략, 제품 기획 노하우를 공유하고 싶어요. 함께 아이디어를 발전시키는 대화를 나누면 좋겠어요!",
      },
    ],
  },
];

const ProfileFlip: React.FC = () => {
  const navigate = useNavigate();
  // 현재 남은 프로필 목록
  const [profiles, setProfiles] = useState<UserProfile[]>(dummyData);
  // 현재 스킵된 카드 수
  const [skipped, setSkipped] = useState(0);
  // 커피챗 제안 대상 프로필 ID
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
    null,
  );
  // 커피챗 제안 모달 열림 여부
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  // 커피챗 제안 완료 모달 열림 여부
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // 카드 제거(왼쪽 버튼)
  const handleSkip = (id: number) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    setSkipped((prev) => prev + 1);
  };
  // 커피쳇 제안 모달 열기(가운데 버튼)
  const handleSuggestClick = (id: number) => {
    setSelectedProfileId(id);
    setShowSuggestModal(true);
  };
  // 제안 메시지 작성 완료
  const handleSuggestSubmit = () => {
    setShowSuggestModal(false);
    setShowCompleteModal(true);
  };
  // 제안 작성 취소
  const handleSuggestCancel = () => {
    setShowSuggestModal(false);
    setSelectedProfileId(null);
  };
  // 제안 완료 모달 닫기
  const handleCompleteClose = () => {
    setShowCompleteModal(false);
    setSelectedProfileId(null);
  };
  // 카드 클릭 시 상세 페이지 이동
  const handleCardClick = (profile: UserProfile) => {
    navigate(`/home/cards/${profile.id}`, {
      state: {
        profile,
      },
    });
  };
  // 현재 표시 중인 카드
  const current = profiles[0] || null;
  // 카드가 모두 제거되었을 경우
  if (!current) {
    return (
      <div className="mt-[15%] flex flex-col items-center justify-center p-[5vw] text-center">
        <h3 className="mt-[2%] text-lg font-bold text-[var(--gray-90)]">
          오늘의 추천을 모두 확인했어요!
        </h3>
        <p className="mt-[2%] mb-[7%] text-sm text-[var(--gray-40)]">
          내일 오전 9시에 새로운 추천을 받을 수 있어요!
        </p>
        <img
          src={NoCardImage}
          alt="suggest"
          className="h-[30%] w-[30%] object-contain"
        />

        <button
          onClick={() => navigate("/community")}
          className="mt-[10%] rounded-lg bg-[var(--gray-70)] px-[6%] py-[2%] text-sm text-[var(--gray-0)]"
        >
          커뮤니티 둘러보기
        </button>
        <button
          onClick={() => navigate("/userpage")}
          className="mt-[3%] rounded-lg border border-[var(--gray-30)] px-[5%] py-[2%] text-sm text-[var(--gray-60)]"
        >
          내 프로필 더 꾸미기
        </button>
      </div>
    );
  }

  return (
    <div className="mt-[3%]">
      {/* 프로필 카드 */}
      <div
        className="mx-auto h-full w-[95%] overflow-hidden rounded-3xl bg-white p-[3%]"
        onClick={() => handleCardClick(current)}
      >
        {/* 상단 이미지 영역 */}
        <div className="relative w-full overflow-hidden rounded-3xl">
          <img
            src={current.image}
            alt="프로필 사진"
            className="aspect-[3/2] w-full object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent px-[4%] py-[3%]">
            <div className="text-lg font-bold text-white">
              {current.name}
              <span className="ml-[3%] text-xs font-normal text-white">
                {current.major} {current.year}
              </span>
            </div>
          </div>
        </div>
        {/* 하단 태그 + 소개 */}
        <div className="flex flex-wrap px-[4.5%] pt-[3%] pb-[1%]">
          {current.tags.map((tag, idx) => (
            <span
              key={idx}
              className={`mr-[2%] mb-[2%] rounded-lg px-[3%] py-[1.5%] text-xs font-semibold ${getTagColor(
                tag,
              )}`}
            >
              {tag}
            </span>
          ))}
          <p className="mt-[0.1rem] line-clamp-3 text-[0.65rem] leading-normal whitespace-pre-line text-black">
            {current.intro}
          </p>
          {/* 하단 버튼 3개 (스킵 / 제안 / 팔로우) */}
          <div
            className="mx-auto mt-[0.5rem] flex gap-[1.5rem]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => handleSkip(current.id)}
              className="flex aspect-square w-[50px] items-center justify-center rounded-full bg-white text-lg shadow-[0_0_12px_rgba(88,88,88,0.19)]"
            >
              <img
                src={CardLeftImage}
                alt="skip"
                className="h-[40%] w-[40%] object-contain"
              />
            </button>
            <button
              onClick={() => handleSuggestClick(current.id)}
              className="flex aspect-square w-[50px] items-center justify-center rounded-full bg-orange-500 text-lg shadow-[0_0_12px_rgba(88,88,88,0.19)]"
            >
              <img
                src={CardMidImage}
                alt="suggest"
                className="h-[40%] w-[40%] object-contain"
              />
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex aspect-square w-[50px] items-center justify-center rounded-full bg-white text-lg shadow-[0_0_12px_rgba(88,88,88,0.19)]"
            >
              <img
                src={CardRightImage}
                alt="follow"
                className="h-[40%] w-[40%] object-contain"
              />
            </button>
          </div>
        </div>
        {/* 페이징 도트 (총 3개, 스킵 횟수에 활성 위치 이동) */}
      </div>
      <div className="mt-[0.5rem] flex justify-center gap-[6px]">
        {Array.from({ length: 3 }).map((_, idx) => (
          <span
            key={idx}
            className={`h-[8px] rounded-full transition-all duration-300 ${
              idx === skipped ? "w-[15px] bg-orange-400" : "w-[8px] bg-gray-300"
            }`}
          />
        ))}
      </div>
      {/* 제안 작성 모달 */}
      {showSuggestModal && selectedProfileId !== null && (
        <CoffeeSuggestModal
          onSubmit={handleSuggestSubmit}
          onCancel={handleSuggestCancel}
        />
      )}
      {/* 제안 완료 모달 */}
      {showCompleteModal && (
        <CoffeeSuggestCompleteModal onClose={handleCompleteClose} />
      )}
    </div>
  );
};

export default ProfileFlip;
