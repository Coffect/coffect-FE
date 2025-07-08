/*
  author      : 이희선
  description : 프로필 카드 플립 컴포넌트 (한 장씩 표시 및 X 클릭 시 다음 카드)
                - 카드 클릭 시 내용 자세히 보기 페이지(CardDetail)로 이동
                - ❌ 버튼: 현재 카드 제거
                - ☕ 버튼: 커피챗 제안 모달 열기
                - ➕ 버튼: 팔로워 요청(아직 작동x)
*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CoffeeSuggestModal from "./CoffeeSuggestModal";
import CoffeeSuggestCompleteModal from "./CoffeeSuggestCompleteModal";

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

// 태그별 Tailwind 색상 클래스 반환
const getTagColor = (tag: string) => {
  switch (tag) {
    case "창업":
      return "bg-orange-200 text-orange-800";
    case "개발":
      return "bg-green-200 text-green-800";
    case "디자인":
      return "bg-yellow-200 text-yellow-800";
    case "기획":
      return "bg-pink-200 text-pink-800";
    case "AI":
      return "bg-red-200 text-red-800";
    case "글쓰기":
      return "bg-purple-200 text-purple-800";
    case "독서":
      return "bg-blue-200 text-blue-800";
    case "마케팅":
      return "bg-indigo-200 text-indigo-800";
    case "여행":
      return "bg-teal-200 text-teal-800";
    case "데이터 분석":
      return "bg-indigo-100 text-indigo-800";
    case "하드웨어":
      return "bg-yellow-100 text-yellow-800";
    case "영화":
      return "bg-blue-100 text-blue-800";
    case "외국어":
      return "bg-purple-100 text-purple-800";
    case "악기":
      return "bg-blue-100 text-blue-800";
    case "네트워킹":
      return "bg-gray-200 text-gray-800";
    default:
      return "bg-gray-100 text-gray-600";
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

  const [profiles, setProfiles] = useState<UserProfile[]>(dummyData);
  const [skipped, setSkipped] = useState(0);

  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
    null,
  );
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const handleSkip = (id: number) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    setSkipped((prev) => prev + 1);
  };

  const handleSuggestClick = (id: number) => {
    setSelectedProfileId(id);
    setShowSuggestModal(true);
  };

  const handleSuggestSubmit = () => {
    setShowSuggestModal(false);
    setShowCompleteModal(true);
  };

  const handleSuggestCancel = () => {
    setShowSuggestModal(false);
    setSelectedProfileId(null);
  };

  const handleCompleteClose = () => {
    setShowCompleteModal(false);
    setSelectedProfileId(null);
  };

  const handleCardClick = (profile: UserProfile) => {
    navigate("/home/cards/${profile.id}", { state: { profile } });
  };

  const current = profiles[0] || null;

  if (!current) {
    return (
      <div className="mt-[15%] flex flex-col items-center justify-center p-[5vw] text-center">
        <h3 className="mt-[2%] text-lg font-bold text-gray-800">
          오늘의 추천을 모두 확인했어요!
        </h3>
        <p className="mt-[2%] mb-[7%] text-xs text-gray-600">
          내일 오전 9시에 새로운 추천을 받을 수 있어요!
        </p>
        <span className="text-6xl text-orange-500">📭</span>

        <button
          onClick={() => navigate("/community")}
          className="mt-[10%] rounded-lg bg-black px-[6%] py-[2%] text-sm text-white"
        >
          커뮤니티 둘러보기
        </button>
        <button
          onClick={() => navigate("/userpage")}
          className="border-gr mt-[3%] rounded-lg border px-[5%] py-[2%] text-sm text-gray-700"
        >
          내 프로필 더 꾸미기
        </button>
      </div>
    );
  }

  return (
    <div className="mt-[3%]">
      <div
        className="mx-auto h-full w-[95%] overflow-hidden rounded-3xl bg-white p-[1%]"
        onClick={() => handleCardClick(current)}
      >
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
          <p className="leading-relex mt-[2.5%] line-clamp-3 text-xs whitespace-pre-line text-black">
            {current.intro}
          </p>
          <div
            className="mx-auto mt-[3%] flex gap-[30px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => handleSkip(current.id)}
              className="flex aspect-square w-[50px] items-center justify-center rounded-full bg-white text-lg shadow-[0_0_12px_rgba(88,88,88,0.19)]"
            >
              ❌
            </button>
            <button
              onClick={() => handleSuggestClick(current.id)}
              className="flex aspect-square w-[50px] items-center justify-center rounded-full bg-orange-500 text-lg shadow-[0_0_12px_rgba(88,88,88,0.19)]"
            >
              ☕
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex aspect-square w-[50px] items-center justify-center rounded-full bg-white text-lg shadow-[0_0_12px_rgba(88,88,88,0.19)]"
            >
              ➕
            </button>
          </div>
        </div>
        {/* 페이징 도트 (총 3개, skipped에 따라 활성 위치 이동) */}
      </div>
      <div className="mt-[1.5%] flex justify-center gap-[6px]">
        {Array.from({ length: 3 }).map((_, idx) => (
          <span
            key={idx}
            className={`h-[8px] rounded-full transition-all duration-300 ${
              idx === skipped ? "w-[13px] bg-orange-400" : "w-[8px] bg-gray-300"
            }`}
          />
        ))}
      </div>

      {showSuggestModal && selectedProfileId !== null && (
        <CoffeeSuggestModal
          onSubmit={handleSuggestSubmit}
          onCancel={handleSuggestCancel}
        />
      )}

      {showCompleteModal && (
        <CoffeeSuggestCompleteModal onClose={handleCompleteClose} />
      )}
    </div>
  );
};

export default ProfileFlip;
