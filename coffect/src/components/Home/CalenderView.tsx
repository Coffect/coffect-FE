/*
  author      : 이희선
  description : 전체 일정 목록을 보여주는 화면 컴포넌트
*/
import TopNavbar from "./TopNavbar";
import { Clock } from "lucide-react";
import NoSchedule from "./NoSchedule";
import {
  getCoffeeChatSchedule,
  getUserNameById,
  getUserStringId,
} from "@/api/home";
import { useQuery } from "@tanstack/react-query";

// API 응답 타입 정의
interface ScheduleItem {
  opponentId: string;
  coffeeDate: string; // ISO 형식
  location: string;
  firstUserImage: string;
  secondUserImage: string;
  opponentName?: string;
}

/**
 * 일정 뷰 컴포넌트
 */
const CalendarView: React.FC = () => {
  const { data: schedules = [] } = useQuery<ScheduleItem[], Error>({
    queryKey: ["coffeeChatSchedule"],
    queryFn: async (): Promise<ScheduleItem[]> => {
      const raw = await getCoffeeChatSchedule();
      const completed = await Promise.all(
        raw.map(async (item: ScheduleItem): Promise<ScheduleItem> => {
          try {
            const stringId = await getUserStringId(Number(item.opponentId));
            const name = await getUserNameById(stringId);
            return { ...item, opponentName: name };
          } catch {
            return { ...item, opponentName: "누구신지..." };
          }
        }),
      );
      return completed;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  //  날짜 포맷 변환 (ISO → YYYY.MM.DD)
  const formatDate = (isoDate: string) => {
    const dateObj = new Date(isoDate);
    return dateObj
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\./g, "")
      .replace(/ /g, ".");
  };
  // 약속 시간 HH:MM
  const formatTime = (isoDate: string) => {
    const dateObj = new Date(isoDate);
    return dateObj.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };
  //약속 일자까지 남은 일 수 계산
  const calculateDaysAway = (isoDate: string) => {
    const today = new Date();
    const target = new Date(isoDate);
    const diff = Math.ceil(
      (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff;
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[var(--gray-0)]">
      {/* 상단 네비바 */}
      <div className="flex">
        <TopNavbar pageType="calendar" />
      </div>

      {/* 메인: 일정 리스트 */}
      <main className="flex-1 overflow-y-auto bg-[var(--gray-5)]">
        {schedules.length === 0 ? (
          // 일정이 없을 경우: NoSchedule 컴포넌트 렌더링
          <NoSchedule />
        ) : (
          // 일정이 있을 경우: 리스트 렌더링
          <div>
            <div className="flex flex-col px-[1rem]">
              <h1 className="mt-[1.2rem] mb-[1rem] ml-[1vw] text-left text-xl font-bold">
                <span className="text-orange-500">이인하</span>님의 커피챗 일정
              </h1>
            </div>
            <div className="flex flex-col items-center py-4">
              <div className="w-[90%] max-w-md space-y-4">
                {schedules.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-[var(--gray-0)] p-4 shadow"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <span className="rounded-[14px] bg-[var(--gray-60)] px-2 py-1 text-sm font-medium text-[var(--gray-0)]">
                          {formatDate(item.coffeeDate)}
                        </span>
                        <span className="ml-1 rounded-[14px] bg-orange-500 px-2 py-1 text-sm font-semibold text-[var(--gray-0)]">
                          {calculateDaysAway(item.coffeeDate)}일 뒤
                        </span>
                      </div>
                      <div className="flex items-center text-sm font-medium text-[var(--gray-50)]">
                        <Clock className="mt-0.5 mr-1 h-3 w-3 text-[var(--gray-50)]" />
                        {formatTime(item.coffeeDate)}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 flex -space-x-2">
                        <img
                          src={item.firstUserImage}
                          className="h-8 w-8 rounded-full border-2 border-white"
                        />
                        <img
                          src={item.secondUserImage}
                          className="h-8 w-8 rounded-full border-2 border-white"
                        />
                      </div>
                      <div>
                        <div className="text-base font-semibold text-[var(--gray-90)]">
                          {item.opponentName}님과의 커피챗
                        </div>
                      </div>
                    </div>
                    <div className="my-1 text-sm font-medium text-[var(--gray-60)]">
                      @{item.location}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CalendarView;
