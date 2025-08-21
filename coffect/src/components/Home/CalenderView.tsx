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
import LoadingScreen from "@/components/shareComponents/LoadingScreen"; // 로딩 화면
import { formatDate, formatTime, getTimeUntil } from "@/utils/dateUtils";
import { getProfile } from "@/api/profile"; // 내 프로필 이름 조회용

// API 응답 타입 정의
interface ScheduleItem {
  opponentId: number;
  coffeeDate: string; // ISO 형식
  location: string;
  firstUserImage: string;
  secondUserImage: string;
  opponentName?: string;
}

const CalendarView: React.FC = () => {
  //  내 이름 조회 (스케줄 로딩과는 독립적으로 처리)
  const { data: myName = "" } = useQuery<string>({
    queryKey: ["myProfileName"],
    queryFn: async (): Promise<string> => {
      const me = await getProfile();
      // 백엔드 응답 형태를 그대로 사용 (없는 경우 빈 문자열)
      return me.success?.userInfo.name ?? "";
    },
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시
    retry: false,
  });

  // 일정 + 이름 보강해서 가져오기
  const { data: schedules = [], isLoading } = useQuery<ScheduleItem[], Error>({
    queryKey: ["coffeeChatSchedule"],
    queryFn: async (): Promise<ScheduleItem[]> => {
      const raw = await getCoffeeChatSchedule();
      const completed = await Promise.all(
        raw.map(async (item: ScheduleItem): Promise<ScheduleItem> => {
          try {
            const stringId = await getUserStringId(item.opponentId);
            const name = await getUserNameById(stringId);
            return { ...item, opponentName: name };
          } catch {
            return { ...item, opponentName: "알 수 없는 사용자" };
          }
        }),
      );
      return completed;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  // 로딩 중에는 전체 화면 로딩만 표시 (상단바/본문 렌더 X)
  if (isLoading) return <LoadingScreen />;

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[var(--gray-0)]">
      {/* 상단 네비바 */}
      <div className="flex">
        <TopNavbar pageType="calendar" />
      </div>

      {/* 메인: 일정 리스트 */}
      <main className="flex-1 overflow-y-auto bg-[var(--gray-5)]">
        {schedules.length === 0 ? (
          <NoSchedule />
        ) : (
          <div>
            <div className="flex flex-col px-[1rem]">
              {/* 내 프로필 이름 */}
              <h1 className="mt-[1.2rem] mb-[1rem] ml-[1vw] text-left text-xl font-bold">
                <span className="text-orange-500">{myName || "사용자"}</span>
                님의 커피챗 일정
              </h1>
            </div>
            <div className="flex flex-col items-center py-4">
              <div className="w-[90%] max-w-md space-y-4">
                {schedules.map((item, idx) => (
                  <div key={idx} className="rounded-2xl bg-[var(--gray-0)] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <span className="rounded-[14px] bg-[var(--gray-60)] px-2 py-1 text-sm font-normal text-[var(--gray-0)]">
                          {formatDate(item.coffeeDate)}
                        </span>
                        <span className="ml-1 rounded-[14px] bg-orange-500 px-2 py-1 text-sm font-normal text-[var(--gray-0)]">
                          {getTimeUntil(item.coffeeDate)}
                        </span>
                      </div>
                      <div className="flex items-center text-base font-medium text-[var(--gray-50)]">
                        <Clock className="mr-1 h-4 w-4 text-[var(--gray-50)]" />
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

                    <div className="mt-2 text-sm font-medium text-[var(--gray-60)]">
                      @ {item.location}
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
