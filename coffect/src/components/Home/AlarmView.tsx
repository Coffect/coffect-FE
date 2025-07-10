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
    <div className="flex items-center gap-3 border-b-2 border-gray-200 bg-white px-4 py-4">
      {/* 프로필 이미지 + 빨간 점 */}
      <div className="relative">
        <img
          src={image}
          alt="profile"
          className="mt-2 h-[6vh] w-[6vh] rounded-full object-cover"
        />
        {unread && (
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
        )}
      </div>

      {/* 텍스트 내용 */}
      <div className="flex flex-col">
        <p className="text-sm">
          <span>{username}님이</span>
          {message}
        </p>
        <p className="mt-[1.5vw] text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
};

// 전체 알림 리스트 화면
const AlarmView = () => {
  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-white">
      {/* 상단바 */}
      <div className="flex">
        <TopNavbar pageType="alarm" />
      </div>

      {/* 알림 리스트 or 빈 상태 */}
      {dummyAlarms.length === 0 ? (
        <NoAlarm />
      ) : (
        dummyAlarms.map((alarm) => <AlarmItemView key={alarm.id} {...alarm} />)
      )}
    </div>
  );
};

export default AlarmView;
