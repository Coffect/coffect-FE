/*
  author      : 이희선
  description : 추천카드(프로필) 상세 보기 페이지 입니다.  
                - 상단 고정 네비게이션
                - 중단: 이미지, 자기소개, Q&A 표시
                - 하단 고정 버튼: 스킵, 제안, 팔로우   
*/

import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import CardLeftImage from "../../assets/Home/CardLeft.png";
import CardMidImage from "../../assets/Home/CardMid.png";
import CardRightImage from "../../assets/Home/CardRight.png";

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

const CardDetailView = () => {
  const navigate = useNavigate(); // 페이지 이동 함수
  const location = useLocation(); // 전달받은 props(state)를 읽기 위함

  // 전달받은 상태에서 profile, onSkip, onSuggest 추출
  const { profile, onSkip, onSuggest } =
    (location.state as {
      profile: UserProfile;
      onSkip?: () => void;
      onSuggest?: () => void;
    }) || {};
  //프로필 정보가 없을 때
  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center text-[var(--gray-90)]">
        프로필 정보를 찾을 수 없습니다.
      </div>
    );
  }

  // 뒤로 가기
  const handleBack = () => navigate(-1);

  // 왼쪽 버튼 클릭 시: 카드 스킵 콜백 호출 후 뒤로가기
  const handleSkipClick = () => {
    if (onSkip) onSkip();
    navigate(-1);
  };

  // 가운데 버튼 클릭 시: 커피쳇 제안 모달 콜백 호출 후 뒤로가기
  const handleSuggestClick = () => {
    if (onSuggest) onSuggest();
    navigate(-1);
  };

  return (
    <div className="flex h-screen flex-col">
      {/* 상단 네비게이션 (뒤로가기 + 타이틀) */}
      <div className="relative z-10 flex flex-none items-center bg-[var(--gray-0)] px-4 py-3 shadow-md">
        <button onClick={handleBack} className="absolute left-4">
          <ChevronLeft className="h-6 w-6 text-[var(--gray-90)]" />
        </button>
        <h1 className="mx-auto text-lg font-semibold">상세 정보</h1>
      </div>
      {/* 중간 콘텐츠 (스크롤) */}
      <div className="flex-1 overflow-y-auto bg-[var(--gray-0)]">
        {/* 프로필 이미지 */}
        <div className="relative h-[45%] w-full overflow-hidden">
          <img
            src={profile.image}
            alt="프로필 이미지"
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-1/10 left-1/2 z-20 -translate-x-1/2 transform rounded-xl bg-black/60 px-3 py-1 text-sm font-medium whitespace-nowrap text-[var(--gray-0)]">
            인하님과 비슷한 관심사를 가졌어요!
          </div>
        </div>

        {/* 상세 정보, 구분선 */}
        <div className="relative z-10 -mt-[5%] divide-y-2 divide-[var(--gray-5)] rounded-t-3xl bg-[var(--gray-0)] px-4 pt-8">
          {/* 이름 및 학과/학번 */}
          <div className="pb-6">
            <h2 className="text-[22px] font-bold text-[var(--gray-80)]">
              {profile.name}
              <span className="ml-2 text-sm font-medium text-[var(--gray-40)]">
                {profile.major} {profile.year}
              </span>
            </h2>
          </div>
          {/* 관심 키워드 */}
          <div className="pt-4 pb-4">
            <h3 className="mb-4 flex items-center gap-1 text-lg font-semibold">
              <span>💡</span> 관심 키워드
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.tags.map((tag, i) => (
                <span
                  key={i}
                  className={`rounded-7px px-3 py-1 text-sm font-medium ${getTagColor(
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
            <h3 className="mb-4 flex items-center gap-1 text-lg font-semibold text-[var(--gray-90)]">
              👋자기소개
            </h3>
            <p className="text-[16px] leading-normal font-medium whitespace-pre-line text-[var(--gray-60)]">
              {profile.intro}
            </p>
          </div>
          {/* QnA */}
          <div className="pt-4 pb-4">
            {profile.answers.map((qa, idx) => (
              <div key={idx} className={idx > 0 ? "mt-6" : ""}>
                <p className="text-base font-medium text-[var(--gray-40)]">
                  Q. {qa.question}
                </p>
                <p className="mt-1 text-base font-medium whitespace-pre-line text-[var(--gray-70)]">
                  {qa.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 하단 버튼 바 (고정) */}
      <div className="flex flex-none justify-around bg-[var(--gray-0)] px-20 py-3.5">
        <button
          onClick={() => handleSkipClick}
          className="flex aspect-square w-[60px] items-center justify-center rounded-full bg-[var(--gray-0)] text-lg shadow-[0_0_12px_rgba(88,88,88,0.19)]"
        >
          <img
            src={CardLeftImage}
            alt="skip"
            className="h-[40%] w-[40%] object-contain"
          />
        </button>
        <button
          onClick={() => handleSuggestClick}
          className="flex aspect-square w-[60px] items-center justify-center rounded-full bg-orange-500 text-lg shadow-[0_0_12px_rgba(88,88,88,0.19)]"
        >
          <img
            src={CardMidImage}
            alt="suggest"
            className="h-[40%] w-[40%] object-contain"
          />
        </button>
        <button className="flex aspect-square w-[60px] items-center justify-center rounded-full bg-[var(--gray-0)] text-lg shadow-[0_0_12px_rgba(88,88,88,0.19)]">
          <img
            src={CardRightImage}
            alt="follow"
            className="h-[40%] w-[40%] object-contain"
          />
        </button>
      </div>
    </div>
  );
};

export default CardDetailView;
