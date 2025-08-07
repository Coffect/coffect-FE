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
import CardLeftImage from "../../assets/icon/home/CardLeft.png";
import CardMidImage from "../../assets/icon/home/CardMid.png";
import CardRightUpImage from "@/assets/icon/home/CardRightUp.png";
import CardRightDownImage from "@/assets/icon/home/CardRightDown.png";
import NoCardImage from "../../assets/icon/home/NoCard.png";
import type { UserProfile } from "@/types/home";
import {
  DeleteCard,
  getCurrentRecommendedCard,
  postSuggestCoffeeChat,
} from "@/api/home";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToastStore } from "@/hooks/useToastStore";

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

const ProfileFlip: React.FC = () => {
  // 토스트 표시, 숨김
  const { showToast, hideToast } = useToastStore();

  // 커피챗 제안 요청을 처리
  const { mutate: suggestCoffeeChat } = useMutation({
    mutationFn: async ({ message, id }: { message: string; id: number }) =>
      await postSuggestCoffeeChat(message, id),
    onSuccess: () => {
      setShowSuggestModal(false);
      setShowCompleteModal(true);

      // 카드 제거 애니메이션 후 삭제 및 다음 카드 불러오기
      setSkipAnimation(true);
      setTimeout(async () => {
        try {
          await DeleteCard();
          await refetch();
        } finally {
          setSkipped((prev) => {
            const next = prev + 1;
            localStorage.setItem("skippedCardCount", next.toString());
            return next;
          });
          setSkipAnimation(false);
        }
      }, 300);
    },
    onError: () => {
      showToast("한 글자 이상 입력해주세요!", "error");
    },
  });

  // 서버에서 프로필 카드 데이터 불러오기
  const { data: currentCard, refetch } = useQuery<UserProfile | null>({
    queryKey: ["recommendedCard"],
    queryFn: async () => {
      const hasVisited = localStorage.getItem("cardViewVisited");
      if (!hasVisited) {
        await DeleteCard();
        localStorage.setItem("cardViewVisited", "true");
      }

      try {
        const res = await getCurrentRecommendedCard();
        return {
          id: res.userId,
          name: res.name,
          major: "",
          year: res.grade,
          tags: res.categoryMatch,
          intro: res.introduce,
          image: res.profileImage,
          answers: [],
        };
      } catch {
        return null;
      }
    },
  });
  const navigate = useNavigate();
  // 현재 스킵된 카드 수 (로컬스토리지에서 불러오기->다른 라우팅 위치 이동 이후에도 같은 페이징 유지를 위해)
  const [skipped, setSkipped] = useState(() => {
    const stored = localStorage.getItem("skippedCardCount");
    return stored ? parseInt(stored) : 0;
  });
  // 스킵 애니메이션 동작 여부
  const [skipAnimation, setSkipAnimation] = useState(false);
  // 커피챗 제안 대상 프로필 ID
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
    null,
  );
  // 커피챗 제안 모달 열림 여부
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  // 커피챗 제안 완료 모달 열림 여부
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  // 팔로우 여부
  const [isFollowing, setIsFollowing] = useState(false);

  // 카드 제거(왼쪽 버튼)
  const handleSkip = async () => {
    setSkipAnimation(true);
    setTimeout(async () => {
      try {
        await DeleteCard();
        await refetch();
      } finally {
        setSkipped((prev) => {
          const next = prev + 1;
          localStorage.setItem("skippedCardCount", next.toString());
          return next;
        });
        setSkipAnimation(false);
      }
    }, 300);
  };

  // 커피쳇 제안 모달 열기(가운데 버튼)
  const handleSuggestClick = (id: number) => {
    setSelectedProfileId(id);
    setShowSuggestModal(true);
  };
  // 제안 메시지 작성 완료
  const handleSuggestSubmit = (message: string) => {
    // 프로필 ID가 없으면 리턴
    if (selectedProfileId === null) return;

    // useMutation을 통해 요청 실행
    suggestCoffeeChat({ message, id: selectedProfileId });
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

  // 오른쪽 버튼(팔로우) 클릭 시 상태 토클 및 토스트 메시지
  const handleFollowToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 방지
    setIsFollowing((prevState) => {
      const nowState = !prevState; // 팔로우 상태 토글
      // 팔로우 추가일 때만 토스트 표시
      if (nowState) {
        showToast("@님을 팔로우했어요!", "success");
      } else {
        // 팔로우 해제 시 즉시 토스트 숨김
        hideToast();
      }
      return nowState;
    });
  };

  // 카드 클릭 시 상세 페이지 이동
  const handleCardClick = (profile: UserProfile) => {
    navigate(`/home/cards/${profile.id}`, {
      state: {
        profile,
      },
    });
  };

  // 카드가 모두 제거되었을 경우
  if (!currentCard) {
    return (
      <div className="mt-[15%] flex flex-col items-center justify-center pt-[5vh] pb-20 text-center">
        <h3 className="mt-[2%] text-xl font-bold text-[var(--gray-90)]">
          오늘의 추천을 모두 확인했어요!
        </h3>
        <p className="mt-[2%] mb-[7%] text-base font-medium text-[var(--gray-40)]">
          내일 오전 9시에 새로운 추천을 받을 수 있어요!
        </p>
        <img
          src={NoCardImage}
          alt="suggest"
          className="h-[30%] w-[30%] object-contain"
        />

        <button
          onClick={() => navigate("/community")}
          className="mt-[8%] rounded-lg bg-[var(--gray-70)] px-[6%] py-[3%] text-base text-[var(--gray-0)]"
        >
          커뮤니티 둘러보기
        </button>
        <button
          onClick={() => navigate("/mypage/myprofile")}
          className="mt-[3%] rounded-lg border-[1.5px] border-[var(--gray-30)] px-[4%] py-[3%] text-base text-[var(--gray-60)]"
        >
          내 프로필 더 꾸미기
        </button>
      </div>
    );
  }

  return (
    <div className="mt-[3%] px-[6%]">
      {/* 프로필 카드 */}
      <div
        className={`mx-auto h-full w-full transform overflow-hidden rounded-[20px] bg-white p-[3%] shadow-[0_0_20px_4px_rgba(189,179,170,0.2)] transition-all duration-500 ease-in-out ${
          skipAnimation
            ? "origin-top-right translate-x-[60%] -translate-y-[60%] -rotate-[75deg] opacity-0"
            : "origin-center translate-x-0 translate-y-0 rotate-0 opacity-100"
        }`}
        onClick={() => handleCardClick(currentCard)}
      >
        {/* 상단 이미지 영역 */}
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[20px]">
          <img
            src={currentCard.image}
            alt="프로필 사진"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute top-1.5 left-3 rounded-[60px] bg-[#2D2D2D]/90 px-3 py-1 text-[14px] font-semibold text-[var(--gray-10)]">
            {skipped + 1}/3
          </div>
          <div className="absolute bottom-0 left-0 w-full rounded-b-[20px] bg-gradient-to-t from-black/70 to-transparent px-[4%] py-[5%]">
            <div className="text-[22px] font-bold text-white">
              {currentCard.name}
              <span className="ml-[3%] text-sm font-medium text-[var(--gray-10)]">
                {currentCard.major} {String(currentCard.year).slice(2)}학번
              </span>
            </div>
          </div>
        </div>
        {/* 하단 태그 + 소개 */}
        <div className="flex flex-wrap px-[2%] pt-[3%] pb-[1%]">
          {currentCard.tags.map((tag, idx) => (
            <span
              key={idx}
              className={`mr-[2%] mb-[2%] rounded-[7px] px-[3.5%] py-[1.5%] text-sm font-medium ${getTagColor(
                tag,
              )}`}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap px-[2%]">
          <p className="mt-[0.2rem] line-clamp-3 text-base leading-normal font-medium text-[var(--gray-70)]">
            {currentCard.intro}
          </p>
        </div>
        {/* 하단 버튼 3개 (스킵 / 제안 / 팔로우) */}
        <div className="flex flex-wrap">
          <div
            className="mx-auto mt-[1.5rem] mb-[1rem] flex gap-[1rem]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => handleSkip()}
              className="flex aspect-square w-[60px] items-center justify-center rounded-full bg-white text-lg shadow-[0_0_12px_rgba(88,88,88,0.19)]"
            >
              <img
                src={CardLeftImage}
                alt="skip"
                className="h-[40%] w-[40%] object-contain"
              />
            </button>
            <button
              onClick={() => currentCard && handleSuggestClick(currentCard.id)}
              className="flex aspect-square w-[60px] items-center justify-center rounded-full bg-orange-500 text-lg shadow-[0_0_12px_rgba(88,88,88,0.19)]"
            >
              <img
                src={CardMidImage}
                alt="suggest"
                className="h-[40%] w-[40%] object-contain"
              />
            </button>
            <button
              onClick={handleFollowToggle}
              className="flex aspect-square w-[60px] items-center justify-center rounded-full bg-white text-lg shadow-[0_0_12px_rgba(88,88,88,0.19)]"
            >
              <img
                src={isFollowing ? CardRightDownImage : CardRightUpImage}
                alt="follow"
                className="h-[40%] w-[40%] object-contain"
              />
            </button>
          </div>
        </div>
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
