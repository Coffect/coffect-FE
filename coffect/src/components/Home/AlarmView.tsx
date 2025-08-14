/*
  author      : 이희선
  description : 전체 알림 목록을 보여주는 화면 컴포넌트
*/

import TopNavbar from "./TopNavbar";
import NoAlarm from "./NoAlarm"; // 추가: 알림 없음 컴포넌트 import

interface AlarmItem {
  id: number;
  username: string;
  message: string;
  time: string;
  image: string;
  unread?: boolean;
}

// 더미 알림 데이터 (없을 때는 빈 배열로 테스트)
const dummyAlarms: AlarmItem[] = [
  {
    id: 1,
    username: "김라떼",
    message: " 커피챗을 수락했어요!",
    time: "2분전",
    image: "https://picsum.photos/seed/user1/40",
    unread: true,
  },
  {
    id: 2,
    username: "김라떼",
    message: " 회원님의 게시글을 좋아합니다!",
    time: "1시간전",
    image: "https://picsum.photos/seed/user2/40",
    unread: false,
  },
  {
    id: 3,
    username: "김라떼",
    message: " 회원님을 팔로우하기 시작했어요!",
    time: "3일전",
    image: "https://picsum.photos/seed/user3/40",
    unread: false,
  },
];

// 알림 항목 UI
const AlarmItemView = ({
  username,
  message,
  time,
  image,
  unread,
}: AlarmItem) => {
  return (
    <div className="flex items-center gap-[12px] border-b-2 border-[var(--gray-10)] bg-[var(--gray-0)] py-4 pl-[5%]">
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
          <span>{username}님이</span>
          {message}
        </p>
        <p className="mt-[0.3rem] text-sm font-medium text-[var(--gray-40)]">
          {time}
        </p>
      </div>
    </div>
  );
};

// 전체 알림 리스트 화면
const AlarmView = () => {
  return (
    <div className="relative flex h-screen w-full flex-col bg-[var(--gray-0)]">
      {/* 상단바 */}
      <div className="flex">
        <TopNavbar pageType="alarm" />
      </div>
      {/* 알림 리스트 or 빈 상태 */}
      <div className="flex-1 overflow-y-auto">
        {dummyAlarms.length === 0 ? (
          <NoAlarm />
        ) : (
          dummyAlarms.map((alarm) => (
            <AlarmItemView key={alarm.id} {...alarm} />
          ))
        )}
      </div>
    </div>
  );
};

export default AlarmView;
