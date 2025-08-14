/*
  author      : 이희선
  description : 프로필 카드 플립 컴포넌트 (한 장씩 표시 및 왼쪽 버튼 클릭 시 다음 카드)
                - 카드 클릭 시 내용 자세히 보기 페이지(CardDetail)로 이동
                - 왼쪽 버튼: 현재 카드 제거
                - 가운데 버튼: 커피챗 제안 모달 열기
                - 오른쪽 버튼: 팔로워 요청
                - 제안 플로우는 useCoffeeSuggest 훅 사용
*/

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CoffeeSuggestModal from "../shareComponents/CoffeeSuggestModal";
import CoffeeSuggestCompleteModal from "../shareComponents/CoffeeSuggestCompleteModal";
import CardLeftImage from "../../assets/icon/home/CardLeft.png";
import CardMidImage from "../../assets/icon/home/CardMid.png";
import CardRightUpImage from "@/assets/icon/home/CardRightUp.png";
import CardRightDownImage from "@/assets/icon/home/CardRightDown.png";
import NoCardImage from "../../assets/icon/home/NoCard.png";
import type { UserProfile } from "@/types/home";
import {
  initOrSkipCard,
  getCurrentRecommendedCard,
  getIsFollow,
  getUserDeptById,
  getUserQnAById,
  getUserStringId,
  postFollowRequest,
} from "@/api/home";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "@/hooks/useToastStore";
import { useCoffeeSuggest } from "@/hooks/useCoffeeSuggest";

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

// 다음 카드까지 보강해서 가져오는 공통 함수
const fetchEnrichedCard = async (): Promise<UserProfile | null> => {
  try {
    const card = await getCurrentRecommendedCard();

    const stringId = await getUserStringId(card.userId);
    const [isFollowRes, deptRes, qnaRes] = await Promise.allSettled([
      getIsFollow(card.userId), // 숫자 id 전달
      getUserDeptById(stringId), // 전공 조회는 문자열 id
      getUserQnAById(stringId), // QnA 조회도 문자열 id
    ]);

    const isFollow =
      isFollowRes.status === "fulfilled" ? !!isFollowRes.value : false;
    const major =
      deptRes.status === "fulfilled" ? (deptRes.value as string) : "";
    const answers = qnaRes.status === "fulfilled" ? (qnaRes.value as []) : [];

    return {
      id: card.userId,
      name: card.name,
      major,
      year: card.grade,
      tags: card.categoryMatch,
      intro: card.introduce,
      image: card.profileImage,
      answers,
      isFollow,
    };
  } catch {
    return null;
  }
};

const ProfileFlip: React.FC = () => {
  // 토스트 표시, 숨김
  const { showToast, hideToast } = useToastStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 제안 플로우 훅 사용
  const {
    isSuggestOpen,
    isCompleteOpen,
    selectedProfileId,
    openSuggest,
    closeSuggest,
    submitSuggest,
    closeComplete,
  } = useCoffeeSuggest();

  // 현재 스킵된 카드 수
  const [skipped, setSkipped] = useState(() => {
    const stored = localStorage.getItem("skippedCardCount");
    return stored ? parseInt(stored) : 0;
  });

  // 스킵 애니메이션 동작 여부
  const [skipAnimation, setSkipAnimation] = useState(false);

  // 팔로우 로컬 상태
  const [isFollowing, setIsFollowing] = useState(false);

  // 서버에서 프로필 카드 데이터 불러오기
  const { data: currentCard } = useQuery<UserProfile | null>({
    queryKey: ["recommendedCard"],
    queryFn: async () => {
      const hasVisited = localStorage.getItem("cardViewVisited");
      if (!hasVisited) {
        await initOrSkipCard();
        localStorage.setItem("cardViewVisited", "true");
      }
      return await fetchEnrichedCard();
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: 0,
  });

  useEffect(() => {
    setIsFollowing(!!currentCard?.isFollow);
  }, [currentCard?.isFollow]);

  // initOrSkipCard 호출 후 다음 카드를 즉시 캐시에 반영하는 뮤테이션
  const skipMutation = useMutation({
    mutationFn: async () => {
      await initOrSkipCard();
      const next = await fetchEnrichedCard();
      return next;
    },
    onMutate: async () => {
      setSkipAnimation(true);
      await queryClient.cancelQueries({ queryKey: ["recommendedCard"] });
    },
    onSuccess: (next) => {
      queryClient.setQueryData(["recommendedCard"], next);
      setSkipped((prev) => {
        const nextCount = prev + 1;
        localStorage.setItem("skippedCardCount", String(nextCount));
        return nextCount;
      });
    },
    onSettled: () => {
      setTimeout(() => setSkipAnimation(false), 300);
    },
  });

  // 제안 완료 모달이 열렸을 때 카드 스킵
  const didSkipAfterSuggestRef = useRef(false);
  useEffect(() => {
    if (isCompleteOpen && !didSkipAfterSuggestRef.current) {
      didSkipAfterSuggestRef.current = true;
      skipMutation.mutate();
    }
    if (!isCompleteOpen) {
      didSkipAfterSuggestRef.current = false;
    }
  }, [isCompleteOpen, skipMutation]);

  // 카드 제거(왼쪽 버튼)
  const handleSkip = (): void => {
    if (!skipMutation.isPending) {
      skipMutation.mutate();
    }
  };

  // 커피쳇 제안 모달 열기(가운데 버튼)
  const handleSuggestClick = (id: number) => {
    openSuggest(id);
  };

  // 제안 메시지 작성 완료
  const handleSuggestSubmit = (message: string) => {
    submitSuggest(message);
  };

  // 제안 작성 취소
  const handleSuggestCancel = () => {
    closeSuggest();
  };

  // 제안 완료 모달 닫기
  const handleCompleteClose = () => {
    closeComplete();
  };

  // 오른쪽 버튼(팔로우) 클릭 시 상태 토글 및 토스트 메시지
  const handleFollowToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard) return;

    // 낙관적 토글
    setIsFollowing((prev) => !prev);
    queryClient.setQueryData<UserProfile | null>(["recommendedCard"], (old) =>
      old ? { ...old, isFollow: !old.isFollow } : old,
    );

    try {
      await postFollowRequest(currentCard.id);
      if (!isFollowing) {
        showToast(`${currentCard.name}님을 팔로우했어요!`, "success");
      } else {
        hideToast();
      }
    } catch {
      // 롤백
      setIsFollowing((prev) => !prev);
      queryClient.setQueryData<UserProfile | null>(
        ["recommendedCard"],
        (old) => (old ? { ...old, isFollow: !old.isFollow } : old),
      );
      showToast("팔로우에 실패했습니다.", "error");
    }
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
    <div className="mt-[7%] px-[4%]">
      {/* 프로필 카드 */}
      <div
        className={`mx-auto h-full w-full transform overflow-hidden rounded-[20px] bg-white p-[3%] shadow-[0_0_20px_4px_rgba(189,179,170,0.2)] transition-all duration-500 ease-in-out ${
          skipMutation.isPending || skipAnimation
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
          <div className="absolute -bottom-2 left-0 w-full rounded-b-[20px] bg-gradient-to-t from-black/90 to-transparent px-[5%] py-[5%]">
            <div className="text-[22px] font-bold text-white">
              {currentCard.name}
              <span className="ml-[3%] text-sm font-medium text-[var(--gray-10)]">
                {currentCard.major} {String(currentCard.year).slice(-2)}학번
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
          <p className="mt-[0.2rem] ml-[2%] line-clamp-3 text-base leading-normal font-medium text-[var(--gray-70)]">
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
              onClick={handleSkip}
              disabled={skipMutation.isPending}
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
              disabled={skipMutation.isPending}
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
              disabled={skipMutation.isPending}
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
      {isSuggestOpen && selectedProfileId !== null && (
        <CoffeeSuggestModal
          onSubmit={handleSuggestSubmit}
          onCancel={handleSuggestCancel}
        />
      )}
      {/* 제안 완료 모달 */}
      {isCompleteOpen && (
        <CoffeeSuggestCompleteModal onClose={handleCompleteClose} />
      )}
    </div>
  );
};

export default ProfileFlip;
