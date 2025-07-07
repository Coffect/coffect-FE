/*
  author      : 이희선
  description : 전체 일정 목록을 보여주는 화면 컴포넌트
*/
import React from "react";
import TopNavbar from "./TopNavbar";
import { Clock } from "lucide-react";
import NoSchedule from "./NoSchedule";

interface ScheduleItem {
  id: number;
  date: string; // YYYY.MM.DD
  daysAway: number; // 몇 일 뒤
  time: string; // HH:mm
  participants: string[]; // 프로필 URL
  title: string;
  location: string;
}

// 더미 일정 데이터
const dummySchedules: ScheduleItem[] = [
  {
    id: 1,
    date: "2025.07.03",
    daysAway: 1,
    time: "14:00",
    participants: [
      "https://picsum.photos/seed/user1/40",
      "https://picsum.photos/seed/user2/40",
    ],
    title: "라떼님과의 커피챗",
    location: "@스타벅스 인하대사거리점",
  },
  {
    id: 2,
    date: "2025.07.04",
    daysAway: 2,
    time: "16:30",
    participants: [
      "https://picsum.photos/seed/user1/40",
      "https://picsum.photos/seed/user2/40",
    ],
    title: "라떼님과의 커피챗",
    location: "@커피빈 인하대사거리점",
  },
  {
    id: 3,
    date: "2025.07.05",
    daysAway: 3,
    time: "10:15",
    participants: [
      "https://picsum.photos/seed/user1/40",
      "https://picsum.photos/seed/user2/40",
    ],
    title: "라떼님과의 커피챗",
    location: "@이디야 인하대사거리점",
  },
];

/**
 * 일정 뷰 컴포넌트
 */
const CalendarView: React.FC = () => {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-white">
      {/* 상단 네비바 */}
      <div className="flex">
        <TopNavbar pageType="calendar" />
      </div>

      {/* 메인: 일정 리스트 */}
      <main className="flex-1 overflow-y-auto bg-gray-100">
        {dummySchedules.length === 0 ? (
          // 일정이 없을 경우: NoSchedule 컴포넌트 렌더링
          <NoSchedule />
        ) : (
          // 일정이 있을 경우: 리스트 렌더링
          <div>
            <div className="flex flex-col px-[5vw]">
              <h1 className="mt-[5vh] mb-[1vh] ml-[1vw] text-left text-xl font-bold">
                <span className="text-orange-500">이인하</span>님의 커피챗 일정
              </h1>
            </div>
            <div className="flex flex-col items-center py-4">
              <div className="w-[90%] max-w-md space-y-4">
                {dummySchedules.map((item) => (
                  <div key={item.id} className="rounded-xl bg-white p-4 shadow">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <span className="rounded-full bg-gray-500 px-2 py-1 text-xs text-white">
                          {item.date}
                        </span>
                        <span className="ml-1 rounded-full bg-orange-500 px-2 py-1 text-xs text-white">
                          {item.daysAway}일 뒤
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="mr-1 h-4 w-4" />
                        {item.time}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 flex -space-x-2">
                        {item.participants.map((src, idx) => (
                          <img
                            key={idx}
                            src={src}
                            alt="avatar"
                            className="h-8 w-8 rounded-full border-2 border-white"
                          />
                        ))}
                      </div>
                      <div>
                        <div className="text-base font-semibold">
                          {item.title}
                        </div>
                      </div>
                    </div>
                    <div className="my-1 text-sm text-gray-800">
                      {item.location}
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
