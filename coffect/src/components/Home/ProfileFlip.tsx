/*
  author      : 이희선
  description : 프로필 카드 플립 컴포넌트 (한 장씩 표시 및 X 클릭 시 다음 카드)
                - 카드 클릭 시 앞/뒤 내용 전환
                - ❌ 버튼: 현재 카드 제거
                - ☕ 버튼: 커피챗 제안 모달 열기
                - ➕ 버튼: 추후 확장용
*/

import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
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
  keywords: string[];
  answers: { question: string; answer: string }[];
}

// 임시 사용자 데이터 (더미)
const dummyData: UserProfile[] = [
  {
    id: 1,
    name: "김성장",
    major: "경영학과",
    year: "23학번",
    tags: ["창업", "마케팅", "PM", "AI"],
    intro:
      "안녕하세요! 사람과 이야기를 나누는 것을 좋아하고,\n새로운 것을 배우는 데 늘 열려 있는 뉴비입니다.\n즐겁고 의미 있는 경험을 함께 만들고 싶어요!",
    image: "https://picsum.photos/200?random=3",
    keywords: [
      "린스타트업",
      "사용자리서치",
      "MVP개발",
      "그로스해킹",
      "비즈니스모델",
      "투자유치",
    ],
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
    year: "21학번",
    tags: ["개발", "독서", "AI"],
    intro: "꾸준함이 제 무기입니다.\n좋은 사람들과 함께 성장하고 싶어요.",
    image: "https://picsum.photos/200?random=4",
    keywords: ["리액트", "타입스크립트", "랭체인", "UX"],
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
];

const ProfileFlip: React.FC = () => {
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState<UserProfile[]>(dummyData); // 현재 보여줄 프로필 리스트
  const [flipped, setFlipped] = useState<Record<number, boolean>>({}); // 각 카드의 플립 상태
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
    null,
  ); // 제안 대상 프로필 ID
  const [showSuggestModal, setShowSuggestModal] = useState(false); // 제안 모달 여부
  const [showCompleteModal, setShowCompleteModal] = useState(false); // 완료 모달 여부

  const handleFlip = (id: number) => {
    // 카드 앞/뒷면 전환
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSkip = (id: number) => {
    // 현재 카드 제거
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSuggestClick = (id: number) => {
    // ☕ 버튼 클릭 시 제안 모달 열기
    setSelectedProfileId(id);
    setShowSuggestModal(true);
  };

  const handleSuggestSubmit = () => {
    // 제안 제출 완료
    setShowSuggestModal(false);
    setShowCompleteModal(true);
  };

  const handleSuggestCancel = () => {
    // 제안 취소
    setShowSuggestModal(false);
    setSelectedProfileId(null);
  };

  const handleCompleteClose = () => {
    // 완료 모달 닫기
    setShowCompleteModal(false);
    setSelectedProfileId(null);
  };

  const current = profiles[0] || null; // 현재 보여줄 카드 (맨 앞 프로필)

  if (!current) {
    // 카드가 모두 소진되었을 경우
    return (
      <div className="mt-[15vh] flex flex-col items-center justify-center p-[5vw] text-center">
        <CheckCircle className="h-[10vw] w-[10vw] text-green-500" />
        <h3 className="mt-[3vh] text-[4vw] font-semibold text-gray-800">
          오늘의 추천을 모두 확인했어요!
        </h3>
        <p className="mt-[2vh] text-[3vw] text-gray-600">
          내일 오전 9시에 새로운 추천을 받을 수 있어요!
        </p>
        <button
          onClick={() => navigate("/community")}
          className="mt-[4vh] w-full rounded-[1vw] bg-black py-[2vh] text-[3.5vw] text-white"
        >
          커뮤니티 둘러보기
        </button>
        <button
          onClick={() => navigate("/userpage")}
          className="mt-[2vh] w-full rounded-[1vw] border border-gray-400 py-[2vh] text-[3.5vw] text-gray-700"
        >
          내 프로필 더 꾸미기
        </button>
      </div>
    );
  }

  return (
    <div className="px-[5vw]">
      {/* 카드 플립 UI */}
      <div
        key={current.id}
        className="relative h-[60vh] w-full cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => handleFlip(current.id)}
      >
        <div
          className="relative h-full w-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped[current.id]
              ? "rotateY(180deg)"
              : "rotateY(0deg)",
          }}
        >
          {/* 카드 앞면 */}
          <div className="absolute h-full w-full overflow-hidden rounded-xl bg-gray-200 backface-hidden">
            <div className="h-[25vh] w-full overflow-hidden rounded-t-xl">
              <img
                src={current.image}
                alt="프로필 사진"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-[4%]">
              <div className="text-[5vw] font-semibold text-gray-800">
                {current.name}
                <span className="ml-[2vw] text-[3vw] font-normal text-gray-600">
                  {current.major} {current.year}
                </span>
              </div>
              <div className="mt-[1vh] flex flex-wrap gap-[2vw]">
                {current.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-sm bg-black px-[2vw] py-[0.9vh] text-[3vw] text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-[3vw] text-[3vw] leading-snug whitespace-pre-line text-gray-700">
                {current.intro}
              </p>
              <div className="mt-[8vh] flex justify-center gap-[6vw]">
                {/* ❌ 스킵 버튼 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSkip(current.id);
                  }}
                  className="flex aspect-square w-[15vw] items-center justify-center rounded-full bg-[#BDBDBD] text-[6vw] text-gray-800"
                >
                  ❌
                </button>
                {/* ☕ 제안 버튼 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSuggestClick(current.id);
                  }}
                  className="flex aspect-square w-[15vw] items-center justify-center rounded-full bg-[#BDBDBD] text-[8vw] text-gray-800"
                >
                  ☕
                </button>
                {/* ➕ 기타 버튼 (예비용) */}
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex aspect-square w-[15vw] items-center justify-center rounded-full bg-[#BDBDBD] text-[7vw] text-gray-800"
                >
                  ➕
                </button>
              </div>
            </div>
          </div>

          {/* 카드 뒷면 */}
          <div
            className="absolute h-full w-full overflow-auto rounded-xl bg-gray-200 p-[5vw] backface-hidden"
            style={{ transform: "rotateY(180deg)" }}
          >
            {/* 관심 키워드 */}
            <h4 className="mb-[0.5vh] px-[2vw] py-[1vh] text-[4vw] font-semibold text-gray-800">
              💡 관심 키워드
            </h4>
            <hr className="mb-[2vh] border-1 border-t border-white" />
            <div className="mb-[4vh] flex flex-wrap gap-[2vw]">
              {current.keywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 px-[3vw] py-[1vh] text-[3vw] text-gray-800"
                >
                  {kw}
                </span>
              ))}
            </div>

            {/* 커피챗 QnA */}
            <h4 className="mb-[0.5vh] px-[2vw] py-[1vh] text-[4vw] font-semibold text-gray-800">
              🎯 {current.name}님의 답변
            </h4>
            <hr className="mb-[2vh] border-1 border-t border-white" />
            <dl className="text-[3vw] leading-[4vw]">
              {current.answers.map((qa, i) => (
                <div key={i} className="mb-[3vw]">
                  <dt className="font-semibold text-gray-500">
                    Q. {qa.question}
                  </dt>
                  <dd className="mt-[1vh] font-semibold whitespace-pre-line text-gray-800">
                    {qa.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* 커피챗 제안 모달 */}
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
