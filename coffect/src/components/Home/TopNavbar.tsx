/*
author      : 이희선
description : 상단 네비게이션 바 컴포넌트입니다. 
              홈/캘린더/알림 페이지에 따라 서로 다른 레이아웃을 표시합니다.
*/

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import LogoImage from "../../assets/icon/home/Logo.png";
import { getUnreadCount } from "@/api/alert";
import AlarmImage from "../../assets/icon/home/alert.png";
import CalenderImage from "../../assets/icon/home/calender.png";

/*
  props.pageType : 'home' | 'calendar' | 'alarm' 형태로 받아 상황에 따라 상단바를 다르게 표시합니다.
*/
interface TopNavbarProps {
  pageType: "home" | "calendar" | "alarm";
}

const TopNavbar = ({ pageType }: TopNavbarProps) => {
  const navigate = useNavigate();

  // 아이콘 공통 크기
  const iconClass = "text-[var(--gray-90)] w-6 h-6";

  // 안 읽은 알림 개수
  const [unread, setUnread] = useState<number>(0);

  // 최초 마운트 및 pageType 변경 시 안읽은 개수 갱신
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getUnreadCount(); // { resultType, error, success: number }
        if (!mounted) return;
        const count = Number(res?.success ?? 0);
        setUnread(Number.isFinite(count) ? count : 0);
      } catch {
        // 실패 시 조용히 무시(점 표시 없음)
      }
    })();
    return () => {
      mounted = false;
    };
  }, [pageType]);

  // 뒤로가기 버튼 처리 함수
  const handleBack = () => navigate(-1);

  /*
    pageType에 따라 홈 / 캘린더 / 알림 화면별로 다른 UI 구성
    - home: 좌측 로고 + 우측 캘린더/알림 아이콘(알림에 빨간 점 표시)
    - calendar, alarm: 좌측 뒤로가기 + 중앙 타이틀 + 우측 공백 (정렬 맞춤용)
  */
  return (
    <div
      className={`flex h-[60px] w-full items-center justify-between px-[5%] ${
        pageType === "alarm" ? "bg-[var(--gray-0)]" : "bg-[var(--gray-5)]"
      }`}
    >
      {pageType === "home" ? (
        <>
          {/* 좌측 로고 */}
          <img src={LogoImage} alt="로고" className="mt-1 h-5.5" />

          {/* 우측 아이콘: 캘린더, 알림 */}
          <div className="flex items-center space-x-2">
            <Link to="/calendar" className="inline-block">
              <img
                src={CalenderImage}
                alt="캘린더 보기"
                className="h-auto w-[28px] cursor-pointer object-contain select-none"
                title="캘린더로 이동"
              />
            </Link>

            {/* 알림 아이콘 + 빨간 점 */}
            <div className="relative mt-2">
              <Link to="/alarm" className="inline-block">
                <img
                  src={AlarmImage}
                  alt="캘린더 보기"
                  className="h-auto w-[28px] cursor-pointer object-contain select-none"
                  title="캘린더로 이동"
                />
              </Link>
              {unread > 0 && (
                <span
                  aria-label="읽지 않은 알림"
                  className="absolute -top-[0.5px] -right-0 h-2 w-2 rounded-full border-2 border-[var(--gray-5)] bg-[var(--noti)]"
                />
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* 좌측: 뒤로가기 */}
          <button onClick={handleBack} aria-label="뒤로가기">
            <ChevronLeft className={iconClass} />
          </button>

          {/* 중앙: 타이틀 */}
          <h1 className="text-lg font-semibold text-[var(--gray-90)] antialiased">
            {pageType === "calendar" ? "일정" : "알림"}
          </h1>

          {/* 우측: 정렬 유지용 빈 박스 */}
          <div className="h-[6vw] w-[3vw]" />
        </>
      )}
    </div>
  );
};

export default TopNavbar;
