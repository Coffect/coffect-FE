/*
  author      : 이희선
  description : 프로필 상세 보기 페이지 (카드 뒷면 내용)
                - 상단바 고정
                - 하단 버튼 바 고정 (❌, ☕, ➕)
                - 중간 콘텐츠만 스크롤
                - 카드 이미지 위로 둥근 모서리로 덮임
                - 각 콘텐츠 섹션마다 회색 구분선 적용
                - 관심 키워드에 맞는 색상 적용
*/

import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import CoffeeSuggestModal from "./CoffeeSuggestModal";
import CoffeeSuggestCompleteModal from "./CoffeeSuggestCompleteModal";

// 전달받은 프로필 타입 정의
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

// 태그별 Tailwind 색상 매핑 함수
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

const CardDetailView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profile = location.state?.profile as UserProfile | undefined;

  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        프로필 정보를 찾을 수 없습니다.
      </div>
    );
  }

  // 핸들러들
  const handleBack = () => navigate(-1);
  const handleSkip = () => navigate(-1);
  const handleSuggestClick = () => setShowSuggestModal(true);
  const handleSuggestSubmit = () => {
    setShowSuggestModal(false);
    setShowCompleteModal(true);
  };
  const handleSuggestCancel = () => setShowSuggestModal(false);
  const handleCompleteClose = () => setShowCompleteModal(false);
  const handleFollow = () =>
    alert(`${profile.name}님에게 팔로우 요청을 보냈습니다.`);

  return (
    <div className="flex h-screen flex-col">
      {/* 상단 네비게이션 (고정) */}
      <div className="relative z-10 flex flex-none items-center bg-white px-4 py-3 shadow-md">
        <button onClick={handleBack} className="absolute left-4">
          <ChevronLeft className="h-6 w-6 text-black" />
        </button>
        <h1 className="mx-auto text-lg font-semibold">상세 정보</h1>
      </div>

      {/* 중간 콘텐츠 (스크롤, 배경 흰색) */}
      <div className="flex-1 overflow-y-auto bg-white">
        {/* 프로필 이미지 */}
        <div className="relative h-[45%] w-full overflow-hidden">
          <img
            src={profile.image}
            alt="프로필 이미지"
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-1/10 left-1/2 z-20 -translate-x-1/2 transform rounded-xl bg-black/60 px-3 py-1 text-xs whitespace-nowrap text-white">
            인하님과 비슷한 관심사를 가졌어요!
          </div>
        </div>

        {/* 세부 내용 박스 (둥근 상단 + 구분선) */}
        <div className="relative z-10 -mt-[5%] divide-y divide-gray-200 rounded-t-3xl bg-white px-6 pt-5 pb-5">
          {" "}
          {/* 이름 및 학과/학번 */}
          <div className="pb-4">
            <h2 className="text-lg font-semibold">
              {profile.name}
              <span className="ml-2 text-xs font-normal text-gray-500">
                {profile.major} {profile.year}
              </span>
            </h2>
          </div>
          {/* 관심 키워드 */}
          <div className="pt-4 pb-4">
            <h3 className="mb-2 flex items-center gap-1 text-sm font-semibold">
              <span>💡</span> 관심 키워드
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.tags.map((tag, i) => (
                <span
                  key={i}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getTagColor(
                    tag,
                  )}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {/* 자기소개 */}
          <div className="pt-4 pb-4">
            <h3 className="mb-2 flex items-center gap-1 text-sm font-semibold">
              <span>👋</span> 자기소개
            </h3>
            <p className="text-xs leading-normal whitespace-pre-line text-gray-700">
              {profile.intro}
            </p>
          </div>
          {/* QnA */}
          <div className="pt-4 pb-4">
            {profile.answers.map((qa, idx) => (
              <div key={idx} className={idx > 0 ? "mt-6" : ""}>
                <p className="text-xs font-semibold text-[#848484]">
                  Q. {qa.question}
                </p>
                <p className="mt-1 text-xs font-medium whitespace-pre-line text-[#3A3A3A]">
                  {qa.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 버튼 바 (고정) */}
      <div className="flex flex-none justify-around bg-white px-14 py-4 shadow-inner">
        <button
          onClick={handleSkip}
          className="flex aspect-square w-[50px] items-center justify-center rounded-full bg-white text-lg shadow-[0_0_12px_rgba(88,88,88,0.19)]"
        >
          ❌
        </button>
        <button
          onClick={handleSuggestClick}
          className="flex aspect-square w-[50px] items-center justify-center rounded-full bg-orange-500 text-lg shadow-[0_0_12px_rgba(88,88,88,0.19)]"
        >
          ☕
        </button>
        <button
          onClick={handleFollow}
          className="flex aspect-square w-[50px] items-center justify-center rounded-full bg-white text-lg shadow-[0_0_12px_rgba(88,88,88,0.19)]"
        >
          ➕
        </button>
      </div>

      {/* 제안 모달 */}
      {showSuggestModal && (
        <CoffeeSuggestModal
          onSubmit={handleSuggestSubmit}
          onCancel={handleSuggestCancel}
        />
      )}

      {/* 완료 모달 */}
      {showCompleteModal && (
        <CoffeeSuggestCompleteModal onClose={handleCompleteClose} />
      )}
    </div>
  );
};

export default CardDetailView;
