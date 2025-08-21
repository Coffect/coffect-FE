/*
author : 재하
description : 마이페이지와 다른 사용자 페이지를 모두 처리합니다.
*/
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import {
  getProfile,
  getProfileSearch,
  getIsCoffeeChat,
  postChatStart,
  getProfileThread,
  getProfileThreadSearch,
} from "@/api/profile";
import { getIsFollow, postFollowRequest } from "@/api/follow";
import type {
  postChatStartType,
  getIsCoffeeChatType,
  profileType,
  getProfileThreadType,
} from "@/types/mypage/profile";
import type { getIsFollowType } from "@/types/mypage/follow";
import backIcon from "@/assets/icon/mypage/back.png";
import profileImg from "@/assets/icon/mypage/profile.png";
import FeedItem from "@/components/shareComponents/FeedItem";

import emptyFeedImg from "@/assets/icon/mypage/emptyFeed.png";
import DetailIntroKeyword from "./DetailIntroKeyword";
import DetailIntroProfile from "./DetailIntroProfile";
import { useCoffeeSuggest } from "@/hooks/useCoffeeSuggest";
import { AxiosError } from "axios";
import CoffeeSuggestModal from "@/components/shareComponents/CoffeeSuggestModal";
import CoffeeSuggestCompleteModal from "@/components/shareComponents/CoffeeSuggestCompleteModal";
import LoadingScreen from "@/components/shareComponents/LoadingScreen";
import FeedListSkeleton from "@/components/communityComponents/feed/FeedListSkeleton";

type ProfileTab = "피드" | "상세 소개";

function Profile() {
  /*
  통합된 프로필 컴포넌트 - URL 파라미터에 따라 마이페이지 또는 다른 사용자 페이지를 렌더링합니다.
  */
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 현재 활성화된 탭 상태 ("피드" 또는 "상세 소개")
  const [activeTab, setActiveTab] = useState<ProfileTab>("피드");
  // 텍스트 확장 상태
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  // 텍스트가 2줄 이상인지 확인하는 상태
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  // 텍스트 참조
  const textRef = useRef<HTMLParagraphElement>(null);
  // 팔로우 상태 (다른 사용자 페이지에서만 사용)
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  // 피드 무한 스크롤: 화면에 보여줄 게시글 개수
  const PAGE_SIZE = 10;
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { ref: sentinelRef, inView } = useInView({
    threshold: 0,
    root: scrollContainerRef.current,
  });

  // URL 파라미터에 따라 마이페이지인지 다른 사용자 페이지인지 판단
  const { id = "" } = useParams<{ id: string }>();

  // API 호출 - 현재 로그인한 사용자 정보 가져오기
  const { data: myProfileData, isLoading: isMyProfileLoading } =
    useQuery<profileType>({
      queryKey: ["profile"],
      queryFn: getProfile,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });

  // 현재 로그인한 사용자 ID
  const currentUserId: string | unknown = myProfileData?.success?.userInfo?.id;

  // URL 파라미터와 현재 사용자 ID 비교하여 마이페이지 여부 판단
  const isMyProfile: boolean = !id || id === currentUserId;

  // API 호출 - 메인 프로필 데이터 호출 (마이페이지면 getProfile, 아니면 getProfileSearch)
  const { data: profileData, isLoading: isProfileLoading } =
    useQuery<profileType>({
      queryKey: isMyProfile ? ["profile"] : ["profileSearch", id],
      queryFn: isMyProfile ? getProfile : () => getProfileSearch(id!),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      enabled: isMyProfile || !!id, // 마이페이지이거나 id가 있을 때만 실행
    });
  // 프로필 데이터
  const profile = profileData?.success;
  const userInfo = profile?.userInfo;

  // 팔로잉 상태 확인 API 호출 (다른 사용자 페이지에서만)
  const { data: followData, isLoading: isFollowLoading } =
    useQuery<getIsFollowType>({
      queryKey: ["isFollow", id],
      queryFn: () => getIsFollow(userInfo?.userId || 0),
      enabled: !isMyProfile && userInfo?.userId !== undefined,
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분
    });

  // 팔로잉 상태 설정 (API 응답이 있을 때)
  useEffect(() => {
    if (followData?.success !== null && followData?.success !== undefined) {
      setIsFollowing(followData.success);
    }
  }, [followData]);

  // 팔로우 요청 mutation
  const followMutation = useMutation({
    mutationFn: (userId: number) => postFollowRequest(userId),
    onSuccess: () => {
      // 성공 시 팔로우 상태 무효화하여 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ["isFollow", id] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["profileSearch", id] });
    },
    onError: (error) => {
      console.error("팔로우 요청 실패:", error);
    },
  });

  const { data: isCoffeeChatData, isLoading: isCoffeeChatLoading } =
    useQuery<getIsCoffeeChatType>({
      queryKey: ["isCoffeeChat", id],
      queryFn: () => getIsCoffeeChat(userInfo?.userId || 0),
      enabled: !isMyProfile && userInfo?.userId !== undefined,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });

  // 제안/채팅 버튼 상태 분기
  const coffeeChatStatus = isCoffeeChatData?.success;
  const isCoffeeChat: boolean = coffeeChatStatus?.isCoffeeChat === true;
  const isCheck = coffeeChatStatus?.check === true;
  let coffeeChatButtonText = "불러오는 중";
  let coffeeChatButtonDisabled = true;
  if (!isCoffeeChat && !isCoffeeChatLoading) {
    coffeeChatButtonText = "제안하기";
    coffeeChatButtonDisabled = false;
  } else if (isCoffeeChat && !isCheck) {
    coffeeChatButtonText = "제안 중";
    coffeeChatButtonDisabled = true; // 클릭 무효
  } else if (isCoffeeChat && isCheck) {
    coffeeChatButtonText = "채팅하기";
    coffeeChatButtonDisabled = false;
  }

  const {
    isSuggestOpen,
    isCompleteOpen,
    openSuggest,
    closeSuggest,
    submitSuggest,
    closeComplete,
  } = useCoffeeSuggest();

  const handleClick = () => openSuggest(userInfo?.userId || 0);

  // 채팅 시작
  const { mutate: chatStart, isPending: isChatStarting } = useMutation({
    mutationFn: (userId: number) => postChatStart(userId),
    onSuccess: () => {
      navigate("/chat");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorData = error.response?.data as postChatStartType;
        if (errorData?.error?.errorCode === "EC409") {
          navigate(`/chat/${errorData.error.data}`);
        }
      }
    },
  });

  // 완료 모달 닫을 때 커피챗 상태 쿼리 새로고침
  const handleCloseComplete = () => {
    closeComplete();
    queryClient.invalidateQueries({ queryKey: ["isCoffeeChat", id] });
  };

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
    window.addEventListener("resize", checkOverflow); // 이 부분을 react로 할 수는 없나?

    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  // 작성 게시글, 팔로우, 팔로잉 숫자 포맷팅 함수
  const formatCount: (num: number) => string = (num) => {
    if (num >= 1_000_000_000_000)
      return Math.floor(num / 1_000_000_000_000) + "T+";
    if (num >= 1_000_000_000) return Math.floor(num / 1_000_000_000) + "B+";
    if (num >= 1_000_000) return Math.floor(num / 1_000_000) + "M+";
    if (num >= 1_000) return Math.floor(num / 1_000) + "K+";
    return num.toString();
  };

  const { data: profileThreadData, isLoading: isProfileThreadLoading } =
    useQuery<getProfileThreadType>({
      queryKey: isMyProfile ? ["profileThread"] : ["profileThreadSearch", id],
      queryFn: isMyProfile
        ? getProfileThread
        : () => getProfileThreadSearch(id!),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      enabled: isMyProfile || !!id, // 마이페이지이거나 id가 있을 때만 실행
    });
  const profileThreadPosts = profileThreadData?.success || [];
  const sortedProfileThreadPosts = [...profileThreadPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  // 프로필/사용자 변경 또는 데이터 갱신 시 최초 페이지 크기로 리셋
  useEffect(() => {
    setVisibleCount(Math.min(PAGE_SIZE, sortedProfileThreadPosts.length));
  }, [id, isMyProfile, sortedProfileThreadPosts.length]);

  // sentinel 이 보이면 다음 청크를 로드
  useEffect(() => {
    if (!inView) return;
    if (visibleCount >= sortedProfileThreadPosts.length) return;
    setVisibleCount((prev) =>
      Math.min(prev + PAGE_SIZE, sortedProfileThreadPosts.length),
    );
  }, [inView, visibleCount, sortedProfileThreadPosts.length]);

  // 로딩 중일 때 처리
  if (
    isMyProfileLoading ||
    isProfileLoading ||
    isFollowLoading ||
    isCoffeeChatLoading ||
    isProfileThreadLoading
  ) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          className="pr-9 text-left text-3xl"
          onClick={() => navigate(-1)}
        >
          <img src={backIcon} className="h-6 w-6" />
        </button>
        <div className="flex-1 items-center justify-center pr-15 text-center">
          <span className="text-lg font-semibold">
            {userInfo?.id || "사용자 아이디"}
          </span>
        </div>
      </div>

      <div
        className="flex flex-1 flex-col overflow-y-auto"
        ref={scrollContainerRef}
      >
        {/* Profile Section: 프로필 이미지와 통계 정보 */}
        <div className="px-4 py-2">
          <div className="mb-4 flex flex-row items-center justify-center">
            {/* Profile Image: 사용자 프로필 이미지 자리 */}
            <img
              src={userInfo?.profileImage || profileImg}
              className="flex h-25 w-25 overflow-hidden rounded-full border-[1.5px] border-[var(--gray-10)] object-cover"
            />

            {/* Stats: 포스트/팔로워/팔로잉 수 */}
            <div className="flex flex-1 items-center justify-evenly">
              <div className="text-center">
                <div className="text-lg font-semibold text-[var(--gray-70)]">
                  {formatCount(profile?.threadCount || 0)}
                </div>
                <div className="text-sm text-[var(--gray-50)]">포스트</div>
              </div>
              <button
                className="flex flex-col items-center text-center"
                onClick={() => navigate(`/followerList/${userInfo?.userId}`)}
              >
                <span className="text-lg font-semibold text-[var(--gray-70)]">
                  {formatCount(profile?.following || 0)}
                </span>
                <span className="text-sm text-[var(--gray-50)]">팔로워</span>
              </button>
              <button
                className="flex flex-col items-center text-center"
                onClick={() => navigate(`/followingList/${userInfo?.userId}`)}
              >
                <span className="text-lg font-semibold text-[var(--gray-70)]">
                  {formatCount(profile?.follower || 0)}
                </span>
                <span className="text-sm text-[var(--gray-50)]">팔로잉</span>
              </button>
            </div>
          </div>

          {/* Profile Info: 사용자 이름, 전공, 학번, 자기소개 */}
          <div className="mb-4 ml-2">
            <p className="text-xl font-bold text-[var(--gray-90)]">
              {userInfo?.name || "사용자 이름"}
            </p>
            <div className="mb-1 flex flex-wrap gap-1">
              <span className="text-sm text-[var(--gray-40)]">
                {userInfo?.dept || "전공"}
              </span>
              <span className="text-sm text-[var(--gray-40)]">
                {userInfo?.studentId
                  ? `${userInfo.studentId % 100}학번`
                  : "학번"}
              </span>
            </div>
            <div className="relative">
              <p
                ref={textRef}
                className={`text-sm text-[var(--gray-70)] ${
                  !isExpanded && isOverflowing ? "line-clamp-2" : ""
                }`}
              >
                {userInfo?.introduce || "자기소개가 없습니다."}
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

          {/* Profile Buttons: 마이페이지와 다른 사용자 페이지에서 다른 버튼 표시 */}
          {isMyProfile ? (
            // 마이페이지: 프로필 수정 버튼
            <button
              className="text-md mb-3.5 w-full rounded-lg bg-[var(--gray-60)] py-3 text-white"
              onClick={() => navigate("/mypage/myprofile/modify")}
            >
              프로필 수정
            </button>
          ) : (
            // 다른 사용자 페이지: 팔로우/팔로잉, 채팅하기 버튼
            <div className="mb-3.5 flex w-full gap-x-2">
              <button
                className={`text-md w-full rounded-lg py-3 text-white ${isFollowing ? "bg-[var(--orange-500)]" : "bg-[var(--gray-60)]"}`}
                onClick={() => {
                  followMutation.mutate(userInfo?.userId || 0);
                }}
                disabled={
                  followMutation.isPending ||
                  !userInfo?.userId ||
                  userInfo?.userId === 0
                }
              >
                {followMutation.isPending
                  ? "처리중..."
                  : isFollowing
                    ? "팔로잉"
                    : "팔로우"}
              </button>
              <button
                className={`text-md w-full rounded-lg border border-[var(--gray-30)] bg-white py-3 text-[var(--gray-50)]`}
                disabled={
                  coffeeChatButtonDisabled ||
                  userInfo?.userId === undefined ||
                  isChatStarting
                }
                onClick={() => {
                  if (coffeeChatButtonText === "채팅하기") {
                    chatStart(userInfo?.userId || 0);
                  } else if (coffeeChatButtonText === "제안하기") {
                    handleClick();
                  }
                }}
              >
                {isChatStarting && coffeeChatButtonText === "채팅하기"
                  ? "연결 중..."
                  : coffeeChatButtonText}
              </button>
              {isSuggestOpen && (
                <CoffeeSuggestModal
                  onSubmit={submitSuggest}
                  onCancel={closeSuggest}
                />
              )}
              {isCompleteOpen && (
                <CoffeeSuggestCompleteModal onClose={handleCloseComplete} />
              )}
            </div>
          )}
        </div>

        {/* 탭 구분선 */}
        <div className="min-h-2 w-full bg-[var(--gray-5)]"></div>

        {/* Tab Navigation: 피드/상세 소개 탭 전환 */}
        <div className="mt-3 flex">
          <button
            className={`flex-1 border-b-2 border-[var(--gray-10)] py-3 text-center text-lg ${
              activeTab === "피드"
                ? "border-b-2 border-[var(--gray-90)] font-semibold text-black"
                : "font-medium text-[var(--gray-50)]"
            }`}
            onClick={() => setActiveTab("피드")}
          >
            피드
          </button>
          <button
            className={`flex-1 border-b-2 border-[var(--gray-10)] py-3 text-center text-lg ${
              activeTab === "상세 소개"
                ? "border-b-2 border-[var(--gray-90)] font-semibold text-black"
                : "font-medium text-[var(--gray-50)]"
            }`}
            onClick={() => setActiveTab("상세 소개")}
          >
            상세 소개
          </button>
        </div>

        {/* Content Area: 탭에 따라 내용 분기 */}
        <div className="flex flex-1 flex-col py-5">
          {/* 피드 탭이 활성화된 경우 피드 내용 출력 */}
          {activeTab === "피드" &&
            (sortedProfileThreadPosts.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center">
                <span className="text-md mb-3 text-[var(--gray-50)]">
                  아직 작성한 글이 없어요!
                </span>
                <img src={emptyFeedImg} className="h-10 w-10 opacity-40" />
              </div>
            ) : (
              <>
                {sortedProfileThreadPosts.slice(0, visibleCount).map((post) => (
                  <FeedItem
                    key={post.threadId}
                    post={post}
                    showFollowButton={false}
                    showBookmarkButton={true}
                  />
                ))}
                {visibleCount < sortedProfileThreadPosts.length && (
                  <>
                    <div
                      ref={sentinelRef}
                      className="flex h-1 justify-center py-4"
                    >
                      <FeedListSkeleton count={1} />
                    </div>
                  </>
                )}
              </>
            ))}

          {/* 상세 소개 탭이 활성화된 경우 상세 소개 컴포넌트 출력 */}
          {activeTab === "상세 소개" && (
            <div className="flex w-full flex-col justify-center px-4">
              {/* 관심 키워드 컴포넌트 */}
              <DetailIntroKeyword
                interest={profile?.interest}
                isReadOnly={!isMyProfile}
              />
              {/* 상세 프로필 컴포넌트 */}
              <DetailIntroProfile
                profileDetailData={profile?.specifyProfile?.info || []}
                isReadOnly={!isMyProfile}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
