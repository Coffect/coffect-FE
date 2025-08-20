/*
  author      : 이희선
  description : 전체 알림 목록 화면 (API 연동 + 개별 읽음 처리)
*/

import { useEffect, useState } from "react";
import TopNavbar from "./TopNavbar";
import NoAlarm from "./NoAlarm";
import { getNotifications, markAsRead } from "@/api/alert";
import { getTimeAgo } from "@/utils/dateUtils";
import LoadingScreen from "@/components/shareComponents/LoadingScreen";

interface ApiNotification {
  notificationId: number;
  userId: number;
  type: string;
  title: string;
  body: string;
  data?: {
    type?: string;
    coffectId?: string;
    firstUserId?: string;
    firstUserName?: string;
  };
  firstUserImage?: string;
  isRead: boolean;
  createdAt: string; // ISO 문자열
}
interface AlarmItem {
  id: number;
  username: string;
  message: string;
  time: string;
  image: string;
  unread?: boolean;
}

const AlarmItemView = ({
  username,
  message,
  time,
  image,
  unread,
  onClick,
}: AlarmItem & { onClick?: () => void }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-[12px] border-b-2 border-[var(--gray-10)] bg-[var(--gray-0)] py-4 pl-[5%] text-left"
    >
      {/* 프로필 이미지 + 빨간 점 */}
      <div className="relative">
        <img
          src={image}
          alt="profile"
          className="h-[3.5rem] w-[3.5rem] rounded-full object-cover"
        />
        {unread && (
          <span className="absolute -right-1 bottom-10 h-4 w-4 rounded-full border-2 border-[var(--gray-0)] bg-[var(--noti)]" />
        )}
      </div>

      {/* 텍스트 내용 */}
      <div className="flex flex-col">
        <p className="text-base font-medium text-[var(--gray-90)]">
          <span>{username}님의</span>
          {message}
        </p>
        <p className="mt-[0.3rem] text-sm font-medium text-[var(--gray-40)]">
          {time}
        </p>
      </div>
    </button>
  );
};

const AlarmView = () => {
  const [alarms, setAlarms] = useState<AlarmItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 알림 목록 로드
  useEffect(() => {
    (async () => {
      try {
        const res = await getNotifications();
        const mapped: AlarmItem[] = (res?.success ?? []).map(
          (n: ApiNotification) => ({
            id: n.notificationId,
            username: n?.data?.firstUserName ?? "알 수 없음",
            message:
              " " +
              (n?.body
                ? n.body.replace(String(n?.data?.firstUserName ?? ""), "")
                : ""),
            time: getTimeAgo(n.createdAt),
            image: n?.firstUserImage,
            unread: !n.isRead,
          }),
        );
        setAlarms(mapped);
      } catch (e) {
        console.error("알림 불러오기 실패:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 개별 읽음 처리(낙관적 업데이트)
  const handleMarkRead = async (id: number) => {
    // 1) UI 먼저 반영
    const prev = alarms;
    setAlarms((list) =>
      list.map((a) => (a.id === id ? { ...a, unread: false } : a)),
    );

    try {
      await markAsRead(id);
    } catch (e) {
      console.error("읽음 처리 실패:", e);
      // 2) 실패 시 롤백
      setAlarms(prev);
    }
  };

  // 로딩 중에는 전체 화면 로딩만 표시 (상단바/본문 렌더 안 함)
  if (loading) return <LoadingScreen />;

  return (
    <div className="relative flex h-screen w-full flex-col bg-[var(--gray-0)]">
      {/* 상단바 */}
      <div className="flex">
        <TopNavbar pageType="alarm" />
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto">
        {alarms.length === 0 ? (
          <NoAlarm />
        ) : (
          alarms.map((alarm) => (
            <AlarmItemView
              key={alarm.id}
              {...alarm}
              onClick={() => handleMarkRead(alarm.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AlarmView;
