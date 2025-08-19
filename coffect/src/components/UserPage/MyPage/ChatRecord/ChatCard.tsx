/*
author : 재하
description : 커피챗 기록 상세 카드를 출력하는 컴포넌트입니다.
*/

import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSpecifyCoffeeChat } from "@/api/home";
import { type getSpecifyCoffeeChatType } from "@/types/mypage/ChatRecord";
import LoadingScreen from "@/components/shareComponents/LoadingScreen";
import backIcon from "@/assets/icon/mypage/back.png";

const ChatCard = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // getSpecifyCoffeeChat API를 useQuery로 호출
  const {
    data: coffeeChatData,
    isLoading,
    error,
  } = useQuery<getSpecifyCoffeeChatType["success"]>({
    queryKey: ["specifyCoffeeChat", id],
    queryFn: () => {
      const chatId = Number(id);
      if (!Number.isFinite(chatId)) {
        throw new Error("잘못된 채팅 ID");
      }
      return getSpecifyCoffeeChat({ coffectId: chatId });
    },
    enabled: typeof id === "string" && /^[0-9]+$/.test(id),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  // 로딩 상태 처리
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 에러 상태 처리
  if (error || !coffeeChatData) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-white px-4">
        <div className="mb-4 text-lg font-bold text-[var(--gray-90)]">
          커피챗 상세 정보를 불러오는데 실패했습니다
        </div>
        <button
          onClick={() => navigate("/mypage/chatrecord")}
          className="rounded-md bg-[var(--gray-70)] px-4 py-2 text-white"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  // 날짜 형식을 "년도.월.일 오전/오후 시"로 변환하는 함수
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = date.getHours();
    const ampm = hours >= 12 ? "오후" : "오전";
    const displayHours = hours > 12 ? hours - 12 : hours;

    return `${year}.${month}.${day} ${ampm} ${displayHours}시`;
  };

  const color1 =
    coffeeChatData.color1 === "" ? "#e4e4e4" : coffeeChatData.color1;
  const color2 =
    coffeeChatData.color2 === "" ? "#e4e4e4" : coffeeChatData.color2;

  return (
    <div
      className="flex h-full w-full flex-col overflow-y-auto px-4"
      style={{
        background: `linear-gradient(to bottom right, ${color2}, ${color1}, ${color2})`,
      }}
    >
      {/* 상단 네비게이션 영역 */}
      <div className="flex min-h-14 items-center">
        <button onClick={() => navigate(-1)}>
          <img src={backIcon} className="h-6 w-6" alt="back" />
        </button>
      </div>

      {/* 카드 영역 */}
      <div className="mb-14 flex flex-1 items-center justify-center">
        <div className="flex w-[90%] max-w-xs flex-col items-center justify-center rounded-3xl border border-white bg-white/50 py-10 backdrop-blur-md">
          {/* 날짜/시간 */}
          <div className="mb-7 text-center text-sm text-[var(--gray-60)]">
            {formatDateTime(coffeeChatData.coffeeDate)}
          </div>

          {/* 프로필 이미지 2개 (겹침) */}
          <div className="mb-4 flex items-center justify-center">
            <div className="z-11 h-28 w-28 rounded-full border-4 border-white bg-white">
              <img
                src={coffeeChatData.firstUserImage}
                className="h-full w-full rounded-full object-cover"
                alt="profile1"
              />
            </div>
            <img
              src={coffeeChatData.secondUserImage}
              className="z-10 -ml-6 h-28 w-28 rounded-full border-4 border-white object-cover"
              alt="profile2"
            />
          </div>

          {/* 타이틀 */}
          <div className="mb-8 text-center text-2xl font-semibold text-[var(--gray-80)]">
            {coffeeChatData.opponentName}님과의
            <br />
            첫번째 커피챗 기록
          </div>

          {/* 장소 */}
          <div className="rounded-full bg-white px-3 py-3 text-sm text-[var(--gray-70)]">
            @{coffeeChatData.location}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
