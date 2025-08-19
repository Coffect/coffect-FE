/*
author : 재하
description : 마이페이지에서 나의 커피챗 기록 카드 목록을 출력하는 컴포넌트입니다.
*/

import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPastCoffeeChat } from "@/api/home";
import { type getPastCoffeeChatType } from "@/types/mypage/ChatRecord";
import LoadingScreen from "@/components/shareComponents/LoadingScreen";
import { useInView } from "react-intersection-observer";
import backIcon from "@/assets/icon/mypage/back.png";
import coffeeIcon from "@/assets/icon/mypage/inCoffeeChatRecord.png";
import emptyChatRecordImg from "@/assets/icon/mypage/emptyChatRecord.png";

/*
커피챗 기록 카드 목록을 렌더링하는 함수형 컴포넌트입니다.
*/
const ChatRecord = () => {
  const navigate = useNavigate();

  // getPastCoffeeChat API를 useQuery로 호출
  const {
    data: pastCoffeeChatData,
    isLoading,
    error,
    refetch,
  } = useQuery<getPastCoffeeChatType>({
    queryKey: ["pastCoffeeChat"],
    queryFn: getPastCoffeeChat,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  // 전체 아이템 개수(로딩 중에는 0으로 간주)
  const totalItems = pastCoffeeChatData?.success?.length ?? 0;

  // 무한 스크롤 상태(반드시 early return 이전에 훅 선언)
  const GROUP_SIZE = 3; // 기존 3개씩 묶어 카드 그리드 구성
  const PAGE_GROUPS = 4; // 한 번에 4 그룹(= 12개)씩
  const [visibleGroups, setVisibleGroups] = useState<number>(
    Math.min(PAGE_GROUPS, Math.ceil(totalItems / GROUP_SIZE)),
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { ref: sentinelRef, inView } = useInView({
    threshold: 0,
    root: scrollContainerRef.current,
  });

  // 데이터 변경 시 초기화
  useEffect(() => {
    setVisibleGroups(Math.min(PAGE_GROUPS, Math.ceil(totalItems / GROUP_SIZE)));
  }, [totalItems, setVisibleGroups]);

  // sentinel 관찰되면 추가 그룹 노출
  useEffect(() => {
    if (!inView) return;
    const totalGroups = Math.ceil(totalItems / GROUP_SIZE);
    if (visibleGroups >= totalGroups) return;
    setVisibleGroups((prev) => Math.min(prev + PAGE_GROUPS, totalGroups));
  }, [inView, visibleGroups, totalItems, setVisibleGroups]);

  // 로딩 상태 처리
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-white px-4">
        <div className="mb-4 text-lg font-bold text-[var(--gray-90)]">
          커피챗 기록을 불러오는데 실패했습니다
        </div>
        <button
          onClick={() => refetch()}
          className="rounded-md bg-[var(--gray-70)] px-4 py-2 text-white"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // API 데이터가 있으면 사용하고, 없으면 기존 더미 데이터 사용
  const chatRecordsData = pastCoffeeChatData?.success || [];
  const hasRecords: boolean = chatRecordsData.length > 0;

  return (
    <div
      className="flex h-full w-full flex-col overflow-y-auto bg-white px-4"
      ref={scrollContainerRef}
    >
      {/* 뒤로가기 버튼 */}
      <button className="py-4 text-left text-3xl" onClick={() => navigate(-1)}>
        <img src={backIcon} className="h-6 w-6" />
      </button>

      {/* 상단 중앙 타이틀 및 총 커피챗 기록 */}
      {hasRecords && (
        <div className="mt-2 mb-2 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-[var(--gray-90)]">
            나의 커피챗 기록
          </div>
          <div className="text-md py-2 text-[var(--gray-50)]">
            우리의 연결이 더 큰 영향력이 되도록
          </div>
          <div className="m-4 flex flex-row items-center rounded-full bg-[var(--gray-70)] px-4 py-3">
            <img
              src={coffeeIcon}
              className="mr-2 h-5 w-5 text-[var(--gray-20)]"
            />
            <span className="text-sm text-white">
              {" "}
              총 {chatRecordsData.length}번의 커피챗
            </span>
          </div>
        </div>
      )}

      {/* 커피챗 기록이 있을 때 카드 목록, 없을 때 안내 메시지 */}
      {hasRecords ? (
        <div className="flex flex-col gap-3 py-4">
          {Array.from({ length: visibleGroups }).map((_, groupIdx) => {
            const start = groupIdx * 3;
            const group = chatRecordsData.slice(start, start + 3);
            const isEven = groupIdx % 2 === 0;
            return (
              <div key={groupIdx} className="flex w-full flex-row gap-3">
                {isEven ? (
                  <>
                    {/* 좌측: 정사각 2개 세로 */}
                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                      <div className="aspect-square min-h-0 w-full min-w-0">
                        {group[0] && (
                          <Card record={group[0]} navigate={navigate} />
                        )}
                      </div>
                      <div className="aspect-square min-h-0 w-full min-w-0">
                        {group[2] && (
                          <Card record={group[2]} navigate={navigate} />
                        )}
                      </div>
                    </div>
                    {/* 우측: 세로 긴 카드 */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      {group[1] && (
                        <div className="aspect-[1/2.06] h-full min-h-0 w-full min-w-0">
                          <Card record={group[1]} navigate={navigate} />
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* 좌측: 세로 긴 카드 */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      {group[0] && (
                        <div className="aspect-[1/2.06] h-full min-h-0 w-full min-w-0">
                          <Card record={group[0]} navigate={navigate} />
                        </div>
                      )}
                    </div>
                    {/* 우측: 정사각 2개 세로 */}
                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                      <div className="aspect-square min-h-0 w-full min-w-0">
                        {group[1] && (
                          <Card record={group[1]} navigate={navigate} />
                        )}
                      </div>
                      <div className="aspect-square min-h-0 w-full min-w-0">
                        {group[2] && (
                          <Card record={group[2]} navigate={navigate} />
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
          {visibleGroups < Math.ceil(chatRecordsData.length / GROUP_SIZE) && (
            <>
              <div ref={sentinelRef} className="text-md h-1 text-center">
                더 불러오는 중...
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="mb-15 flex flex-1 flex-col items-center justify-center text-center">
          <p className="mb-3 text-xl font-bold text-[var(--gray-90)]">
            아직 커피챗 기록이 없어요!
          </p>
          <p className="mb-2 text-[var(--gray-50)]">
            지금 바로 추천 카드를 통해
          </p>
          <p className="mb-3 text-[var(--gray-50)]">커피챗을 제안해보세요!</p>
          <img
            src={emptyChatRecordImg}
            alt="채팅 기록 없음"
            className="h-[110px] w-[110px]"
          />
        </div>
      )}
    </div>
  );
};

// 카드 렌더링용 컴포넌트
const Card = ({
  record,
  navigate,
}: {
  record: NonNullable<getPastCoffeeChatType["success"]>[0];
  navigate: (path: string) => void;
}) => {
  // 날짜 형식을 "년도.월.일"로 변환하는 함수
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };
  const color1 = record.color1 === "" ? "#e4e4e4" : record.color1;
  const color2 = record.color2 === "" ? "#e4e4e4" : record.color2;

  return (
    <div
      className={`relative flex h-full min-h-0 w-full min-w-0 items-start justify-start overflow-hidden rounded-xl bg-gradient-to-br`}
      style={{
        background: `linear-gradient(to bottom right, ${color2}, ${color1}, ${color2})`,
      }}
      // 카드 클릭 시 상세로 이동 (임시로 인덱스 사용)
      onClick={() => {
        navigate(`/mypage/chatrecord/${record.coffectId}`);
      }}
    >
      {/* 날짜 */}
      <div className="absolute top-3 right-3 rounded-full bg-white/80 px-3 py-1.5 text-sm text-[var(--gray-60)]">
        {formatDate(record.coffeeDate)}
      </div>
      {/* 이름 */}
      <div className="absolute bottom-4 left-4 text-xl font-semibold text-[var(--gray-70)]">
        {record.opponentName}님과
      </div>
    </div>
  );
};

export default ChatRecord;
